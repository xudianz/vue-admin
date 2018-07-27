<template>
  <div>
    <!-- <div>定时发送</div> -->
    <el-card>
      <div slot="header" class="clearfix">
        <span class="demo-panel-title">定时发送</span>
      </div>
      <div class="select-wrapper">
        <el-row :gutter="1">
          <el-col :span="5">
            <el-input clearable v-model="form.smsKey" placeholder="账号查询"></el-input>
          </el-col>
          <el-col :span="5">
            <el-input clearable v-model="form.batchNo" placeholder="批次号查询"></el-input>
          </el-col>
          <el-col :span="5">
            <el-select v-model="form.isSend" style="width:100%" placeholder="发送状态" clearable>
              <el-option value="0" label="未发送"></el-option>
              <el-option value="1" label="已发送"></el-option>
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-select v-model="form.overdue" placeholder="过期状态" clearable>
              <el-option value="0" label="已过期"></el-option>
              <el-option value="1" label="未过期"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
      <div class="select-wrapper" style="margin-top: 10px">
        <el-row :gutter="1">
          <el-col :span="5">
            <el-date-picker
              v-model="form.beginTime"
              type="datetime"
              placeholder="选择开始时间"
              align="left"
              width="100%"
              :picker-options="pickerOptions1">
            </el-date-picker>
          </el-col>
          <el-col :span="5">
            <el-date-picker
              v-model="form.endTime"
              type="datetime"
              placeholder="选择结束时间"
              align="left"
              :picker-options="pickerOptions1">
            </el-date-picker>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" class="search-button" @click="select">查&nbsp;&nbsp;&nbsp;&nbsp;询</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="table">
        <el-table :data="tableData" v-loading="loading" style="width: 100%">
          <el-table-column prop="smsCnl" label="短信通道"></el-table-column>
          <el-table-column prop="bNo" label="批次号"></el-table-column>
          <el-table-column prop="memo" label="批次备注"></el-table-column>
          <el-table-column prop="sign" label="签名">
            <template slot-scope="scope">
              <el-popover trigger="hover" title="短信文案：" placement="top">
                <p>{{scope.row.smstxt}}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.sign }}</el-tag>
                </div>
            </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="tTime" label="触发时间" :formatter="formatterTTime" width="120"></el-table-column>
          <el-table-column prop="fTime" label="失效时间" :formatter="formatterFTime"></el-table-column>
          <el-table-column prop="t" label="插入时间" width="120" :formatter="formatterT"></el-table-column>
          <el-table-column prop="sFlag" label="是否发送" :formatter="formatterSFlag"></el-table-column>
          <el-table-column prop="fFlag" label="过期状态" :formatter="formatterFFlag"></el-table-column>
          <el-table-column prop="jump" label="重定向" :formatter="formatterJump"></el-table-column>
          <el-table-column prop="track" label="追踪" :formatter="formatterTrack"></el-table-column>
          <el-table-column prop="status" label="发送状态">
            <template slot-scope="scope">
              <el-button type="text" class="green" :class="{diff: scope.row.status === '0'}">{{formatterStatus(scope.row.status)}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination" v-if="tableData.length">
        <el-pagination
          background
          layout="prev, pager, next, total"
          :page-size="page.pageSize"
          :current-page="page.currentIndex"
          :total="page.totalPage"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getData } from 'api/timing-send'
import { formatterSendDate, formatterTime } from 'common/js'

const todayDate = new Date()
const week = new Date(todayDate.setTime(todayDate.getTime() - 7 * 24 * 3600 * 1000))

export default {
  data () {
    return {
      form: {
        smsKey: '',
        batchNo: '',
        beginTime: week,
        endTime: '',
        isSend: '',
        overdue: ''
      },
      tableData: [],
      loading: false,
      page: {
        currentIndex: 1,
        pageSize: 10,
        totalPage: 1
      },
      pickerOptions1: {
        shortcuts: [
          {
            text: '今天',
            onClick (picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      }
    }
  },
  created () {
    this._getTableData()
  },
  methods: {
    select () {
      this._getTableData(1)
    },
    _getTableData (index) {
      this.loading = true
      const currentPage = index || this.page.currentIndex
      const beginTime = this.form.beginTime ? formatterSendDate(this.form.beginTime) : ''
      const endTime = this.form.endTime ? formatterSendDate(this.form.endTime) : ''
      const params = {
        bNo: this.form.batchNo,
        sFlag: this.form.isSend,
        fFlag: this.form.overdue,
        smsCnl: this.form.smsKey,
        beginTime,
        endTime,
        currentPage,
        pageSize: this.page.pageSize
      }
      getData(params).then((res) => {
        if (res.code === '200') {
          let data = res.data
          this.loading = false
          this.tableData = data.datas
          this.page.totalPage = Number(data.totalCount)
          this.page.currentIndex = Number(data.pageNo)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleCurrentChange (index) {
      this._getTableData(index)
    },
    formatterSFlag (flag) {
      return flag.sFlag ? flag.sFlag === '0' ? '未发送' : '已发送' : ''
    },
    formatterFFlag (flag) {
      return flag.fFlag ? flag.fFlag === '0' ? '已过期' : '未过期' : ''
    },
    formatterTTime (time) {
      return time.tTime ? formatterTime(time.tTime) : ''
    },
    formatterFTime (time) {
      return time.fTime ? Number(time.fTime) / 60 + '分钟' : ''
    },
    formatterT (time) {
      return time.t ? formatterTime(time.t) : ''
    },
    formatterJump (time) {
      return time.jump === '0' ? '否' : '是'
    },
    formatterTrack (time) {
      return time.track === '0' ? '否' : '是'
    },
    formatterStatus (row) {
      return row === '0' ? '异常' : '正常'
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.demo-panel-title
  font normal 22px/40px "Helvetica Neue", Helvetica, Arial, sans-serif
  color #34495e
.select-wrapper
  width 100%
  height 40px
  .el-col
    margin-right 15px
    .el-input
      width 100%
.table
  margin-top 15px
  .el-button
    color #6DFF40
    font-size 16px
  .el-button.diff
    color #FF001A
.pagination
  width 100%
  height 40px
  margin 20px 0
</style>
