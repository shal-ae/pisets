export class StrUtils {
  // Возвращает начало строки до первого хвоста в массиве tails
  //
  static stringBefore(str: string, tails: string[], caseInsensitive = false) {
    let res = ''
    for (const tail of tails) {
      if (caseInsensitive) {
        res = str.substring(0, str.toLowerCase().lastIndexOf(tail.toLowerCase()))
      } else {
        res = str.substring(0, str.lastIndexOf(tail))
      }
      if (res !== str) break
    }
    return res
  }

  static repeatMap(strArray: string[], sortByCount = false): Map<string, number> {
    const res = new Map()
    strArray.forEach(el => {
      if (res.has(el))
        res.set(el, res.get(el) + 1)
      else res.set(el, 1)
    })
    if (!sortByCount) {
      return res
    } else {
      return new Map([...res.entries()].sort((a, b) => b[1] - a[1]))
    }
  }

  static arrayOfMapKeys(map: Map<any, any>) {
    return [...map.keys()]
  }

  static getArrayOfUniqueValuesAndSortByRepeatCountDesc(strArray: string[]): string[] {
    return StrUtils.arrayOfMapKeys(StrUtils.repeatMap(strArray, true))
  }

  static commonStringFromLeft(strArray: string[], caseInsensitive = true): string {
    // console.log('commonStringFromLeft', strArray )
    const size = strArray.length
    if (!size) return ''
    if (size === 1) return strArray[0]

    const str1 = strArray[0]
    const str1len = str1.length
    let foundLength = 0

    for (let i = 0; i < str1len; i++) {
      let diff = false

      for (let k = 1; k < size; k++) {
        if (caseInsensitive) {
          if (str1.substring(i, i + 1).toLowerCase() !== strArray[k].substring(i, i + 1).toLowerCase()) {
            diff = true
            break
          }
        } else {
          if (str1.substring(i, i + 1) !== strArray[k].substring(i, i + 1)) {
            diff = true
            break
          }
        }
      }
      if (diff) break
      foundLength = i + 1
    }
    const res = str1.substring(0, foundLength)
    // console.log('=', res )
    return res
  }

  static removeStringTails(str: string, tails: string[]) {
    let res = str.trim()
    tails.forEach(tail => {
      if (res.endsWith(tail)) res = res.substring(0, res.length - tail.length)
    })
    return res
  }

  static prependCommaSeparatedStringItems(str: string, prefix = ''): string {
    if (prefix) {
      return str.split(',').map(el => prefix + el.trim()).join(',')
    }
    return str
  }

  static removeStringAtStart(str: string, stringToRemove: string) {
    return str.startsWith(stringToRemove) ? str.substring(stringToRemove.length) : str
  }
}
