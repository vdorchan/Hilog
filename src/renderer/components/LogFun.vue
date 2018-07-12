<template>
  <div class="bottom">
    <div>
      <router-link class="btn-setting" to="/setting"></router-link>
    </div>
    <a href="javascript:" @click="genWord">导出周报(word文档)</a>
  </div>
</template>

<script>
import genWord from '../util/genWord'
import { ipcRenderer } from 'electron'

export default {
  name: 'log-fun',
  data () {
    return {
    }
  },
  created () {
    ipcRenderer.on('saved-word', (event, path) => {
      if (!path) path = 'No path'
      genWord(this.$store.state.STOREFILE, path)
    })
  },
  methods: {
    genWord () {
      ipcRenderer.send('save-dialog')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/var';

.bottom {
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 0 $container-padding + 50px 0 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  box-sizing: border-box;
  background: $bg;

  a {
    color: #ffffff;
    text-decoration: none;
  }
}
.btn-setting {
  display: block;
  width: 30px;
  height: 30px;
  background: url('~@/assets/images/setting.svg');
}
</style>

