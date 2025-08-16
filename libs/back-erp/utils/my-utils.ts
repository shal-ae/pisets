import * as crypto from 'crypto'

export interface HourMinute {
  hour: number,
  minute: number
}

export class MyUtils {
  static sha1(value: string): string {
    return crypto.createHash('sha1').update(value).digest('hex')
  }

  static makeRandomId(length) {
    let result = ''
    const characters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`
    const charactersLength = characters.length
    let counter = 0
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
      counter++
    }
    return result
  }

  static generatePassword(length = 6) {
    return this.makeRandomId(length)
  }

  static sha1Base64(value: string): string {
    return crypto.createHash('sha1').update(value).digest('base64')
  }

  static xmlProp(xml, propName: string, defaultValue = undefined): any | undefined {
    if (xml[propName]) {
      if (xml[propName][0]) {
        return xml[propName][0]
      } else {
        return defaultValue
      }
    } else {
      return defaultValue
    }
  }

  static xmlIntegerProp(xml, propName: string, defaultValue = undefined): any | undefined {
    const str = this.xmlProp(xml, propName, defaultValue)
    if (str === defaultValue) {
      return defaultValue
    }
    return Math.round(+str)
  }

  static timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  static stringToHourMinute(str: string | null, defaultHour = 0, defaultMinute = 0): HourMinute {
    const res = {hour: defaultHour, minute: defaultMinute}
    if (!str) return res
    if (str.length !== 5) return res
    if (str.substring(2, 3) !== ':') return res
    res.hour = +str.substring(0, 2)
    res.minute = +str.substring(3, 5)
    return res
  }

  static localDayOfWeek(dayOfWeek: number) {
    return dayOfWeek === 0 ? 7 : dayOfWeek
  }

  static fillFields(object: any, source: any, fields: string[], definedOnly = true) {
    fields.forEach(el => {
      if (!definedOnly || source[el] !== undefined) {
        object[el] = source[el]
      }
    })
  }

  static fillFieldsString(object: any, source: any, fieldsString: string, definedOnly = true) {
    MyUtils.fillFields(object, source, fieldsString.split(','), definedOnly)
  }

  static addUniqueItemToArray(arr: any[], item: any) {
    if (arr.indexOf(item) === -1) {
      arr.push(item)
    }
  }

  static deleteObjectFields(obj: any, fields: string): void {
    fields.split(',').forEach(el => delete (obj[el]))
  }

  static queryParameterToArrayOfNumbers(parameter: any): number[] {
    return parameter ? parameter.split(',').map(el => +el) : []
  }

  static deleteObjectFieldsNotExistingInAnotherObject(obj: Object, fieldsObject: Object): void {
    Object.keys(obj).forEach(prop => {
      if (!Object.keys(fieldsObject).find(e => e === prop)) {
        delete obj[prop]
      }
    })

  }


}

export function deepCopy<T>(value: T): T {
  if (typeof value !== 'object' || value === null) {
    return value
  }
  if (Array.isArray(value)) {
    return deepArray(value)
  }
  return deepObject(value)
}

function deepObject<T>(source: T): any {
  const result = {}
  Object.keys(source).forEach((key) => {
    const value = source[key]
    result[key] = deepCopy(value)
  }, {})
  return result as T
}

function deepArray<T extends any[]>(collection: T): any {
  return collection.map((value) => {
    return deepCopy(value)
  })
}

export type Pair<I, V> = {
  id: I
  value: V
}

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;
