import { Injectable } from '@nestjs/common'
import { DatabaseService } from 'libs/back/core/db/src'
import { Command } from 'commander'
import { UserService } from '../users/services/user.service'

@Injectable()
export class CliService {
  constructor( private userService: UserService, private db: DatabaseService ) {
  }

  async cli(): Promise<void> {

    const program = new Command()

    program
      .name( 'doc' )
      .version( '1.0.0' )

    program.command( 'add-admin' )
      .description( 'Add user with administrative privileges' )
      .argument( '<string>', 'Username' )
      .option( '-p, --password <char>', 'password', '' )
      .action( async ( username, options ) => {
        try {
          await this.userService.addAdmin( username, options.password )
          console.log( `Admin created or updated: ${username}, ${options.password}` )
        } catch ( e ) {
          console.log( e )
        }
      } )
    program.command( 'db-sync' )
      .description( 'Sync database' )
      .action( async () => {
        try {
          await this.db.sequelize.sync( { alter: true, force: false } )
          console.log( `Database synced` )
        } catch ( e ) {
          console.log( e )
        }
      } )

    program.parse()
  }
}
