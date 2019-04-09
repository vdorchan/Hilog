import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import { app, remote } from 'electron'
import fs from 'fs'

const APP = process.type === 'renderer' ? remote.app : app

const STORE_PATH = APP.getPath('userData')
const STORE_FILE = path.join(STORE_PATH, '/db.json')

// 不存在该文件时，先创建
if (process.type !== 'renderer') {
  try {
    fs.accessSync(STORE_FILE)
  } catch (error) {
    fs.writeFileSync(STORE_FILE, '')
  }
}

const adapter = new FileSync(STORE_FILE)
const db = low(adapter)

db.STORE_FILE = STORE_FILE

export default db
