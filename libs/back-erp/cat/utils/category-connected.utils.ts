import {CatCategory} from '../entities/category.entity'
import {CategoriesToConnectStat} from '../types/statistic.types'
import {NotConnectedRecord} from '../types/category.types'
import {QueryTypes} from 'sequelize'
import {CatCategoryCategory} from '../entities/category-connected.entity'
import {TABLE_NAME_CATEGORY_CONNECTED} from '../types/cat.tables';
import {ConnectedIds} from '../../types/connected.types';
import {Sequelize} from 'sequelize-typescript';

export class CategoryConnectedUtils {

  static getConnectedIds(id: number, allConnectedIds: ConnectedIds[]): number[] {
    return allConnectedIds.filter(e => e.id1 === id).map(e => e.id2)
  }

  static async getConnectedIdsFromDB(categoryId: number): Promise<number[]> {
    return (await CatCategoryCategory.findAll({where: {category1id: categoryId}})).map(
      e => e.category2id,
    )
  }

  static async disconnectAllCategoriesFrom(categoryId: number): Promise<void> {
    await CatCategoryCategory.destroy({where: {category1id: categoryId}})
    await CatCategoryCategory.destroy({where: {category2id: categoryId}})
  }

  static async resetDoNotConnectToCommon(categoryId: number): Promise<void> {
    await CatCategory.update({doNotConnectToCommon: false}, {returning: false, where: {id: categoryId}})
  }

  static async setCategoryConnection(connected = true, categoryId1: number, categoryId2: number): Promise<void> {
    await this.setCategoryConn(connected, categoryId1, categoryId2)
    await this.setCategoryConn(connected, categoryId2, categoryId1)
    if (connected) {
      await this.resetDoNotConnectToCommon(categoryId1)
      await this.resetDoNotConnectToCommon(categoryId2)
    }
  }

  private static async setCategoryConn(connected = true, category1id: number, category2id: number): Promise<void> {
    if (connected) {
      await CatCategoryCategory.upsert({category1id, category2id})
    } else {
      await CatCategoryCategory.destroy({where: {category1id, category2id}})
    }
  }

  static async getAllConnectedIds(): Promise<ConnectedIds[]> {
    return (await CatCategoryCategory.findAll()).map(e => {
      return {
        id1: e.category1id,
        id2: e.category2id,
      }
    })
  }

  static async getNotConnectedInfo(sequelize: Sequelize): Promise<CategoriesToConnectStat> {
    const data: NotConnectedRecord[] = await sequelize.query<NotConnectedRecord>(
      `select "catalogId", count(id) as cnt
       FROM cat__category
       WHERE NOT "outdated"
         and ("doNotConnectToCommon" is NULL or NOT "doNotConnectToCommon")
         AND id NOT IN
             (SELECT distinct "category1id"
              FROM ${TABLE_NAME_CATEGORY_CONNECTED}
              where NOT outdated)
         and "catalogId" IN
             (select "id" from cat__catalog where common is NULL or NOT common)
       GROUP BY "catalogId";`, {
        type: QueryTypes.SELECT,
      })

    const res: CategoriesToConnectStat = {}
    data.forEach(el => res[el.catalogId] = el.cnt)
    return res
  }


}
