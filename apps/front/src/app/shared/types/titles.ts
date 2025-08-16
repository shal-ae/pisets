export const Titles = {
  home: 'Сервис подписывания документов "Писец"',

  doc4sList: 'Список документов',
  doc4sListRelative: 'sign',

  doc4sign: ( docId: number ) => {
    if ( docId ) {
      return `Запрос на подпись № ${docId}`
    } else {
      return `Запрос на подпись`
    }
  },

  settingsStamps: 'Печати и подписи',

  settingsUsers: 'Пользователи',
}
