<template>
  <nav>
    <router-link to="/">记录</router-link>
    <router-link to="history">历史记录</router-link>
  </nav>
</template>

<script>
  export default {
    name: 'workNav'
  }
</script>

<style lang="scss" scoped>
nav {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #454453;
  font-size: 26px;
  line-height: 40px;
}
a {
  color: #FBFAFB;
  text-decoration: none;
}
</style>
