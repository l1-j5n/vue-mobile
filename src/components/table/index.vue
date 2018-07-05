
<!--********************************************************************
 * Author        : Geyan
 * Email         : geyan@zhongan.io
 * Create Date   : 2017-04-13 18:17
 * Filename      : table.vue
 * Description   : 业务表格组件

********************************************************************-->

<template>
<div class='table_content_sty'>
  <ul class='info-table' :class='{border:hasBorder}'>
    <li class='info-head'>
      <div v-for='(item, index) in head' class='info-td' :key="index"><span>{{ item.name }}</span></div>
    </li>
    <li v-for='line in data' class='info-line'>
      <div v-for='(td,idx) in line' class='info-td'>
        <span>{{ td }}</span>
      </div>
    </li>
    <!-- <li v-for='line in data' class='info-line'>
      <div v-for='(td,idx) in line' class='info-td'>
        <span>{{ td }}</span>
      </div>
    </li> -->
    <!-- <li v-for='line in data' class='info-line'>
      <div v-for='(td,idx) in line' class='info-td' :style='{textAlign:tHeadList[idx].left ? "left" : "center"}'>
        <span :class='{figure:tHeadList[idx].figure}'>{{ td }}</span>
      </div>
    </li> -->
  </ul>
  <p class='charge-total'>
    首年保费合计：
    <span class='figure'>
      <span class="premium">{{_total()}}元</span>
    </span>
  </p>
</div>
</template>

<script>
export default {
  data: () => {
    return {
      tHeadList: [],
      tBodyList: [],
      hasBorder: false
    }
  },
  props: ['head', 'data', 'border'],
  methods: {
    _total() {
      let tot = 0
      this.data.map(item => {
        tot += parseFloat(item.premium)
      })
      return tot.toFixed(2)
    }
  },
  created () {
    this.tHeadList = this.head
    this.tBodyList = this.data
    this.hasBorder = this.border ? this.border : false
    // console.log(this.data)
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/styles/page.less";
.table_content_sty {
    width: 100%;
    // margin-left: auto;
    // margin-right: auto;
    font-weight: bold;
    .charge-total {
      background-color:@weuiLineColorApplicant;
      padding: 16px 8px;
      text-align: right;
      padding-right: 10px;
      .premium {
        color: @colorPremium;
      }
    }
    .info-table {
        width: 100%;
        display: table;
        border-collapse: collapse;
        // border:1px solid @white;
        // border-top-left-radius: 8px;
        // border-top-right-radius: 8px;
        .info-head,
        .info-line {
            list-style: none;
            display: flex;
            justify-content: center;
            align-items: center;
            border-bottom: 1px solid @weuiLineColorLight;
            .info-td {
                flex: 1;
                // display: table-cell;
                padding: 16px 8px;
                text-align: center;
                // vertical-align: middle;
                span {
                  font-size:13px;
                  text-align:center;
                }
            }
        }
        .info-line {
          background-color:@weuiLineColorApplicant;
          .info-td {
            color:#666;
            span {
              line-height: 18px;
            }
          }
          .info-td .figure {
            color:#00aeff;
          }
        }
        .info-head {
            background-color: @tableHeadBg;
            .info-td {
                margin:0;
                font-size: 13px;
                // color: #fff;
                // border:1px solid @white;
                span {
                    word-break: keep-all;
                    line-height: 18px;
                    box-sizing: border-box;
                }
            }
        }
    }
    .info-table.border {
      .info-head {
        .info-td {
          border:1px solid #f0f0f0;
        }
      }
      .info-line {
        border:1px solid #f0f0f0;
        .info-td {
          border:1px solid #f0f0f0;
        }
      }
    }
}

</style>
