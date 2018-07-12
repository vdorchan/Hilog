import genHtml from './genHtml'
import html2docx from './html2docx'

const { promisify } = require('util')
const fs = require('fs')

const genWord = (logList, name, path) => {
  return new Promise(async (resolve, reject) => {
    try {
      const html = genHtml(logList, name)
      const docx = html2docx.asBlob(html)
      await promisify(fs.writeFile)(path, docx)
      resolve()
    } catch (err) {
      if (err) reject(err)
    }
  })
}

export default genWord
