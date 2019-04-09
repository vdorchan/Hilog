<template>
  <div class="container">
    <div class="ipt-name-wrapper">
      <input class="ipt-name" type="text" placeholder="你的姓名" v-model="name" @keyup.enter="login">
      <a class="btn-login" href="javascript:" @click="login"></a>
    </div>
    <template v-if="!$route.meta.isLogin">
      <router-link class="btn-back" to="/index">&lt; 返回</router-link>
    </template>
  </div>
</template>

<script>

export default {
  data () {
    return {
      name: ''
    }
  },
  created () {
    this.name = this.$store.state.name
  },
  methods: {
    login () {
      this.$store.commit('updateName', { name: this.name })
      this.$router.push('index')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/var';

.container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: $item-font-size;
}
.info {
  position: fixed;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 30px;

  label {
    margin-right: 10px;
  }
  p {
    margin: 0;
  }
}
a {
  color: #ffffff;
  text-decoration: none;
}
input,
select {
  display: block;
  width: 100%;
  padding: 20px;
  height: 60px;
  background: $input-color;
  border: none;
  border-radius: 3px;
  box-sizing: border-box;
  color: $font-color;
  outline: none;
  font-size: $item-font-size;
}
.ipt-name {
  text-align: center;
  width: 300px;
  margin-right: 10px;

  &-wrapper {
    position: fixed;
    top: 40%;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.btn {
  &-back {
    position: fixed;
    left: 20px;
    top: 40px;
  }
  &-login {
    display: block;
    width: 35px;
    height: 35px;
    background: no-repeat url('~@/assets/images/login.svg');
    &:hover {
      background-image: url('~@/assets/images/login2.svg');
    }
  }
}
</style>
