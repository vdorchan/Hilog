import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DatePicker,
  Tooltip,
  Message,
  Popover
} from 'element-ui'

import db from './dataStore'

Vue.prototype.$db = db
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(DatePicker)
Vue.use(Tooltip)
Vue.use(Popover)
Vue.prototype.$message = Message

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

if (!db.has('logList').value()) {
  db.defaults({ logList: [], count: 0, name: '' })
    .write()
} else {
  store.commit('updateLogList')
  store.commit('updateName')
  store.commit('updateStoreFile', { STOREFILE: db.STORE_FILE })

  router.push(store.state.name ? 'index' : 'login')
}

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
