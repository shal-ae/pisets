export class MyUtils {
  static makeRandomId( length: number ) {
    let result = ''
    const characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`
    const charactersLength = characters.length
    let counter = 0
    while ( counter < length ) {
      result += characters.charAt( Math.floor( Math.random() * charactersLength ) )
      counter++
    }
    return result
  }

  static generateSessionId(): string {
    return new Date().toISOString() + '#' + MyUtils.makeRandomId( 10 )
  }

  static formatNumber(
    n: number,
    minFracDigit = 0,
    maxFracDigit = minFracDigit,
    minIntegerDigit?: number,
  ): string {
    return new Intl.NumberFormat( 'ru-RU', {
      maximumFractionDigits: maxFracDigit,
      minimumFractionDigits: minFracDigit,
      minimumIntegerDigits: minIntegerDigit,
    } ).format( n )
  }

  static formatDateTime( dateTime: Date, format: string ): string {
    if ( !dateTime ) {
      // 'dd.MM.yy hh:mm'
      return ''
    }
    const dt = new Date( dateTime )
    const day = dt.getDate()
    const month = dt.getMonth() + 1
    const year = dt.getFullYear()
    const hour = dt.getHours()
    const minutes = dt.getMinutes()
    const seconds = dt.getSeconds()
    let res = format
    res = res.replace( 'dd', ('0' + day).slice( -2 ) )
    res = res.replace( 'MM', ('0' + month).slice( -2 ) )
    res = res.replace( 'yyyy', '' + year )
    res = res.replace( 'yy', '' + (year % 100) )
    res = res.replace( 'hh', ('0' + hour).slice( -2 ) )
    res = res.replace( 'mm', ('0' + minutes).slice( -2 ) )
    res = res.replace( 'ss', ('0' + seconds).slice( -2 ) )
    return res
  }

  static dayOfWeekShort( num: number ): string {
    switch ( num ) {
      case 1:
        return 'Пн'
      case 2:
        return 'Вт'
      case 3:
        return 'Ср'
      case 4:
        return 'Чт'
      case 5:
        return 'Пт'
      case 6:
        return 'Сб'
      case 7:
        return 'Вс'
      default:
        return ''
    }
  }

  static changeFileExt(
    filepath: string,
    oldExt: string[],
    newExt: string,
  ): string {
    const parts = filepath.split( '.' )
    if ( parts.length < 2 ) {
      return filepath
    }
    let lastPart = parts.splice( -1 )[ 0 ]

    oldExt.forEach( ( e ) => {
      if ( e === lastPart ) {
        lastPart = newExt
      }
    } )

    parts.push( lastPart )
    return parts.join( '.' )
  }

  /** Удаляет ссылки из текста.
   *
   * \`Текст с <a href="/some-ref">ссылкой</a>\` ---->   \`Текст с ссылкой\`
   * */
  static removeHrefFromString( src: string ): string {
    if ( !src ) {
      return src
    }
    let str = src
    while ( str.indexOf( '<a ' ) > -1 ) {
      const posStartTag = str.indexOf( '<a ' )
      const posStartText = str.indexOf( '>', posStartTag ) + 1
      const posEndTag = str.indexOf( `</a>`, posStartTag )

      if ( posEndTag === -1 || posStartText === -1 || posStartText > posEndTag ) {
        str = str.substring( 0, posStartTag )
        break
      }
      const text = str.substring( posStartText, posEndTag )
      str = str.substring( 0, posStartTag ) + text + str.substring( posEndTag + 4 )
    }
    return str
  }

  static stripTags( src: string ): string {
    return src.replace( /<[^>]*>?/gm, '' )
  }

  static addFilenameWithoutExt( filename: string ): string {
    const p = filename.split( '.' )
    if ( !p.length ) {
      return filename
    }
    p.pop()
    return p.join( '.' )
  }
}
