<template>
  <div class="item" data-progress="50%" @click.stop>
    <div class="item-progress">{{ log.itemProgress }}</div>
    <div class="item-name">{{ log.itemName }}></div>
    <div class="item-remark">
      <p>{{ log.itemRemark?`备注：${log.itemRemark}`:'' }}</p>
      <p>
        <el-popover effect="dark" placement="top" trigger="hover">
          <span>{{ log.itemLink }}</span>
          <a href="javascript:" @click="copyLink">(复制链接)</a>
          <a slot="reference" href="javascript:" target="_blank" @click="openLink()">{{ log.itemLink }}</a>
        </el-popover>
      </p>
    </div>
    <div class="item-operation item-operation-left">
      <a href="javascript:" class="item-del" @click="removeLog(log.id)"></a>
    </div>
    <div class="item-operation">
      <a href="javascript:" class="item-check" @click="finishLog(log.id)" v-if="!log.hasFinish"></a>
      <a href="javascript:" class="item-edit" @click.stop="editLog(log)" v-show="!canEdit"></a>
      <a href="javascript:" class="item-edit editing" @click.stop="editLog(log.id)" v-show="canEdit"></a>
    </div>
    <div class="item-progress-bar" :style="{width: progress}"></div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { shell, clipboard } from 'electron'

export default {
  // name: 'item'
  data () {
    return {
      canEdit: false,
      timeout: null,
      progress: 0
    }
  },
  created () {
    setTimeout(() => {
      this.progress = this.$props.log.itemProgress
    }, 100)
  },
  watch: {
    '$props.log.itemProgress' () {
      setTimeout(() => {
        this.progress = this.$props.log.itemProgress
      }, 100)
    }
  },
  props: ['log', 'lastLog'],
  methods: {
    ...mapMutations([
      'removeLog',
      'finishLog',
      'editLog'
    ]),
    openLink () {
      shell.openExternal(this.log.itemLink)
    },
    copyLink () {
      clipboard.writeText(this.log.itemLink)
      this.$message({
        message: '复制链接成功！',
        type: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/var';
.item {
  display: grid;
  grid-template-columns: 1fr 4.5fr minmax(0, 4.5fr);
  grid-column-gap: 10px;
  align-items: center;
  position: relative;
  margin: 0 0 10px 0;
  padding: 0 20px;
  width: 100%;
  line-height: 20px;
  height: 60px;
  border: none;
  border-radius: 3px;
  box-sizing: border-box;
  font-size: $item-font-size;
  justify-items: start;
  grid-auto-rows: 60px;

  .col {
    padding: 20px 0;
  }

  input {
    background: transparent;
    border: none;
    outline: none;
    box-shadow: none;
    color: inherit;
    font-size: inherit;
    font-weight: normal;
    text-align: left;
  }

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: $item-color;
    z-index: -1;
    border-radius: 3px;
  }
  &-progress-bar {
    position: absolute;
    width: 0%;
    height: 100%;
    background: $green;
    z-index: -1;
    border-radius: 3px;
    transition: all 1s;
  }
  &-name {
    max-height: 100%;
    overflow: hidden;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  &-progress {
    text-align: center;
  }
  &-remark {
    width: 100%;
    font-size: 0.8em;
    opacity: 0.8;
    overflow: hidden;

    p {
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    a:hover {
      color: #fff;
    }
  }
  &-operation {
    position: absolute;
    left: 100%;
    padding-left: 10px;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;

    a {
      width:  30px;
      height: 60px;
      margin-right: 10px;
      border: none;
      flex-shrink: 0;
      background-size: 30px 30px;
      background-position: center center;
      background-repeat: no-repeat;
    }
    &-left {
      left: auto;
      right: 100%;
      padding-right: 10px;
      justify-content: flex-end;
      
      a {
        margin-right: 0;
        margin-left: 10px;
      }
    }

  }
  &-edit {
    visibility: hidden;
    background-image: url('~@/assets/images/edit.svg');
    &.editing {
      visibility: visible;
      background-image: url('~@/assets/images/keyboard.svg');
    }
  }
  &-check {
    background-image: url('~@/assets/images/check.svg');
  }
  &-del {
    visibility: hidden;
    background-image: url('~@/assets/images/del.svg');
  }
  &:hover &-del,
  &:hover &-edit {
    visibility: visible;
  }
}
</style>

