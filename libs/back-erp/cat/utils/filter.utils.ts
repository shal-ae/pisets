import {CatFilter} from '../entities/filter.entity'
import {FilterTypeExists} from '../../errors/cat.errors'
import {CatFilterType} from '../types/filter.types'

export class FilterUtils {
  static async getAll(): Promise<CatFilter[]> {
    return CatFilter.findAll({raw: true})
  }

  static async upsert(data: Partial<CatFilter>): Promise<CatFilter> {
    if (data.id) {
      const filter = await CatFilter.findByPk(data.id)
      filter.set(data)
      // Utils.fillFields( filter, data, [ 'name', 'type', 'catalogCode' ] )
      return filter.save()
    } else {
      const found = await CatFilter.findOne({
        where:
          data.type ? {catalogId: data.catalogId, type: data.type} :
            {catalogId: data.catalogId, catalogCode: data.catalogCode},
        rejectOnEmpty: false,
      })
      if (found) {
        throw new FilterTypeExists(data.type, data.catalogId)
      }

      return this.addOrUpdateFilterByCatalogCode(data.catalogId, data.name, data.catalogCode, data.type)
    }
  }

  static async delete(id: number): Promise<number> {
    return CatFilter.destroy({where: {id}})
  }

  private static async getFilterByCatalogCode(catalogId: number, catalogCode: string, createIfNotExists = false): Promise<CatFilter | null> {
    let filter = await CatFilter.findOne({where: {catalogId, catalogCode}, rejectOnEmpty: false})
    if (!filter && createIfNotExists) {
      filter = CatFilter.build()
      filter.catalogId = catalogId
      filter.catalogCode = catalogCode
      filter.outdatedForLoading = false
      filter.outdated = false
      await filter.save()
    }
    return filter
  }

  static async addOrUpdateFilterByCatalogCode(catalogId: number, name: string, catalogCode = name, type?: string): Promise<CatFilter> {
    const filter = await this.getFilterByCatalogCode(catalogId, catalogCode, true)
    filter.name = name
    filter.type = type
    filter.outdatedForLoading = false
    filter.outdated = false
    return filter.save()
  }

  static getDefaultFilterName(type: string): string {
    switch (type) {
      case CatFilterType.brand:
        return 'Бренд'
      case CatFilterType.color:
        return 'Цвет'
      case CatFilterType.material:
        return 'Материал'
      case CatFilterType.print:
        return 'Нанесение'
    }
  }

  static async getStandardFilter(catalogId: number, type: string): Promise<CatFilter | null> {
    const name = this.getDefaultFilterName(type)
    if (!name) {
      return null
    }
    return this.addOrUpdateFilterByCatalogCode(catalogId, name, type, type)
  }

}
