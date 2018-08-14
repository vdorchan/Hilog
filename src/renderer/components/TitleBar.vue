<template>
  <div :class="['title-bar', {'is-mac': os === 'darwin'}]">
    Hilog - {{ version }}
    <div class="title-bar-buttons" v-if="os !== 'darwin'">
      <a href="javascript:" class="minimize" @click="sendCommand('minimizeWindow')"></a>
      <a href="javascript:" class="maximize" @click="sendCommand('maximizeWindow')" v-show="!isMaximized"></a>
      <a href="javascript:" class="close" @click="sendCommand('restoreWindow')" v-show="isMaximized"></a>
      <a href="javascript:" class="close" @click="sendCommand('closeWindow')"></a>
    </div>
  </div>
</template>

<script>
import pkg from '../../../package.json'
import { ipcRenderer, remote } from 'electron'
const { BrowserWindow } = remote

export default {
  data () {
    return {
      version: process.env.NODE_ENV === 'production' ? pkg.version : 'Dev',
      os: process.platform,
      isMaximized: false
    }
  },
  methods: {
    sendCommand (command) {
      ipcRenderer.send(command)
      try {
        this.isMaximized = BrowserWindow.getAllWindows()[0].getSize[0] > 1000
      } catch (error) {
        throw new Error(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/var';

.title-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  -webkit-app-region: drag;
  user-select: none;
  height: 30px;
  width: 100%;
  color: #eee;
  font-size: 12px;
  background: $bg;

  &.is-mac {
    height: 22px;
  }

  &-buttons {
    position: absolute;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    top: 0;
    right: 0;
    z-index: 10000;
    -webkit-app-region: no-drag;

    a {
      display: block;
      width: 30px;
      height: 30px;
      background-size: 15px auto;
      background-repeat: no-repeat;
      background-position: center center;

      &:hover {
        background-color: darken($bg, 5%);
      }
    }
  }
  .minimize {
    background-image: url(~@/assets/images/window-minimize.png);
  }
  .maximize {
    background-image: url(~@/assets/images/window-maximize.png);
  }
  .restore {
    background-image: url(~@/assets/images/window-restore.png);
  }
  .close {
    background-image: url(~@/assets/images/window-close.png);
    &:hover {
      background-color: #FF5F58;
    }
  }
}
</style>
