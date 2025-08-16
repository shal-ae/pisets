import {CatalogStat} from '../types/statistic.types'
import {CatCatalog} from '../entities/catalog.entity'
import {FilterValuesConnectedUtils} from '@app/back/cat/utils/filter-values-connected.utils';
import {FilterValuesUtils} from '@app/back/cat/utils/filter-values.utils';
import {Sequelize} from 'sequelize-typescript';

export class StatisticUtils {

  static async calculateAndSave(sequelize: Sequelize, catalogId?: number): Promise<void> {
    if (!catalogId) {
      const catalogIds = (await CatCatalog.findAll()).map(e => e.id)
      for (const cat of catalogIds) {
        await this.calculateAndSave(sequelize, catalogId)
      }
    } else {
      const stat = await this.calculate(sequelize, catalogId)
      await this.save(catalogId, stat)
    }
  }

  static async save(catalogId: number, statistic: CatalogStat): Promise<void> {
    await CatCatalog.update({statistic}, {where: {id: catalogId}, returning: false})
  }

  static async calculate(sequelize: Sequelize, catalogId: number): Promise<CatalogStat> {
    const notConnectedInfo = await FilterValuesConnectedUtils.getNotConnectedInfo(sequelize)
    return {
      catalogId,
      categories: undefined,
      files: undefined,
      filters: await FilterValuesUtils.getCatalogFiltersStat(sequelize, catalogId, notConnectedInfo),
      product: undefined,
      specifications: undefined,
      stock: undefined,
    }
  }

}
