<template>
  <div id="app">
    <title-bar></title-bar>
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import TitleBar from './components/TitleBar'

export default {
  name: 'Hilog',
  components: {
    TitleBar
  }
}
</script>

<style lang="scss">
@import './assets/scss/var';
body {
  margin: 0;
  padding: 0;
  background: $bg;
  color: $font-color;
  font-family: 'Helvetica', 'Arial', sans-serif;
  font: caption;
  font-weight: lighter;
  overflow-y: auto;
}
#app {
  overflow: hidden;
}
.nav-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  width: 200px;
  height: 100%;
}
.container a {
  text-decoration: none;
  color: #ffffff;
  &:hover {
    color: $green;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.el-popover {
  border-radius: 4px;
  padding: 10px;
  z-index: 2000;
  font-size: 12px;
  line-height: 1.2;
  min-width: 10px;
  background: #303133;
  color: #fff;
  border: none;
  a {
    padding: 2px;
    border-radius: 4px;
    color: inherit;
    text-decoration: none;
    &:hover {
      color: $green;
    }
  }
}
</style>
