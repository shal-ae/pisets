import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'
import * as path from 'path'
import { MAILER_FROM, MAILER_TRANSPORT } from '../config'

export const getMailConfig = async (): Promise<any> => {
  const transport = MAILER_TRANSPORT
  const mailFromName = MAILER_FROM
  const mailFromAddress = transport.split( ':' )[ 1 ].split( '//' )[ 1 ]

  return {
    transport,
    defaults: {
      from: `"${mailFromName}" <${mailFromAddress}>`,
    },
    template: {
      dir: getTemplateDir(),
      adapter: new EjsAdapter(),
      options: {
        strict: false,
      },
    },
  }
}

export function getTemplateDir(): string {
  return path.join( __dirname, 'assets', 'mail', 'templates' )
}
