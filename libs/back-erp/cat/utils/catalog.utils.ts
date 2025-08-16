import {Injectable} from '@nestjs/common'
import {getDefaultCatalogParams} from '../types/catalog.types'
import {CatCatalog} from '../entities/catalog.entity'
import {BackgroundProcessUtils} from '../../background-process/utils/background-process.utils'
import {CatCatalogEditDTO, CatCatalogListItemDTO} from '../dto/catalog.dto';
import {
  SYS_PROCESS_CATALOG_CHECK_FILES,
  SYS_PROCESS_CATALOG_DOWNLOAD_ABSENT_FILES,
  SYS_PROCESS_CATALOG_LOAD_PRODUCTS,
  SYS_PROCESS_CATALOG_LOAD_STOCK,
  SYS_PROCESS_CATALOG_PROCESSING,
  SYS_PROCESS_COMMON_CATALOG_SAVE_PRODUCTS,
  SYS_PROCESS_COMMON_CATALOG_SAVE_STOCK,
} from '../../background-process/types/background-process.types';
import {DEFAULT_SCHEDULE} from '../../types/schedule.types';
import {FilterUtils} from '@app/back/cat/utils/filter.utils';
import {STANDARD_FILTER_TYPES} from '@app/back/cat/types/filter.types';


@Injectable()
export class CatalogUtils {

  static async getCatalogByType(catalogType: string, createIfNotExist = false, createTasksIfNotExist = false): Promise<CatCatalog | null> {
    // let cat = await this.em.findOne( CatCatalog, { where: { type: catalogType } } )
    let cat = await CatCatalog.findOne({where: {type: catalogType}, rejectOnEmpty: false})
    const defaultParams = getDefaultCatalogParams(catalogType)

    if (!cat && createIfNotExist) {
      cat = CatCatalog.build()
      cat.type = catalogType
      cat.name = defaultParams.name || catalogType.toString()
      cat.site = defaultParams.site
      cat.code = defaultParams.code
      cat.cloudCatalogId = defaultParams.cloudCatalogId
      cat.icon = {file: `${catalogType}.svg`}
      await cat.save()
    }
    if (cat && createTasksIfNotExist) {
      await BackgroundProcessUtils.addBgProcess('Загрузка товаров', cat, SYS_PROCESS_CATALOG_LOAD_PRODUCTS, defaultParams.scheduleDownloadProducts)
      await BackgroundProcessUtils.addBgProcess('Загрузка остатков', cat, SYS_PROCESS_CATALOG_LOAD_STOCK, defaultParams.scheduleDownloadStock)
      await BackgroundProcessUtils.addBgProcess('Проверка файлов', cat, SYS_PROCESS_CATALOG_CHECK_FILES)
      await BackgroundProcessUtils.addBgProcess('Загрузка файлов', cat, SYS_PROCESS_CATALOG_DOWNLOAD_ABSENT_FILES)
      await BackgroundProcessUtils.addBgProcess('Обработка', cat, SYS_PROCESS_CATALOG_PROCESSING)
    }
    return cat
  }

  static async addSupportedCatalog(catalogType: string): Promise<CatCatalog> {
    // const catalog = await CatalogUtils.getCatalogByType(catalogType)
    // if (catalog) {
    //   throw new CatalogAlreadyExists()
    // }
    return CatalogUtils.getCatalogByType(catalogType, true, true)
  }

  static async getCommonCatalog(): Promise<CatCatalog> {
    return CatCatalog.findOne({rejectOnEmpty: false, where: {common: true}})
  }

  /** Добавляет нестандартные каталоги и общий каталог
   *
   * Если общий существует - добавляет только его задачи (выгрузки) */
  static async addUnsupportedCatalog(data: CatCatalogEditDTO): Promise<CatCatalog> {
    let catalog
    const common = data.common === true

    if (common) {
      catalog = await this.getCommonCatalog()
    }
    if (!catalog) {
      catalog = CatCatalog.build()
      catalog.name = data.name
      catalog.site = data.site
      catalog.common = common
      catalog.icon = {file: `rk-a.svg`}
      await catalog.save()

      if (common) {
        for (const type of STANDARD_FILTER_TYPES) {
          await FilterUtils.upsert({
            name: FilterUtils.getDefaultFilterName(type),
            type,
            catalogId: catalog.id,
            outdated: false,
          })
        }
      }
    }
    if (common) {
      await BackgroundProcessUtils.addBgProcess('Выгрузка товаров', catalog,
        SYS_PROCESS_COMMON_CATALOG_SAVE_PRODUCTS, DEFAULT_SCHEDULE)
      await BackgroundProcessUtils.addBgProcess('Выгрузка остатков', catalog,
        SYS_PROCESS_COMMON_CATALOG_SAVE_STOCK, DEFAULT_SCHEDULE)
    }
    return catalog
  }

  static async deleteCatalog(catalogId: number): Promise<number> {
    throw new Error('Удаление каталогов запрещено')
    // return CatCatalog.destroy({where: {id: catalogId}})
  }

  static async updateCatalog(catalogData: CatCatalogEditDTO): Promise<CatCatalog> {
    const catalog = await CatCatalog.findByPk(catalogData.id)

    catalog.set(catalogData)

    await catalog.save()

    return this.getCatalog(catalogData.id)
  }

  static async getCatalog(catalogId: number): Promise<CatCatalog> {
    return CatCatalog.findByPk(catalogId)
  }

  static async getCatalogs(): Promise<CatCatalog[]> {
    return CatCatalog.findAll({order: ['sortIndex', 'id']})
  }

  static async getCatalogList(): Promise<CatCatalogListItemDTO[]> {
    const res: CatCatalogListItemDTO[] = []
    const list = await CatCatalog.findAll()
    list.forEach(i => res.push({
      id: i.id,
      type: i.type,
      name: i.name,
      code: i.code,
      site: i.site,
      common: i.common,
    }))
    return res
  }

}

