import {NotConnectedFilterInfo} from '../types/statistic.types'
import {QueryTypes} from 'sequelize'
import {CatFilterValue} from '../entities/filter-value.entity'
import {CatFilterValueFilterValue} from '../entities/filter-value-connected.entity'
import {ConnectedIds} from '../../types/connected.types';
import {Sequelize} from 'sequelize-typescript';

export class FilterValuesConnectedUtils {
  static getConnectedIds(id: number, allConnectedIds: ConnectedIds[]): number[] {
    return allConnectedIds.filter(e => e.id1 === id).map(e => e.id2)
  }

  static async getConnectedIdsFromDB(filterValueId: number): Promise<number[]> {
    return (await CatFilterValueFilterValue.findAll({where: {filterValue1id: filterValueId}, raw: true})).map(
      e => e.filterValue2id,
    )
  }

  static async disconnectAllFrom(filterValueId: number): Promise<void> {
    await CatFilterValueFilterValue.destroy({where: {filterValue1id: filterValueId}})
    await CatFilterValueFilterValue.destroy({where: {filterValue2id: filterValueId}})
  }

  static async disconnectAllFromIds(filterValueIds: number[]): Promise<void> {
    await CatFilterValueFilterValue.destroy({where: {filterValue1id: filterValueIds}})
    await CatFilterValueFilterValue.destroy({where: {filterValue2id: filterValueIds}})
  }

  static async resetDoNotConnectToCommon(filterValueId: number): Promise<void> {
    await CatFilterValue.update({doNotConnectToCommon: false}, {where: {id: filterValueId}, returning: false})
  }

  static async setFilterValueConnection(connected = true, filterValue1id: number, filterValue2id: number): Promise<void> {
    await this.setFilterValueConn(connected, filterValue1id, filterValue2id)
    await this.setFilterValueConn(connected, filterValue2id, filterValue1id)
    if (connected) {
      await this.resetDoNotConnectToCommon(filterValue1id)
      await this.resetDoNotConnectToCommon(filterValue2id)
    }
  }

  private static async setFilterValueConn(connected = true, filterValue1id: number, filterValue2id: number): Promise<void> {
    if (connected) {
      await CatFilterValueFilterValue.upsert({filterValue1id, filterValue2id})
    } else {
      await CatFilterValueFilterValue.destroy({where: {filterValue1id, filterValue2id}})
    }
  }

  static async getAllConnectedIds(): Promise<ConnectedIds[]> {
    return (await CatFilterValueFilterValue.findAll({raw: true})).map(e => {
      return {
        id1: e.filterValue1id,
        id2: e.filterValue2id,
      }
    })
  }

  static async getNotConnectedInfo(sequelize: Sequelize): Promise<NotConnectedFilterInfo[]> {
    return sequelize.query<NotConnectedFilterInfo>(
      `select "filterId" as id, count(id) as cnt
       FROM cat__filter_value
       WHERE NOT "outdated"
         and ("doNotConnectToCommon" is NULL or NOT "doNotConnectToCommon")
         AND id NOT IN
             (SELECT distinct "filterValue1id" FROM cat__filter_connected where NOT outdated)
         and "filterId" IN
             (select "id"
              from cat__filter
              WHERE "catalogId" IN
                    (select "id" from cat__catalog where common is NULL or NOT common)
                and type IS NOT NULL)
       GROUP BY "filterId";`, {
        type: QueryTypes.SELECT,
      })
  }


}
