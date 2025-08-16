import * as path from 'path'


export class FileFilter {

  static csvFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(csv)$/)) {
      return callback(new Error('Only csv files are allowed!'), false)
    }
    callback(null, true)
  }

  static svgFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(svg)$/)) {
      return callback(new Error('Only svg files are allowed!'), false)
    }
    callback(null, true)
  }

  static imageFilter = (req, file, callback) => {
    const allowedExt: string[] = ['.png', '.jpg', '.gif', '.jpeg', '.svg']
    const ext = path.extname(file.originalname)
    if (!allowedExt.includes(ext)) {
      return callback(new Error('Only images are allowed'))
    }
    callback(null, true)
  }

  static jsonFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(json)$/)) {
      return callback(new Error('Only json files are allowed!'), false)
    }
    callback(null, true)
  }


}
