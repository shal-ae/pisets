import { InjectRedis } from '@nestjs-modules/ioredis'
import { Injectable } from '@nestjs/common'
import { makeRandomId } from '@rka/core-utils'
import Redis from 'ioredis'

const CONFIRM_REDIS_PREFIX = 'confirm:'

@Injectable()
export class ConfirmService {
  constructor( @InjectRedis() private readonly redis: Redis ) {
  }

  async makeToken( data: any, lifetimeSec: number ): Promise<string> {
    const token = makeRandomId( 32 )
    const entryName = this.entryNameByToken( token )
    await this.redis.set( entryName, JSON.stringify( data ), 'EX', lifetimeSec )
    return token
  }

  async checkToken( token: string, deleteIfFound = true ): Promise<any> {
    const entryName = this.entryNameByToken( token )
    const value = await this.redis.get( entryName )
    if ( value ) {
      if ( deleteIfFound ) {
        await this.redis.del( entryName )
      }
      return JSON.parse( value )
    }
    return null
  }

  private entryNameByToken( token: string ): string {
    return `${CONFIRM_REDIS_PREFIX}${token}`
  }
}
