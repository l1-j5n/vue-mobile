<template>
  <div class="sign-tax">
    <h4>
      <span>仅为中国税收居民</span>
      <r-switch v-model="isChineseTaxResident" @update="onToggleResident"/>
    </h4>
    <div class="panel-tax" v-if="!belongToChina">
      <ul class="list-tax" v-if="taxInfo.name">
        <li>
          <span class="title">税收居民基本信息</span>
          <span @click="viewDetail">查看更多<i class="triangle-right"></i></span>
        </li>
        <li>
          <span>姓&nbsp;/&nbsp;名</span>
          <span>{{taxInfo.name}}</span>
        </li>
        <li v-for="item in taxInfo.taxCountry">
          <span>税收居民国（地区）</span>
          <span>{{item}}</span>
        </li>
      </ul>
      <div v-else class="tips">
        <span>请填写个人税收居民信息</span>
        <r-icon name="sign" @click="viewDetail"/>
      </div>
    </div>
  </div>
</template>

<script>
  import {RSwitch, RIcon} from 'src/components'
  import API from 'src/api'

  export default {
    components: {
      RIcon,
      RSwitch
    },
    props: {
      taxInfo: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    computed: {
      isChineseTaxResident: {
        get () {
          return this.taxInfo.isChineseTaxResident
        },
        set (isChineseTaxResident) {
          this.taxInfo.isChineseTaxResident = isChineseTaxResident
        }
      },
      belongToChina () {
        return this.isChineseTaxResident === 'Y'
      }
    },
    methods: {
      viewDetail () {
        const {applyId} = this.taxInfo
        const {path} = this.$route
        this.$router.push({path: '/taxDweller', query: {applyId}})
      },
      onToggleResident () {
        this.$emit('update', this.isChineseTaxResident)
      }
    }
  }
</script>
<style lang="less">
  @primaryColor: #5697ff;

  .sign-tax {
    background-color: white;
    margin-bottom: 15px;

    h4 {
      line-height: 45px;
      font-weight: normal;
      margin: 0 0 0 15px;
      padding-right: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .tips {
      color: @primaryColor;
    }

    .panel-tax {
      padding-right: 15px;
      margin-left: 15px;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
        height: 1px;
        background-color: #c7c7c7;
        transform: scaleY(0.5);
        transform-origin: top;
      }

      .tips {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 45px;
      }
    }

    .triangle-right {
      display: inline-block;
      border-right: 1px solid @primaryColor;
      border-bottom: 1px solid @primaryColor;
      width: 8px;
      height: 8px;
      transform: rotate(-45deg);
    }

    .list-tax {
      list-style: none;
      margin: 10px 0 20px;
      border-radius: 8px;
      overflow: hidden;
      line-height: 40px;
      padding-left: 0;

      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
        background-color: #f7f7f7;
        margin-bottom: 1px;
      }

      > li:first-child {
        background-color: #d8f4ff;
        color: @primaryColor;
      }

      .title {
        color: #999;
      }
    }
  }
</style>
