import { CatProductCategory } from '@app/back/cat/entities/product-category.entity'
import { QueryTypes, Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { MyUtils } from '../../utils/my-utils'
import { SetSortDTO } from '../dto/catalog.dto'
import { CatCategoryFlatDTO } from '../dto/category.dto'
import { CatCategory } from '../entities/category.entity'
import { CategoryConnectedUtils } from './category-connected.utils'

export class CategoryUtils {

  static async getCatalogCategories( catalogId: number | null = null ): Promise<CatCategoryFlatDTO[]> {
    const allConnectedIds = await CategoryConnectedUtils.getAllConnectedIds()
    const allCats: CatCategoryFlatDTO[] = await this.getCatalogCategoriesORM( catalogId )
    allCats.forEach( e => {
      e.connectedIds = CategoryConnectedUtils.getConnectedIds( e.id, allConnectedIds )
      e.outdated = !!e.outdated
    } )
    return allCats
  }

  static async addOrUpdateCategories( categories: Partial<CatCategoryFlatDTO>[] ): Promise<CatCategoryFlatDTO[]> {
    const res: CatCategoryFlatDTO[] = []
    for ( const category of categories ) {
      const data = { ...category }

      if ( data.id === 0 ) {
        data.id = null
      }
      if ( data.parentId === 0 ) {
        data.parentId = null
      }
      if ( !data.catalogCode && data.name ) {
        data.catalogCode = MyUtils.sha1( data.name )
      }

      let cat: CatCategory = null
      if ( data.id ) {
        await CatCategory.update( data, { where: { id: data.id }, returning: false } )
        cat = await CatCategory.findByPk( data.id, { rejectOnEmpty: true, raw: true } )
      } else {
        if ( data.catalogCode && data.catalogId ) {
          cat = await CatCategory.findOne( {
            where: { catalogId: data.catalogId, catalogCode: data.catalogCode },
            raw: true,
          } )
          if ( cat ) {
            await CatCategory.update( data, { where: { id: cat.id }, returning: false } )
            cat = await CatCategory.findByPk( cat.id, { rejectOnEmpty: true, raw: true } )
          } else {
            cat = (await CatCategory.create( data )).get()
          }
        }
      }
      if ( !cat ) {
        continue
      }

      // const cat: CatCategory = (await CatCategory.upsert(data))[0].get()
      if ( data.doNotConnectToCommon ) {
        await CategoryConnectedUtils.disconnectAllCategoriesFrom( cat.id )
      }
      if ( data.connectTo ) {
        await CategoryConnectedUtils.setCategoryConnection( true, data.connectTo, cat.id )
      }

      res.push( {
          ...cat as unknown as CatCategoryFlatDTO,
          connectedIds: await CategoryConnectedUtils.getConnectedIdsFromDB( cat.id ),
        },
      )
    }
    return res
  }

  static async deleteCategories( ids: number[] ): Promise<number> {
    return CatCategory.destroy( { where: { id: ids } } )
  }

  static async setCategoriesSort( data: SetSortDTO ): Promise<void> {
    await CatCategory.update( { sortIndex: data.sortIndex }, { returning: false, where: { id: data.id } } )
  }

  static async getChildrenIds( sequelize: Sequelize, id: number ): Promise<number []> {
    return (await sequelize.query<CatCategory>(
      `SELECT DISTINCT id
       FROM cat__category
       WHERE "parentId" = :parentId`, {
        replacements: {
          parentId: id,
        },
        type: QueryTypes.SELECT,
      } )).map( e => e.id )
  }

  static async addChildrenIds( sequelize: Sequelize, arr: number[], id: number ) {
    const ids = await this.getChildrenIds( sequelize, id )
    for ( const e of ids ) {
      arr.push( e )
      await this.addChildrenIds( sequelize, arr, e )
    }
  }

  static async getAllChildrenIds( sequelize: Sequelize, ids: number[] ): Promise<number[]> {
    const arr: number[] = []
    for ( const id of ids ) {
      await this.addChildrenIds( sequelize, arr, id )
    }
    return arr
  }

  private static async getCatalogCategoriesORM( catalogId: number | null ): Promise<CatCategoryFlatDTO[]> {
    return (await CatCategory.findAll( {
      where: catalogId ? { catalogId } : undefined,
      raw: true,
      order: [ 'parentId', 'sortIndex', 'id' ],
    } ))
      .map( e => {
        return {
          ...e,
          id: e.id,
          connectedIds: [],
        }
      } )
  }

  static async addOrUpdateCategory( category: Partial<CatCategory>, getModel = true, transaction?: Transaction ): Promise<CatCategory> {
    if ( category.id === 0 ) {
      category.id = null
    }

    const data: Partial<CatCategory> = {
      ...category,
      catalogCode: category.catalogCode || MyUtils.sha1( category.name ),
    }
    if ( data.id ) {
      await CatCategory.update( data, { where: { id: data.id }, returning: false, transaction } )
      return CatCategory.findByPk( data.id, { raw: !getModel, transaction } )
    }
    if ( data.catalogCode && data.catalogId ) {
      const found = await CatCategory.findOne(
        {
          where: { catalogId: data.catalogId, catalogCode: data.catalogCode },
          raw: true,
          attributes: [ 'id' ],
          transaction,
        },
      )
      if ( found ) {
        await CatCategory.update( data, { where: { id: found.id }, returning: false, transaction } )
        return CatCategory.findByPk( found.id, { raw: !getModel, transaction } )
      } else {
        const m = await CatCategory.create( data, { transaction } )
        return getModel ? m : m.get()
      }
    }
    throw new Error( `addOrUpdateCategory error - ${JSON.stringify( data )}` )
  }

  static async addCategoriesPath( catalogId: number, parts: string[], transaction?: Transaction ): Promise<number[]> {
    const res: number[] = []
    let parent: CatCategory = null
    let name = ''
    let fullNameForHash = ''

    for ( const part of parts ) {
      name = part.trim()
      if ( !name ) {
        continue
      }
      fullNameForHash = fullNameForHash + name
      const data = {
        catalogId,
        name,
        parentId: parent?.id || null,
        catalogCode: MyUtils.sha1( fullNameForHash ),
        outdatedForLoading: false,
      }

      const found = await CatCategory.findOne( {
        where: {
          catalogId: data.catalogId, catalogCode: data.catalogCode,
        },
        raw: true,
        attributes: [ 'id' ],
        transaction,
      } )

      if ( found ) {
        await CatCategory.update( data, { where: { id: found.id }, returning: false, transaction } )
        parent = found
      } else {
        parent = (await CatCategory.create( data, { transaction } )).get()
      }

      res.push( parent.id )
    }
    return res
  }

  static async setCatalogCategoriesParentIdByCatalogCode( catalogId: number, transaction?: Transaction ) {
    const cats = await CatCategory.findAll( {
      where: { catalogId },
      transaction,
    } )

    for ( const cat of cats ) {
      cat.parentId = (await CatCategory.findOne( {
        where: {
          catalogId,
          catalogCode: cat.catalogCodeParent,
        },
        rejectOnEmpty: false,
        transaction,
      } ))?.id || null

      await cat.save( { transaction } )
    }
  }


  static async addOrUpdateProductCategory( data: Partial<CatProductCategory>, transaction?: Transaction ): Promise<void> {
    const cat: Partial<CatProductCategory> = {
      ...data,
      outdatedForLoading: data.outdatedForLoading || false,
    }
    const found = await CatProductCategory.findOne( {
      where: { productId: cat.productId, categoryId: cat.categoryId },
      raw: true,
      attributes: [ 'id' ],
      transaction,
    } )
    if ( found ) {
      await CatProductCategory.update( cat, { where: { id: found.id }, returning: false, transaction } )
    } else {
      await CatProductCategory.create( cat, { returning: false, transaction } )
    }
  }
}

