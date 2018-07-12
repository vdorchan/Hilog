'use strict'

import {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  Menu,
  Tray
} from 'electron'

import moment from 'moment'
import db from '../renderer/dataStore'
import path from 'path'

let tray

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

let isTrueClose = false

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    resizable: false
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('close', (e) => {
    if (!isTrueClose) {
      e.preventDefault()
      mainWindow.hide()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  createWindow()
  createTray()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
  if (tray) tray.destroy()
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('save-dialog', function (event) {
  const name = db.get('name').value()
  const options = {
    title: '保存周报',
    defaultPath: `${moment().format('YYYYMMDD')}_${name}.docx`,
    filters: [
      { name: 'Word', extensions: ['docx'] }
    ]
  }
  dialog.showSaveDialog(options, function (filename) {
    event.sender.send('saved-word', filename)
  })
})

function createTray () {
  const iconName = process.platform === 'win32' ? './win/ico.ico' : './mac/ico.icns'
  const iconPath = path.join(__dirname, iconName)
  tray = new Tray(iconPath)

  const contextMenu = Menu.buildFromTemplate([{
    label: '打开主窗口',
    click () {
      mainWindow.show()
    }
  }, {
    label: '退出程序',
    click () {
      isTrueClose = true
      mainWindow.close()
    }
  }])

  tray.on('click', () => {
    mainWindow.isVisible() || mainWindow.show()
  })

  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu)
  })
  tray.setToolTip('Electron Demo in the tray.')
  // tray.setContextMenu(contextMenu)
}
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
