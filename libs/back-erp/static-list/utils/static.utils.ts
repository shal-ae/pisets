import { StaticRecord } from '@app/back/static-list/entities/static-record.entity'
import { StaticListData, StaticListItem, StaticListItemUpdateDTO } from '@app/back/static-list/types/static-list.types'

export class StaticUtils {

  static async getStaticData( groups: string[] ): Promise<StaticListData> {
    const res: StaticListData = {}
    const data = await StaticRecord.findAll( {
      where: {group: groups},
      order: [ 'group', 'sortIndex', 'id' ],
      raw: true,
    } )
    // const groups = this.getGroups(data)
    for ( const group of groups ) {
      res[ group ] = []
      data.filter( e => e.group === group ).forEach( d => {
        this.sanitizeStaticRecord( d )
        res[ group ].push( d )
      } )
    }
    return res
  }

  static async upsertItems( updateDTOs: StaticListItemUpdateDTO[] ): Promise<StaticListItem<any>[]> {
    const res: StaticListItem<any>[] = []

    for ( const data of updateDTOs ) {
      if ( data.item.id ) {
        const findById = await StaticRecord.findOne( {where: {id: data.item.id}, raw: true, attributes: [ 'key' ]} )
        if ( findById ) {
          data.item.key = findById.key
        }
      } else if ( data.item.key ) {
        const findByKey = await StaticRecord.findOne( {where: {key: data.item.key}, raw: true, attributes: [ 'id' ]} )
        if ( findByKey ) {
          data.item.id = findByKey.id
        }
      }


      const [ upsertRes, _ ] = await StaticRecord.upsert( {
        id: data.item.id || null,
        sortIndex: data.item.sortIndex,
        deleted: data.item.deleted ?? false,
        group: data.group,
        data: data.item.data || undefined,
        key: data.item.key || undefined,
      } )
      const r = await StaticRecord.findByPk( upsertRes.id, {raw: true, rejectOnEmpty: true} )
      this.sanitizeStaticRecord( r )
      res.push( r )
    }

    return res
  }

  static async deleteItems( ids: number[] ): Promise<number> {
    return StaticRecord.destroy( {where: {id: ids}} )
  }

  static async sortGroup( group: string ): Promise<number> {
    const data = await StaticRecord.findAll( {
      where: {group},
      order: [ 'group', 'sortIndex', 'id' ],
      raw: true,
    } )

    let i = 1
    for ( const item of data ) {
      await StaticRecord.update( {sortIndex: i++}, {where: {id: item.id}} )
    }
    return data.length
  }

  private static sanitizeStaticRecord( data: StaticRecord ) {
    data.group = undefined
    data.createdAt = undefined
    data.updatedAt = undefined
  }

}
