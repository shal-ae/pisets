import { ModelCtor, Sequelize } from 'sequelize-typescript'
import { SequelizeOptions } from 'sequelize-typescript/dist/sequelize/sequelize/sequelize-options'

export const SEQUELIZE = 'SEQUELIZE'

export async function getDatabaseProviders( models: ModelCtor[], sequelizeOptions: SequelizeOptions ) {
  return [
    {
      provide: SEQUELIZE,
      useFactory: async () => {
        const sequelize = new Sequelize( sequelizeOptions )
        sequelize.addModels( models )
        if ( sequelizeOptions.sync ) {
          await sequelize.sync()
          console.log( 'Database synced' )
        }
        return sequelize
      },
    },
  ]
}
