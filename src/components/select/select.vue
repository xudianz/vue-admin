<template>
  <div id="select">
    <el-card>
      <div slot="header" class="clearfix">
        <span class="demo-panel-title">批次查询</span>
      </div>
      <div class="select-wrapper">
        <el-row :gutter="15">
          <el-col :span="3">
            <el-input clearable v-model="form.smsKey" placeholder="账号查询"></el-input>
          </el-col>
          <el-col :span="3">
            <el-input clearable v-model="form.batchNo" placeholder="批次号查询"></el-input>
          </el-col>
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
          <el-button type="primary" class="search-button" @click="handleSearch">查&nbsp;&nbsp;&nbsp;&nbsp;询</el-button>
          <a :href="sendExportParams">
            <el-button type="primary" class="search-button-link" icon="el-icon-download">导&nbsp;&nbsp;&nbsp;出</el-button>
          </a>
        </el-row>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" v-loading="form.loading" style="width:100%">
          <el-table-column prop="smsKey" label="账号"></el-table-column>
          <el-table-column prop="smsName" label="渠道名称"></el-table-column>
          <el-table-column prop="sign" label="签名" width="120">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="light" :content="scope.row.txt" placement="right-end">
                <el-button class="table-btn" type="text" size="medium">{{scope.row.sign}}</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="批次号"></el-table-column>
          <el-table-column prop="total" label="提交条数" ></el-table-column>
          <el-table-column prop="sendNum" label="发送条数(滤重)" width="100"></el-table-column>
          <el-table-column prop="sendFail" label="提交失败">
            <template slot-scope="scope">
              <el-button @click="handleSendfailClick(scope.row.id)" class="table-btn" :class="{'active': scope.row.sendFF === '1'}" type="text" size="medium">{{scope.row.sendFail}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="sendErr" label="提交错误">
              <template slot-scope="scope">
              <el-button @click="handleSenderrClick(scope.row.id)" class="table-btn" :class="{'active': scope.row.sendEF === '1'}" type="text" size="medium">{{scope.row.sendErr}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="touchNum" label="触达条数"></el-table-column>
          <!-- <el-table-column prop="blackListCount" label="黑名单条数" width="90"></el-table-column>
          <el-table-column prop="responseCount" label="回复条数" width="60"></el-table-column>
          <el-table-column prop="clickCount" label="点击次数" width="60"></el-table-column> -->
          <el-table-column prop="unknow" label="未知条数"></el-table-column>
          <el-table-column prop="sts" label="审核" width="62">
            <template slot-scope="scope">
              <el-popover v-show="scope.row.sts !== undefined" placement="top" width="160" trigger="click" v-model="scope.row.visible2">
                <p style="margin-bottom: 20px">确定要修改审核状态吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="scope.row.visible2 = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="handleEditState(scope.row)">确定</el-button>
                </div>
                <el-button class="button-state" slot="reference" type="text">{{scope.row.sts === '1' ? '正常' : scope.row.sts === '2' ? '驳回' : ''}}</el-button>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="t" label="发送时间" width="120" :formatter="formatterTime"></el-table-column>
        </el-table>
      </div>
      <el-dialog title="提示" :lock-scroll="false" :visible.sync="dialogTableVisible">
        <el-table :data="gridData">
          <el-table-column property="smsKey" label="账号" width="150"></el-table-column>
          <el-table-column property="smsName" label="渠道"></el-table-column>
          <el-table-column property="sign" label="签名"></el-table-column>
          <el-table-column property="id" label="批次号" width="100"></el-table-column>
          <el-table-column property="t" label="发送时间" width="120" :formatter="formatterTime"></el-table-column>
        </el-table>
        <div class="refresh-wrapper">
          <div class="item">
            <span>失败重发</span>
            <i class="el-icon-refresh" :class="{'active': faildFlag === 1}" @click="faildRefresh" size="medium"></i>
          </div>
          <div class="item">
            <span>错误重发</span>
            <i class="el-icon-refresh" :class="{'active': errorFlag === 1}" @click="errorRefresh" size="medium"></i>
          </div>
        </div>
      </el-dialog>
      <div class="page-wrapper">
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
import { getWeekDate } from 'common/js'
import axios from 'axios'

const dodayDate = new Date()
const week = new Date(dodayDate.setTime(dodayDate.getTime() - 7 * 24 * 3600 * 1000))

export default {
  data () {
    return {
      form: {
        select: '',
        smsKey: '',
        batchNo: '',
        beginTime: week,
        endTime: '',
        inputSearchText: '',
        loading: false
      },
      tableData: [],
      page: {
        currentIndex: 1,
        pageSize: 10,
        totalPage: 0
      },
      dialogTableVisible: false,
      gridData: [],
      faildFlag: 1,
      errorFlag: 1,
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
    this._getPageData()
  },
  computed: {
    sendExportParams () {
      let beginTime = this.form.beginTime ? this._formatterDate(this.form.beginTime) : ''
      let endTime = this.form.endTime ? this._formatterDate(this.form.endTime) : ''
      let smsKey = this.form.smsKey
      let batchNo = this.form.batchNo
      return `/getview/web/m/sms/exportBatchInfos?beginTime=${beginTime}&endTime=${endTime}&smsKey=${smsKey}&batchNo=${batchNo}`
    }
  },
  methods: {
    _getPageData (index) {
      this.form.loading = true
      let currentPage = index || this.page.currentIndex
      let beginTime = this.form.beginTime ? this._formatterDate(this.form.beginTime) : getWeekDate()
      let endTime = this.form.endTime ? this._formatterDate(this.form.endTime) : ''
      let params = {
        currentPage,
        pageSize: this.page.pageSize,
        smsKey: this.form.smsKey,
        batchNo: this.form.batchNo,
        beginTime,
        endTime
      }
      axios({
        url: '/getview/web/m/sms/batchInfoPages',
        method: 'post',
        params
      }).then((response) => {
        if (response.data.code === '200') {
          let data = response.data.data
          // this.tableData = data.datas
          // 添加visible2标识
          let arr = data.datas.map((item, index) => {
            return Object.assign({}, item, {
              visible2: false
            })
          })
          this.tableData = arr
          this.page.totalPage = Number(data.totalCount)
          // console.log(response.data)
          this.page.currentIndex = Number(data.pageNo)
          this.form.loading = false
        } else {
          this.$message.error(response.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.form.loading = false
      })
    },
    handleSearch () {
      // 点击查询 默认查询第一页
      this._getPageData(1)
    },
    _formatterDate (time) {
      let result = time.getFullYear() + '' + (this._addZero(time.getMonth() + 1)) + '' + this._addZero(time.getDate()) + '' + this._addZero(time.getHours()) + '' + this._addZero(time.getMinutes()) + '' + this._addZero(time.getSeconds())
      return result
    },
    formatterTime (row) {
      let time = row.t
      if (time) {
        return time.substr(0, 4) + '-' + time.substr(4, 2) + '-' + time.substr(6, 2) + '\r\n' + time.substr(8, 2) + ':' + time.substr(10, 2) + ':' + time.substr(12, 2)
      } else {
        return ''
      }
    },
    _addZero (str) {
      return str < 10 ? '0' + str : str
    },
    handleCurrentChange (currentIndex) {
      // console.log(currentIndex)
      this._getPageData(currentIndex)
    },
    _getData (id) {
      this.dialogTableVisible = true
      this.gridData = []
      axios({
        url: '/getview/web/m/sms/batchInfo',
        method: 'post',
        params: {
          batchNo: id
        }
      }).then(res => {
        if (res.data.code === '200') {
          let result = res.data.data
          // console.log(result)
          this.gridData.push(result)
          this.faildFlag = Number(result.sendFF)
          this.errorFlag = Number(result.sendEF)
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(err => console.log(err))
    },
    handleSendfailClick (id) {
      let row = this.tableData.filter(item => item.id === id)
      if ((row[0].sendFail === '0' && row[0].sendErr === '0') || (row[0].sendFail === undefined && row[0].sendErr === undefined)) {
        return false
      }
      this._getData(id)
    },
    handleSenderrClick (id) {
      let row = this.tableData.filter(item => item.id === id)
      if ((row[0].sendFail === '0' && row[0].sendErr === '0') || (row[0].sendFail === undefined && row[0].sendErr === undefined)) {
        return false
      }
      this._getData(id)
    },
    _sendData (id, params) {
      axios({
        url: '/getview/web/m/sms/reSend',
        method: 'post',
        params
      }).then(res => {
        console.log(res)
        if (res.data.code === '200') {
          this.dialogTableVisible = false
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(err => console.log(err))
    },
    faildRefresh () {
      console.log('faild refresh')
      let state = Number(this.gridData[0].sendFF)
      let id = this.gridData[0].id
      let params = {
        batchNo: id,
        sendFail: 'reSend'
      }
      if (state) {
        console.log('go on')
        this._sendData(id, params)
        this.faildFlag = 0
      } else {
        console.log('faild只能点击一次')
        return false
      }
    },
    errorRefresh () {
      console.log('error refresh')
      let state = Number(this.gridData[0].sendEF)
      let id = this.gridData[0].id
      let params = {
        batchNo: id,
        sendErr: 'reSend'
      }
      if (state) {
        console.log('go on')
        this._sendData(id, params)
        this.errorFlag = 0
      } else {
        console.log('error只能点击一次')
        return false
      }
    },
    handleEditState (item) {
      let batchNo = item.id
      let status = item.sts === '1' ? '2' : '1'
      axios({
        url: '/getview/web/m/sms/updateBatchInfo',
        method: 'post',
        params: {
          batchNo,
          status
        }
      }).then((res) => {
        if (res.data.code === '200') {
          this.$set(item, 'sts', res.data.data)
          this.$set(item, 'visible2', false)
          this.$message({
            showClose: true,
            duration: 2000,
            message: '修改成功',
            type: 'success'
          })
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(err => console.log(err))
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.demo-panel-title
  font normal 22px/40px "Helvetica Neue", Helvetica, Arial, sans-serif
  color #34495e
.el-col.el-col-2 a
  display inline-block
  width 100%
  height 100%
.select-wrapper
  width 100%
  box-sizing border-box
  .search-button
    width 100px
    height 40px
    font-size 16px
    margin 0 7.5px
  .search-button-link
    width 100px
    height 40px
    font-size 16px
    padding 0 5px
.select-wrapper
  margin-bottom 20px
  // .el-row
  //   display flex
  //   justify-content space-around
.page-wrapper
  padding 20px 0
.refresh-wrapper
  padding 50px 0 10px
  display flex
  justify-content space-around
  .item
    display flex
    align-items center
  .item i
    font-size 26px
    margin 0 10px
    color #606266
    cursor pointer
    &.active
      color #409EFF
  .item span
    font-size 18px
.el-date-editor--datetime
  width 100%
.el-table .cell
  .el-button.button-state
    width 100%
    height 100%
  .table-btn.active
    color rgb(64, 255, 67)
</style>
