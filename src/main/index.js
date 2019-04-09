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
import pkg from '../../package.json'

let tray
let forceQuit

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

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    resizable: false,
    backgroundColor: '#403F4D',
    center: true,
    titleBarStyle: 'hidden',
    frame: process.platform !== 'win32'
  })

  mainWindow.loadURL(winURL)
  mainWindow.on('close', (e) => {
    if (!forceQuit) {
      e.preventDefault()
      mainWindow.hide()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
    if (tray) {
      tray.destroy()
      tray = null
    }
  })

  app.on('before-quit', function (e) {
    forceQuit = true
    mainWindow.close()
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
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
  if (!tray) {
    createTray()
  }
  mainWindow.show()
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
  // const iconName = process.platform === 'win32' ? './win/ico.ico' : './mac/ico.icns'
  const iconName = './ico.png'
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
      forceQuit = true
      mainWindow.close()
    }
  }])

  tray.on('click', () => {
    mainWindow.show()
  })

  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu)
  })
  tray.setToolTip('Open Hilog.')
}

ipcMain.on('minimizeWindow', () => {
  mainWindow.minimize()
})

ipcMain.on('maximizeWindow', () => {
  mainWindow.maximize()
})

ipcMain.on('closeWindow', () => {
  mainWindow.close()
})

ipcMain.on('restoreWindow', () => {
  mainWindow.unmaximize()
})

ipcMain.on('showAbout', () => {
  dialog.showMessageBox({
    title: 'Hilog',
    message: 'Hilog',
    detail: `Version: ${pkg.version}\nAuthor: vdorchan <vdorchan@gmail.com>\nGithub: https://github.com/vdorchan/Hilog`
  })
})

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
