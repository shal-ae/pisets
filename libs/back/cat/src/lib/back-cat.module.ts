import { Module } from '@nestjs/common'
import { MyLogger } from './logger/myLogger'
import { FilterService } from './services/filter.service'
import { ProductService } from './services/product.service'

@Module( {
  controllers: [],
  providers: [ ProductService, FilterService, MyLogger ],
  exports: [ ProductService, FilterService, MyLogger ],
} )
export class BackCatModule {
}
