import Vue from 'vue'
import Vuex from 'vuex'
import db from '../dataStore'
import moment from 'moment'
moment.locale('en', {week: { dow: 1 }})

console.log(moment('07/08/2018').week())

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    logList: [],
    count: 0,
    STOREFILE: null,
    editingLog: null,
    log: null,
    name: '',
    timeRange: ''
  },
  mutations: {
    updateName (state, { name } = {}) {
      console.log(name)
      if (name) {
        db.update('name', n => name).write()
      }
      state.name = db.get('name').value()
    },

    addLog (state, { log }) {
      const newLog = Object.assign({}, log)

      this.commit('cancelUpdateLog')

      if (newLog.id) {
        return this.commit('updateLog', { log: newLog })
      }
      newLog.id = state.count
      newLog.formatTime = moment().format('L')
      newLog.createTime = newLog.updateTime = moment().valueOf()

      db.update('count', n => n + 1)
        .write()

      db.get('logList')
        .push(newLog)
        .write()
        .reverse()

      this.commit('updateLogList')
    },

    removeLog (state, { logId }) {
      db.get('logList')
        .remove({ id: logId })
        .write()

      this.commit('updateLogList')
    },

    updateLog (state, { log }) {
      log.updateTime = moment().valueOf()
      log.formatTime = moment().format('L')
      db.get('logList')
        .find({ id: log.id })
        .assign(log)
        .write()

      this.commit('updateLogList')
    },

    cancelUpdateLog (state) {
      state.log = {
        itemProgress: 0,
        itemName: '',
        itemRemark: '',
        itemLink: '',
        id: ''
      }
    },

    finishLog (state, { logId }) {
      db.get('logList')
        .find({ id: logId })
        .assign({ hasFinish: true, itemProgress: '100%' })
        .write()

      this.commit('updateLogList')
    },

    updateLogList (state, { month } = {}) {
      state.timeRange = month = month || moment().format('M')

      state.logList = db
        .get('logList')
        // .sortBy('createTime')
        .filter(log => moment(log.updateTime).format('M') === month)
        .sortBy('updateTime')
        .value()
        .reverse()

      // console.log(state.logList)

      state.count = db.get('count').value()
    },

    updateStoreFile (state, { STOREFILE }) {
      state.STOREFILE = STOREFILE
    },

    editLog (state, { log }) {
      state.log = log
    }
  }
})
