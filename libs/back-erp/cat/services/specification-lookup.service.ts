import { Injectable } from '@nestjs/common'
import { CatSpecification } from '@app/back/cat/entities/specification.entity'
import { SpecificationLookupInfo } from '@app/back/cat/types/erp/specification-lookup.types'

@Injectable()
export class SpecificationLookupService {
  initialized = false
  values: Record<number, CatSpecification> = {}

  async init() {
    await this.loadSpecifications()
    this.initialized = true
  }

  async loadSpecifications() {
    this.values = {}
    const fv = await CatSpecification.findAll( {raw: true} )
    fv.forEach( el => this.values[ el.id ] = el )
  }

  async getLookupInfo( ids: number[] ): Promise<SpecificationLookupInfo> {
    if ( !this.initialized ) {
      await this.init()
    }

    const res: SpecificationLookupInfo = []

    const specIds: number[] = Array.from( new Set( ids ) )

    for ( const spId of specIds ) {
      if ( !this.values[ spId ] ) {
        continue
        //await this.init()
      }
      const sp = this.values[ spId ]
      res.push( {
        id: sp.id,
        sortIndex: sp.sortIndex || undefined,
        name: sp.name,
        hidden: sp.hidden || undefined,
        dim: sp.dim || undefined,
        sortIndexForOffers: sp.sortIndexForOffers || undefined,
        new: sp.new || undefined,
        showInOffers: sp.showInOffers,
        nameForOffers: sp.nameForOffers || undefined,
        manual: sp.manual || undefined,
      } )
    }

    return res
  }

}
