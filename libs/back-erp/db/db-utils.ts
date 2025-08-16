import {QueryTypes} from 'sequelize';
import {Sequelize} from 'sequelize-typescript';

export class SortedEntity {
  id: number
  sortIndex: number
}

export class ArrayNotSortedError extends Error {
}

interface FilterDataLimitOffset {
  limit?: number
  offset?: number
}

export class DbUtils {
  static async getTotal(seq: Sequelize, tableName: string, filterConditions: string[]): Promise<number> {
    const cntRes = await seq.query<{ cnt: number }>(`select count(id) as cnt
                                                     from ${tableName} ${filterConditions.length ? 'where ' : ''} ${filterConditions.join(' AND ')}`
      , {type: QueryTypes.SELECT})

    return +cntRes[0]?.cnt || 0
  }

  static async findNextSortIndexForTable(seq: Sequelize, tableName: string, sqlCondition: string = 'true'): Promise<number> {
    const cntRes = await seq.query<{ max: number }>(
      `SELECT MAX(sortIndex) as max
       from ${tableName}
       WHERE ${sqlCondition}`
      , {type: QueryTypes.SELECT})

    return (+cntRes[0]?.max || 0) + 1
  }


  /** Заполняет по порядку поле sortIndex в entitiesArray начиная с 1.
   *  Новые значения sortIndex записываются в базу данных в tableName.sortIndex
   * */
  static async fillSortField(seq: Sequelize, tableName: string, entitiesArray: SortedEntity[]): Promise<SortedEntity[]> {
    let affectedEntities: SortedEntity[] = []
    let index = 1
    for (const entity of entitiesArray) {
      if (entity.sortIndex !== index) {
        entity.sortIndex = index
        await seq.query(`update ${tableName}
                         SET sortIndex = :index
                         where id = :id`, {replacements: {index, id: entity.id}, type: QueryTypes.UPDATE},
        )
        affectedEntities.push(entity)
      }
      index++
    }
    return affectedEntities
  }

  /** Меняет порядок сортировки массива сортируемых сущностей путем изменения поля sortIndex.
   Поле sortIndex должно быть пронумеровано начиная с 1  (fillSortField).
   Сам массив entitiesArray не сортируется, в нем только меняется sortIndex
   Новые значения sortIndex записываются в базу данных в tableName.sortIndex  */
  static async moveSortedEntity(seq: Sequelize, tableName: string, entitiesArray: SortedEntity[], fromIndex: number, toIndex: number): Promise<void> {
    const entitiesToMove: SortedEntity[] = []

    const len = entitiesArray.length
    if (fromIndex < 1 || fromIndex > len || toIndex < 0 || toIndex > len || fromIndex === toIndex) {
      return
    }
    const notSorted = await this.fillSortField(seq, tableName, entitiesArray)
    if (notSorted.length) {
      throw new ArrayNotSortedError(`Array ${tableName} not sorted`)
    }
    const entityToMove = entitiesArray.find(e => e.sortIndex === fromIndex)
    if (fromIndex < toIndex) {
      for (const e of entitiesArray) {
        if (e.sortIndex > fromIndex && e.sortIndex <= toIndex) {
          e.sortIndex--
          entitiesToMove.push(e)
        }
      }
    } else {
      for (const e of entitiesArray) {
        if (e.sortIndex >= toIndex && e.sortIndex < fromIndex) {
          e.sortIndex++
          entitiesToMove.push(e)
        }
      }
    }
    entityToMove.sortIndex = toIndex
    entitiesToMove.push(entityToMove)

    for (const entity of entitiesToMove) {
      await seq.query(`update ${tableName}
                       SET sortIndex = :index
                       where id = :id`,
        {
          replacements: {
            index: entity.sortIndex,
            id: entity.id,
          },
          type: QueryTypes.UPDATE,
        },
      )
    }
  }

  /** filtersData.{offset, limit} => mySQL */
  static getOffsetAndLimitQueryFromFiltersData(filtersData?: FilterDataLimitOffset): string {
    if (!filtersData || (!filtersData.offset && !filtersData.limit)) {
      return ''
    }
    return ` OFFSET ${filtersData.offset || 0} LIMIT ${filtersData.limit || 0} `
  }

  static async findNextSortIndex(seq: Sequelize, tableName: string, parentField: string, parentId: number): Promise<number> {
    const rows = await seq.query<{ num: number }>(`SELECT MAX("sortIndex") as num
                                                   from ${tableName}
                                                   WHERE "${parentField}" = ${parentId}`, {type: QueryTypes.SELECT})

    return (rows[0]?.num || 0) + 1
  }

  /* No way to refactor  */
  static fillFieldsIfSpecified(src: Record<string, any>, dst: Record<string, any>, fieldNames: string[] | string): void {
    console.log(dst)
    if (typeof fieldNames === 'string') {
      this.fillFieldsIfSpecified(src, dst, [fieldNames])
    } else if (Array.isArray(fieldNames)) {
      fieldNames.forEach(name => {
        if (src[name] !== undefined) {
          dst[name] = src[name]
        }
      })
    }
  }

}
