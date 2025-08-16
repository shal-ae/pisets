export type ServerConfig = {
  /**
   CloudServer - основное хранилище картинок и файлов каталогов.
   1. Загружает файлы каталогов по расписанию.
   2. Генерирует json файл с содержимым сервера 'downloaded-file-paths.json'
   3. Выкладывает JSON/XML файлы каталогов после загрузки в публичный доступ
   4. Записывает данные о последнем импорте в файл 'downloaded-info-*.json'
   */
  isCloudServer: boolean

  /** использовать ли облако.
   *
   * Если true - xml/json файлы товаров каталога загружаются с облака.
   *
   * А файлы товаров либо используются с облака, либо загружаются с него
   */
  useCloudServer: boolean

  /** например, https://f.rk-a.ru , http://localhost:3010 */
  cloudServerBaseUrl: string

  /** загружать ли файлы каталогов (картинки, pdf...) с Cloud сервера
   *
   * False - фронт использует ссылки на облако
   *
   * True - загружаем из облака
   * */
  downloadPicturesAndFilesFromCloudServer: boolean

}

/**
 * Режима сервера
 * 1. Одиночный. Все данные и файлы загружает от поставщиков (isCloudServer = false, useCloudServer = false)
 *
 * 2. Cloud server. (isCloudServer = true, useCloudServer = false).
 *    Работает как одиночный, но после загрузки подготавливает файлы для клиентов
 *
 * 3. Использование облака с загрузкой картинок и файлов товаров.
 *    (isCloudServer = false, useCloudServer = true, downloadPicturesAndFilesFromCloudServer = true)
 *
 *    Все данные загружаются только с облака. К поставщикам не лезем.
 *
 * 4. Использование облака без загрузки картинок и файлов товаров.
 *    (isCloudServer = false, useCloudServer = true, downloadPicturesAndFilesFromCloudServer = false)
 *
 *    XML/JSON загружаются только с облака. К поставщикам не лезем.
 *    Картинки и файлы товаров не загружаются. Клиент использует ссылки на облако
 *
 * */

