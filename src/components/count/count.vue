<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <span class="demo-panel-title">统计列表</span>
      </div>
      <el-form :model="form" :inline="true" label-position="left">
        <el-row style="margin-left: 22px">
          <el-col>
            <el-form-item label="渠道名" label-width="60px">
              <el-col :span="24">
                <el-select v-model="form.channelName" clearable placeholder="请选择活动区域">
                  <el-option v-for="(item, index) in channel" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="运营商" label-width="60px">
              <el-col :span="24">
                <el-select v-model="form.operator" clearable placeholder="请选择活动区域">
                  <el-option label="移动" value="yd"></el-option>
                  <el-option label="联通" value="lt"></el-option>
                  <el-option label="电信" value="dx"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="号码归属地" label-width="90px">
              <el-col :span="24">
                <el-select v-model="form.region" clearable placeholder="请选择活动区域">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="是否开启日期">
              <el-col :span="22">
                <el-select clearable v-model="form.dayFlag" placeholder="请选择活动区域">
                  <el-option @click.native="showDate" label="是" value="1"></el-option>
                  <el-option @click.native="hideDate" label="否" value="0"></el-option>
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="时间区间 (必填)">
              <el-col :span="11">
                <el-date-picker type="datetime" placeholder="选择开始日期时间" v-model="form.beginTime" style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col class="line line-center" style="text-align: center" :span="2">--</el-col>
              <el-col :span="11">
                <el-date-picker type="datetime" placeholder="选择结束日期时间" v-model="form.endTime" style="width: 100%;"></el-date-picker>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-col :span="24">
                <el-button type="primary" @click="submit">查&nbsp;&nbsp;询</el-button>
              </el-col>
            </el-form-item>
            <el-form-item>
              <a :href="exportExcel">
                <el-button type="primary">导&nbsp;&nbsp;出</el-button>
              </a>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="tableData" border show-summary v-loading="loading" style="width: 100%">
        <el-table-column v-if="flag" prop="t" label="日期" :formatter="formatterDate"></el-table-column>
        <el-table-column prop="smsCnl" label="账号名称" width="210"></el-table-column>
        <el-table-column prop="type" label="产品类型"></el-table-column>
        <el-table-column prop="touchNum" label="成功数量" :formatter="formatterTouchNum"></el-table-column>
        <el-table-column prop="sendFail" label="失败数量" :formatter="formatterSendFail"></el-table-column>
        <el-table-column prop="unknow" label="未知数量" :formatter="formatterUnKnow"></el-table-column>
        <el-table-column prop="cancel" label="取消数量" :formatter="formatterCancel"></el-table-column>
        <el-table-column prop="count" label="发送次数" :formatter="formatterCount"></el-table-column>
        <el-table-column prop="sendNum" label="发送数量" :formatter="formatterSendNum"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getChannel, getTableData } from 'api/count'
import { formatterSendDate } from 'common/js/index'
export default {
  data () {
    return {
      form: {
        channelName: '',
        beginTime: '',
        endTime: '',
        operator: '',
        area: '',
        dayFlag: ''
      },
      channel: [],
      tableData: [],
      loading: false,
      flag: true
    }
  },
  computed: {
    exportExcel () {
      let beginTime = this.form.beginTime ? formatterSendDate(this.form.beginTime) : ''
      let endTime = this.form.endTime ? formatterSendDate(this.form.endTime) : ''
      return `/getview/web/m/sms/exportReport?smsCnl=${this.form.channelName}&dayFlag=${this.form.dayFlag}&beginTime=${beginTime}&endTime=${endTime}&isp=${this.form.operator}&area=${this.form.area}`
    }
  },
  created () {
    this._getChannel()
  },
  methods: {
    showDate () {
      this.flag = true
    },
    hideDate () {
      this.flag = false
    },
    formatterDate (row) {
      let t = row.t
      if (t) {
        return t.length > 8 ? t.slice(0, 8) : t
      } else {
        return ''
      }
    },
    _getChannel () {
      getChannel().then((res) => {
        if (res.data.code === '200') {
          let data = res.data.data
          this.channel = data
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    _getTableData () {
      let beginTime = this.form.beginTime ? formatterSendDate(this.form.beginTime) : ''
      let endTime = this.form.endTime ? formatterSendDate(this.form.endTime) : ''
      let params = {
        smsCnl: this.form.channelName,
        beginTime,
        endTime,
        isp: this.form.operator,
        area: this.form.area,
        dayFlag: this.form.dayFlag
      }
      this.loading = true
      getTableData(params).then(res => {
        this.loading = false
        if (res.data.code === '200') {
          let ret = []
          res.data.data.forEach((item) => {
            if (item.value) {
              ret.push(item.value)
            }
          })
          this.tableData = ret
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    formatterTouchNum (row) {
      let result = row.touchNum
      return result ? Number(result) : ''
    },
    formatterSendFail (row) {
      let result = row.sendFail
      return result ? Number(result) : ''
    },
    formatterUnKnow (row) {
      let result = row.unknow
      return result ? Number(result) : ''
    },
    formatterCancel (row) {
      let result = row.cancel
      return result ? Number(result) : ''
    },
    formatterCount (row) {
      let result = row.count
      return result ? Number(result) : ''
    },
    formatterSendNum (row) {
      let result = row.sendNum
      return result ? Number(result) : ''
    },
    submit () {
      if (!this.form.beginTime) {
        this.$message({
          message: '请选择开始时间',
          type: 'warning',
          duration: 1500,
          showClose: true
        })
        return false
      }
      if (!this.form.endTime) {
        this.$message({
          message: '请选择结束时间',
          type: 'warning',
          duration: 1500,
          showClose: true
        })
        return false
      }
      this._getTableData()
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.demo-panel-title
  font normal 22px/40px "Helvetica Neue", Helvetica, Arial, sans-serif
  color #34495e
.el-form
  margin-top 20px
</style>
