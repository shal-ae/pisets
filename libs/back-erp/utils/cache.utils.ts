import {MyUtils} from '@app/back/utils/my-utils';
import {CacheModel} from '@app/back/db/models/cache-model';
import {CacheDTO, CacheHashAndModified, CacheQueryItem} from '@app/back/types/cache.types';

export class CacheUtils {

  static async saveData<T, O = any>(model: typeof CacheModel<T, O>, id: number, data: T, options?: O): Promise<CacheDTO<T, O>> {
    const now = new Date()

    const hash = this.calculateHash(data)
    const storedHashAndModified: CacheHashAndModified<O> = await this.getStoredHashAndModified(model, id)
    if (storedHashAndModified && (hash === storedHashAndModified.hash)) {
      await model.update({actualAt: now, options}, {where: {id}, returning: false})
      return {
        id,
        data,
        options: storedHashAndModified.options,
        hash,
        addedAt: storedHashAndModified.addedAt,
        modifiedAt: storedHashAndModified.modifiedAt,
        actualAt: now,
        result: 'notModified',
      }
    }

    if (storedHashAndModified) {
      await model.update({data, hash, modifiedAt: now, actualAt: now, options}, {where: {id}, returning: false})
      return {
        id,
        data,
        options,
        hash,
        modifiedAt: now,
        addedAt: storedHashAndModified.addedAt,
        actualAt: now,
        result: 'modified',
      }
    } else {
      await model.create({id, data, hash, modifiedAt: now, addedAt: now, actualAt: now, options}, {returning: false})
      return {
        id,
        data,
        options,
        hash,
        modifiedAt: now,
        addedAt: now,
        actualAt: now,
        result: 'added',
      }
    }
  }

  static async getData<T, O>(model: typeof CacheModel<T, O>, id: number): Promise<T | null> {
    const d = (await model.findByPk(id, {raw: true, attributes: ['data']}))
    if (!d) {
      return null
    }
    return d.data
  }

  static async getItem<T, O = any>(model: typeof CacheModel<T, O>, item: CacheQueryItem): Promise<CacheDTO<T, O> | null> {
    const h = await this.getStoredHashAndModified(model, item.id)
    if (h === null) {
      return null
    }

    if (item.ifModifiedSince) {
      if (h.modifiedAt.getTime() === new Date(item.ifModifiedSince).getTime()) {
        return {
          id: item.id,
          data: undefined,
          options: h.options as O,
          hash: h.hash,
          addedAt: h.addedAt,
          modifiedAt: h.modifiedAt,
          actualAt: h.actualAt,
          result: 'notModified',
        }
      }
    }
    const d = (await model.findByPk(item.id, {raw: true}))

    if (!d) {
      return null
    }

    return {
      id: item.id,
      data: d.data,
      options: d.options as O,
      hash: d.hash,
      addedAt: d.addedAt,
      modifiedAt: d.modifiedAt,
      actualAt: d.actualAt,
    }
  }

  static async getItems<T, O = any>(model: typeof CacheModel<T, O>, items: CacheQueryItem[]): Promise<CacheDTO<T, O>[]> {
    const now = new Date()
    const res: CacheDTO<T, O>[] = items.map(e => ({
      id: e.id,
      data: undefined,
      hash: null,
      result: 'notFound',
      actualAt: now,
      addedAt: null,
      modifiedAt: null,
    }))
    const hashes = await this.getStoredHashAndModifiedArray(model, items.map(e => e.id))
    const idsToFetch: number[] = []

    items.forEach(i => {
      const h = hashes.find(e => e.id === i.id)
      if (h) {
        if (!i.ifModifiedSince || h.modifiedAt.getTime() !== new Date(i.ifModifiedSince).getTime()) {
          idsToFetch.push(i.id)
        }
      }
    })

    let fetched = []
    if (idsToFetch.length) {
      fetched = await model.findAll({where: {id: idsToFetch}, raw: true})
    }

    res.forEach(r => {
      const item = items.find(e => e.id === r.id)!
      const h = hashes.find(e => e.id === item.id)

      if (h) {
        r.options = h.options
        r.hash = h.hash
        r.addedAt = h.addedAt
        r.modifiedAt = h.modifiedAt
        r.actualAt = h.actualAt

        if (item.ifModifiedSince && h.modifiedAt.getTime() === new Date(item.ifModifiedSince).getTime()) {
          r.result = 'notModified'
        } else {
          r.result = 'fetched'
          r.data = fetched.find(e => e.id === r.id)!.data
        }
      }
    })
    return res
  }

  private static async getStoredHashAndModified<T, O>(model: typeof CacheModel<T, O>, id: number): Promise<CacheHashAndModified<O> | null> {
    const found = await model.findByPk(id, {
      raw: true,
      attributes: ['id', 'hash', 'addedAt', 'modifiedAt', 'actualAt', 'options'],
    })
    return found || null
  }

  private static async getStoredHashAndModifiedArray<T, O>(model: typeof CacheModel<T, O>, ids: number[]): Promise<CacheHashAndModified<O>[]> {
    return model.findAll({
      where: {id: ids}, raw: true,
      attributes: ['id', 'hash', 'addedAt', 'modifiedAt', 'actualAt', 'options'],
    })
  }

  private static calculateHash(data: any): string {
    const str = data === undefined ? 'undefined' : JSON.stringify(data)
    return MyUtils.sha1(str)
  }

}
