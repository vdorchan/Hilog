<template>
  <div class="container">
    <log-header></log-header>
    <div class="input-container" style="-webkit-app-region: no-drag;">
      <div class="log-progress input-wrapper">
        <input type="number" placeholder="进度" v-model.number.trim="log.itemProgress" @input="fixProgress" min=0 max=100 ref="itemProgress" @keypress.enter="addLog">
      </div>
      <div class="input-wrapper">
        <input type="text" placeholder="项目名称" v-model.trim="log.itemName" @focus="popHoverSelect('itemName', 'showSiteSelect')" @input="popHoverSelect('itemName', 'showSiteSelect')" @blur="hideHoverSelect('showSiteSelect')" ref="itemName" @keypress.enter="addLog">
        <div class="hover-select site-select" v-show="showSiteSelect && filterSites.length">
          <ul>
            <li v-for="s of filterSites" :key="s" @click="hoverSelect(s, 'itemName', 'showSiteSelect')">{{ s }}</li>
          </ul>
        </div>
      </div>
      <div class="input-wrapper">
        <input type="url" placeholder="项目链接" v-model.trim="log.itemLink" ref="itemLink" @keypress.enter="addLog">
      </div>
      <div class="input-wrapper">
        <input type="text" placeholder="备注" v-model.trim="log.itemRemark" @focus="popHoverSelect('itemRemark', 'showRemarkSelect')" @input="popHoverSelect('itemRemark', 'showRemarkSelect')" @blur="hideHoverSelect('showRemarkSelect')" ref="itemRemark" @keypress.enter="addLog">
        <div class="hover-select" v-show="showRemarkSelect">
          <ul>
            <li v-for="s of remarks" :key="s" @click="hoverSelect(s, 'itemRemark', 'showRemarkSelect')">{{ s }}</li>
          </ul>
        </div>
      </div>
      <a href="javascript:" class="log-add" @click="addLog" :title="log.id?'添加项目':'修改项目'"></a>
      <a href="javascript:" class="log-ban" @click="cancelUpdateLog" title="取消修改" v-show="log.id"></a>
    </div>
    <div class="log-list">
      <transition-group name="list-complete" tag="p">
        <template v-for="(log, idx) of logList">
          <div class="log-time" v-if="idx===0||logList[idx-1].formatTime!==log.formatTime" :key="log.formatTime">{{ log.formatTime }}</div>
          <log-item :log="log" :key="log.id" class="list-complete-item"></log-item>
        </template>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import LogItem from './LogItem'
import LogHeader from './LogHeader'

export default {
  name: 'log-list',
  data () {
    return {
      showSiteSelect: false,
      sites: [ '汽车网', '电脑网', '时尚网', '亲子网', '家居网' ],
      filterWord: '',
      remarks: ['已完成', '已上线'],
      showRemarkSelect: false,
      log: null
    }
  },
  created () {
    this.log = this.$store.getters.log
  },
  watch: {
    '$store.getters.log' () {
      this.log = this.$store.getters.log
    }
  },
  computed: {
    filterSites () {
      const v = this.log.itemName.replace('[', '')
      const filterSites = this.sites.filter(s => s.includes(v))
      return filterSites.length ? filterSites : this.sites
    },
    ...mapState([
      'logList'
    ])
  },
  methods: {
    ...mapMutations([
      'cancelUpdateLog'
    ]),
    addLog () {
      const { log } = this

      if (!log.itemName) {
        return alert('缺少项目名称！')
      }
      this.$store.commit('addLog', { log: Object.assign({}, log, { itemProgress: log.itemProgress + '%' }) })
    },
    fixProgress (el) {
      el.target.value = '%'
    },
    popHoverSelect (ref, ipt) {
      const { value } = this.$refs[ref]
      if (ipt === 'itemName') {
        const site = value.replace(/\[(\S{3})\].*/, '$1')
        if (!this.sites.includes(site)) {
          this[ipt] = true
        }
      } else {
        if (!value) {
          this[ipt] = true
        }
      }
    },
    hideHoverSelect (tar) {
      setTimeout(() => {
        this[tar] = false
      }, 10)
    },
    hoverSelect (s, ipt, tar) {
      if (ipt === 'itemName') {
        if (this.filterSites.length < 5 || this.log.itemName === '[') {
          this.log.itemName = ''
        }
        this.log.itemName = `[${s}]` + this.log.itemName
      } else {
        if (ipt === 'itemRemark' && (s === '已完成' || s === '已上线')) {
          this.log.itemProgress = '100'
        }
        this.log[ipt] = s
      }
      this.$refs[ipt].focus()
      this.hideHoverSelect(tar)
    }
  },
  components: {
    LogItem,
    LogHeader
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/var';

.container {
  position: relative;
  padding: 0 90px 0 50px;
}
.input-container {
  display: grid;
  grid-template-columns: 1fr 4fr 3.5fr 1.5fr;
  grid-column-gap: 10px;
  /* display: flex;
  align-items: center;
  justify-content: space-between; */
  margin-bottom: 10px;
  position: relative;
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
  font-size: $item-font-size;
  outline: none;
}
select {
  text-indent: 10px;
}
.log {
  &-add,
  &-ban {
    position: absolute;
    left: 100%;
    margin-left: 10px;
    top: 50%;
    transform: translateY(-50%);
    display: block;
    width: 30px;
    height: 30px;
    background: no-repeat url('~@/assets/images/plus.svg');
    border: none;
    flex-shrink: 0;
  }
  &-ban {
    margin-left: 50px;
    background: no-repeat url('~@/assets/images/ban.svg');
  }
  &-progress {
    display: flex;
    align-items: center;
  }
  &-progress input {
    padding: 20px 0;
    text-align: center;
  }
  &-progress::after {
    content: ' %';
    display: block;
    padding-left: 10px;
  }
  &-time {
    line-height: 40px;
    height: 40px;
    font-size: 14px;
    cursor: default;
  }
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.input-wrapper {
  position: relative;
}
.hover-select {
  position: absolute;
  top: 110%;
  z-index: 9;

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    line-height: 30px;
    text-align: left;
    font-size: 14px;
    color: $font-color;
    background: #4d4c54;
    border-radius: 3px;
    border: 1px solid #ccc;
  }
  li {
    padding: 0 10px;
    border-bottom: 1px solid #ccc;
    cursor: pointer;
  }
  li:hover {
    background: #8e8c9c;
  }
  li:last-child {
    border: none;
  }
}


.list-complete-item {
  transition: all 1s;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}

</style>

