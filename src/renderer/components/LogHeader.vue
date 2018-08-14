<template>
  <div class="log-top">
    <div class="calendar">
      <div class="day">{{ day }}</div>
      <div class="my">
        <div class="month">{{ month }}</div>
        <div class="year">{{ year }}</div>
      </div>
      <div class="today">{{ weekday }}</div>
    </div>
    <div class="date-filter">
      <div>
         <!-- <el-date-picker
          size="small"
          v-model="timeRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          :unlink-panels=true
          :default-value="new Date(1530633600000)"
          :picker-options="pickerOptions2"
          >
        </el-date-picker> -->
        <el-date-picker
          size="small"
          v-model="timeRange"
          type="month"
          placeholder="选择月"
          :picker-options="pickerOptions"
          value-format="M"
          @change="setMonth"
        >
        </el-date-picker>
      </div>
      <!-- <a href="javascript:" class="btn-menu"></a> -->
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          <a href="javascript:" class="btn-menu"></a>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item><router-link to="/setting">设置</router-link></el-dropdown-item>
          <el-dropdown-item command="genWeekWord" divided>导出周报（这一周）</el-dropdown-item>
          <el-dropdown-item command="genLastWeekWord">导出周报（上一周）</el-dropdown-item>
          <el-dropdown-item command="genBiweeklyText">导出双周汇报</el-dropdown-item>
          <el-dropdown-item command="toGithubIssue" divided>软件有bug，怼作者</el-dropdown-item>
          <el-dropdown-item command="toGithub">软件很skr，给作者加star</el-dropdown-item>
          <el-dropdown-item command="showAbout" divided>关于</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <select name="" id="">
        <option value="7">最近7天</option>
        <option value="14">最近14天</option>
      </select> -->
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import moment from 'moment'
import genWord from '../util/genWord'
import { ipcRenderer, clipboard, shell } from 'electron'

export default {
  name: 'date',
  props: ['startDate', 'endDate'],
  data () {
    return {
      day: '',
      month: '',
      year: '',
      weekday: '',
      pickerOptions: {
        firstDayOfWeek: 1
      },
      genWordOptions: {
        logList: [],
        name: ''
      }
    }
  },
  computed: {
    ...mapState([
      'timeRange'
    ])
  },
  created () {
    this.day = moment().format('DD')
    this.month = moment().format('MMM')
    this.year = moment().format('YYYY')
    this.weekday = moment().format('dddd')

    ipcRenderer.on('saved-word', async (event, path) => {
      if (path) {
        const { logList, name } = this.genWordOptions
        await genWord(logList, name, path)
        this.$message({
          message: '成功导出周报',
          type: 'success'
        })
      }
    })
  },
  methods: {
    ...mapMutations([
      'updateLogList'
    ]),
    setMonth (month) {
      this.updateLogList({ month })
    },
    handleCommand (command) {
      if (command) {
        this[command]()
      }
    },
    genWeekWord (delta = 0) {
      const m = moment().week() + delta
      const logList = this
        .$db
        .get('logList')
        .filter(log => moment(log.updateTime).week() === m)
        .value()

      this.genWordOptions = {
        logList,
        name: this.$store.state.name
      }

      if (!logList || !logList.length) {
        return this.$message({
          message: '所选周暂无项目，无法生成周报！',
          type: 'warning'
        })
      }
      ipcRenderer.send('save-dialog')
    },
    genLastWeekWord () {
      this.genWeekWord(-1)
    },
    genBiweeklyText () {
      const mArr = []
      let m = parseInt(moment().week())
      mArr.push(m, m - 1)

      const logList = this
        .$db
        .get('logList')
        .filter(log => log.itemLink && mArr.find(_m => _m === moment(log.updateTime).week()))
        .value()

      if (logList && logList.length) {
        const text = logList.map(log => `项目名：${log.itemName}\n链接：${log.itemLink}\n`).join('')

        clipboard.writeText(text)

        this.$message({
          message: '已成功复制双周汇报到剪贴板上！',
          type: 'success'
        })
      } else {
        this.$message({
          message: '所选周暂无项目，无法生成双周汇报！',
          type: 'warning'
        })
      }
    },
    showAbout () {
      ipcRenderer.send('showAbout')
    },
    toGithubIssue () {
      shell.openExternal('https://github.com/vdorchan/Hilog/issues')
    },
    toGithub () {
      shell.openExternal('https://github.com/vdorchan/Hilog')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/scss/var';
@import '~@/assets/scss/element-variables';

.log-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 20px 0;
  font-size: $heading-font-size;
  user-select: none;
  cursor: default;
  .calendar {
    display: flex;
    align-items: center;
    .day {
      font-size: $big-font-size;
      font-weight: bold;
    }
    .my {
      padding: 0 0 0 5px;
      .month {
        font-weight: bold;
      }
    }
    .today {
      margin-left: 30px;
    }
  }
}

.btn-menu {
  display: block;
  width: 26px;
  height: 30px;
  margin-left: 10px;
  background: no-repeat url(~@/assets/images/bar.svg);
}

a {
  display: block;
  width: 100%;
  height: 100%;
  color: inherit;
  text-decoration: none;
}
.date-filter {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.log-top /deep/ input {
  display: block;
  background: $input-color;
  border: none;
  border-radius: 3px;
  color: $font-color;
  font-size: $item-font-size;
  outline: none;
}
</style>
