import { CatProductSpecification } from '@app/back/cat/entities/product-specification.entity'
import { Transaction } from 'sequelize'
import { MyUtils } from '../../utils/my-utils'
import { CatSpecification } from '../entities/specification.entity'

export class SpecificationUtils {
  static async getAll(): Promise<CatSpecification[]> {
    return CatSpecification.findAll( { order: [ 'sortIndex', 'id' ], raw: true } )
  }

  /**  Для вновь созданных поле NEW устанавливается в TRUE
   если    setNewIfInsert = true
   например при вызове через API флаг устанавливать не надо, а при загрузке из каталога - надо
   *  */
  static async addOrUpdate( spec: Partial<CatSpecification>,
                            getModel = false,
                            setNewIfInsert = false, transaction?: Transaction ): Promise<CatSpecification> {
    const data: Partial<CatSpecification> = {
      ...spec,
      outdated: spec.outdated || false,
      outdatedForLoading: spec.outdatedForLoading || false,
    }
    if ( data.id === 0 ) {
      data.id = null
    }
    if ( data.catalogCode === undefined && data.name ) {
      data.catalogCode = MyUtils.sha1( data.name )
    }

    let found
    if ( data.id ) {
      found = await CatSpecification.findByPk( data.id, { rejectOnEmpty: true, transaction } )
    }
    if ( !found ) {
      found = await CatSpecification.findOne( {
        where: { catalogId: data.catalogId, catalogCode: data.catalogCode },
        raw: true,
        transaction,
      } )
    }
    if ( found ) {
      await CatSpecification.update( data, { where: { id: found.id }, transaction } )
      return CatSpecification.findByPk( found.id, { rejectOnEmpty: true, raw: !getModel, transaction } )
    } else {
      const srcData = setNewIfInsert ? { ...data, new: true } : data
      const m = await CatSpecification.create( srcData, { transaction } )
      return getModel ? m : m.get()

    }
  }

  static async bulkAddOrUpdate( specs: Partial<CatSpecification>[], getModel = false ): Promise<CatSpecification[]> {
    const res: CatSpecification[] = []
    for ( const spec of specs ) {
      res.push( await this.addOrUpdate( spec, getModel ) )
    }
    return res
  }

  static async delete( ids: number[] ): Promise<number> {
    return CatSpecification.destroy( { where: { id: ids } } )
  }

  static async addOrUpdateProductSpecification( spec: Partial<CatProductSpecification>, transaction?: Transaction ): Promise<void> {
    const data: Partial<CatProductSpecification> = {
      ...spec,
      outdated: spec.outdated || false,
      outdatedForLoading: spec.outdatedForLoading || false,
    }
    const found = await CatProductSpecification.findOne( {
      where: { productId: data.productId, specificationId: data.specificationId },
      raw: true,
      attributes: [ 'id' ],
      transaction,
    } )
    if ( found ) {
      await CatProductSpecification.update( data, { where: { id: found.id }, returning: false, transaction } )
    } else {
      await CatProductSpecification.create( data, { returning: false, transaction } )
    }
  }

}
