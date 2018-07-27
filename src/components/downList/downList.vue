<template>
  <div>
    <!-- <div>下发列表</div> -->
    <el-card>
      <div slot="header" class="clearfix">
        <span class="demo-panel-title">下发列表</span>
      </div>
      <div class="select-wrapper">
        <el-row :gutter="15">
          <el-col :span="3">
            <el-input v-model.trim="form.userCode" clearable placeholder="账号查询"></el-input>
          </el-col>
            <el-col :span="3">
            <el-select v-model="form.sendStateYdSelect" clearable placeholder="移送发送状态">
              <el-option label="未发送" value="0"></el-option>
              <el-option label="人工发送" value="1"></el-option>
              <el-option label="自动发送" value="2"></el-option>
              <el-option label="驳回" value="3"></el-option>
              <el-option label="异常" value="4"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="form.sendStateLtSelect" clearable placeholder="联通发送状态">
              <el-option label="未发送" value="0"></el-option>
              <el-option label="人工发送" value="1"></el-option>
              <el-option label="自动发送" value="2"></el-option>
              <el-option label="驳回" value="3"></el-option>
              <el-option label="异常" value="4"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="form.sendStateDxSelect" clearable placeholder="电信发送状态">
              <el-option label="未发送" value="0"></el-option>
              <el-option label="人工发送" value="1"></el-option>
              <el-option label="自动发送" value="2"></el-option>
              <el-option label="驳回" value="3"></el-option>
              <el-option label="异常" value="4"></el-option>
            </el-select>
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
        </el-row>
      </div>
      <div class="select-wrapper-second">
        <el-row class="el-row-second" :gutter="15">
          <el-col :span="3">
            <el-input v-model.trim="form.signSelect" clearable placeholder="签名查询"></el-input>
          </el-col>
          <el-col :span="14" style="margin-left: 5%">
            <el-row :gutter="20">
              <el-col :span="4">
                <el-button type="primary" class="search-button" @click="handleSearch">查&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;询</el-button>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" class="search-button" @click="conditionSend">条件发送</el-button>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" class="search-button" @click="handleClickOnBatchModify">批量修改</el-button>
              </el-col>
              <el-col :span="4">
                <a :href="sendExportParams">
                  <el-button type="primary" class="search-button-link" icon="el-icon-download">导&nbsp;&nbsp;&nbsp;出</el-button>
                </a>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <div class="send-btn-wrapper">
        <div class="send-btn">
          <el-button type="primary" size="mini" @click="handleMergeSend">合并发送</el-button>
        </div>
      </div>
      <el-table :data="tableData" v-loading="form.loading" @selection-change="handleSelectionChange" ref="table" tooltip-effect="dark" style="width: 100%">
        <el-table-column fixed prop="id" label="批次号" width="100"></el-table-column>
        <el-table-column fixed prop="uc" label="账号" width="180"></el-table-column>
        <el-table-column fixed prop="sign" label="签名" width="200" placement="right">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" :content="scope.row.smsTxt" placement="top">
              <el-button size="medium" type="text" @click="handleModifySign(scope.row)">{{scope.row.sign}}</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="ydc" label="移动数量" width="110"></el-table-column>
        <el-table-column prop="ltc" label="联通数量" width="110"></el-table-column>
        <el-table-column prop="dxc" label="电信数量" width="110"></el-table-column>
        <el-table-column prop="ydBNo" label="移动批次号" width="120"></el-table-column>
        <el-table-column prop="ltBNo" label="联通批次号" width="120"></el-table-column>
        <el-table-column prop="dxBNo" label="电信批次号" width="120"></el-table-column>
        <el-table-column prop="ydsts" label="移动发送状态" width="160">
          <template slot-scope="scope">
            <el-button type="text" @click="showSendState(scope.row)">{{scope.row.ydsts}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="ltsts" label="联通发送状态" width="160">
          <template slot-scope="scope">
            <el-button type="text" @click="showSendState(scope.row)">{{scope.row.ltsts}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="dxsts" label="电信发送状态" width="160">
          <template slot-scope="scope">
            <el-button type="text" @click="showSendState(scope.row)">{{scope.row.dxsts}}</el-button>
          </template>
        </el-table-column>
        <el-table-column fixed="right" prop="t" label="发送时间" :formatter="formatterTime" width="120"></el-table-column>
        <el-table-column fixed="right" :selectable="selectable" type="selection" width="85"></el-table-column>
      </el-table>
      <el-dialog title="修改发送状态" :lock-scroll="false" :visible.sync="dialogSendState">
        <el-form :model="sendState">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="移动发送状态">
                <el-select v-model="sendState.ydsts">
                  <el-option label="未发送" value="未发送"></el-option>
                  <el-option label="人工发送" value="人工发送"></el-option>
                  <el-option label="自动发送" value="自动发送"></el-option>
                  <el-option label="驳回" value="驳回"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联通发送状态">
                <el-select v-model="sendState.ltsts">
                  <el-option label="未发送" value="未发送"></el-option>
                  <el-option label="人工发送" value="人工发送"></el-option>
                  <el-option label="自动发送" value="自动发送"></el-option>
                  <el-option label="驳回" value="驳回"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="电信发送状态">
                <el-select v-model="sendState.dxsts">
                  <el-option label="未发送" value="未发送"></el-option>
                  <el-option label="人工发送" value="人工发送"></el-option>
                  <el-option label="自动发送" value="自动发送"></el-option>
                  <el-option label="驳回" value="驳回"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogSendState = false">取 消</el-button>
          <el-button type="primary" @click="handleSendStateSubmit">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="合并发送" :lock-scroll="false" :visible.sync="dialogToggleState">
        <el-form :model="form">
          <el-row :gutter="20">
            <el-row :gutter="10">
              <el-col :span="11">
                <el-form-item label="移动" label-width="80px">
                  <el-select v-model="form.yd" clearable placeholder="请选择活动区域">
                    <el-option v-for="(item, index) in ydOption" :key="index" :label="item.id" :value="item.id" @click.native="showYdSign(item)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5" v-show="form.yd">
                <el-input v-model="form.ydSign" :disabled="true"></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="11">
                <el-form-item label="电信" label-width="80px">
                  <el-select v-model="form.dx" clearable placeholder="请选择活动区域">
                    <el-option v-for="(item, index) in dxOption" :key="index" :label="item.id" :value="item.id" @click.native="showDxSign(item)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5" v-show="form.dx">
                <el-input v-model="form.dxSign" :disabled="true"></el-input>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="11">
                <el-form-item label="联通" label-width="80px">
                  <el-select v-model="form.lt" clearable placeholder="请选择活动区域">
                    <el-option v-for="(item, index) in ltOption" :key="index" :label="item.id" :value="item.id" @click.native="showLtSign(item)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5" v-show="form.lt">
                <el-input v-model="form.ltSign" :disabled="true"></el-input>
              </el-col>
            </el-row>
            <el-row class="el-total-show">
              <span class="total-show">共选择了 {{form.taskIds.length}}&nbsp;条记录</span>
            </el-row>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" :class="{'is-disabled': mergeSendBtnState}" @click="handleSubmit">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="条件发送" :lock-scroll="false" :visible.sync="conditionSendDialog">
        <el-form :model="form">
          <el-row :gutter="20">
            <el-row :gutter="10">
              <el-col :span="10">
                <el-form-item label="移动" label-width="80px">
                  <el-select v-model="form.yd" clearable placeholder="请选择活动区域">
                    <el-option v-for="(item, index) in ydOption" :key="index" :label="item.id" :value="item.id" @click.native="showYdSign(item)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5" v-show="form.yd">
                <el-input v-model="form.ydSign" :disabled="true"></el-input>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" :loading="btnLoadingState">{{form.ydButtonValue}}</el-button>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="10">
                <el-form-item label="电信" label-width="80px">
                  <el-select v-model="form.dx" clearable placeholder="请选择活动区域">
                    <el-option v-for="(item, index) in dxOption" :key="index" :label="item.id" :value="item.id" @click.native="showDxSign(item)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5" v-show="form.dx">
                <el-input v-model="form.dxSign" :disabled="true"></el-input>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" :loading="btnLoadingState">{{form.dxButtonValue}}</el-button>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="10">
                <el-form-item label="联通" label-width="80px">
                  <el-select v-model="form.lt" clearable placeholder="请选择活动区域">
                    <el-option v-for="(item, index) in ltOption" :key="index" :label="item.id" :value="item.id" @click.native="showLtSign(item)"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5" v-show="form.lt">
                <el-input v-model="form.ltSign" :disabled="true"></el-input>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" :loading="btnLoadingState">{{form.ltButtonValue}}</el-button>
              </el-col>
            </el-row>
            <el-row class="el-total-show">
              <span class="total-show">共选择了 {{calculateTotal}}&nbsp;条记录</span>
            </el-row>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="conditionCancel">取 消</el-button>
          <el-button type="primary" :class="{'is-disabled': disabledBtnState}" @click="conditionSendSubmit">确 定</el-button>
        </div>
      </el-dialog>
      <div class="batch-modify-wrapper">
        <batch-modify @sure="handleBatchModify" ref="batchModify"></batch-modify>
      </div>
      <div class="page-wrapper" v-if="tableData.length">
        <el-pagination
          background
          layout="prev, pager, next, sizes, total"
          :page-size="page.pageSize"
          :page-sizes="pageSizeArr"
          :current-page="page.currentIndex"
          :total="page.totalPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import BatchModify from 'components/downList/batchModify'
import { formatterTime, formatterSendState, transformSendState, getWeekDate } from 'common/js'
import axios from 'axios'
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'

const dodayDate = new Date()
const week = new Date(dodayDate.setTime(dodayDate.getTime() - 7 * 24 * 3600 * 1000))

export default {
  data () {
    return {
      tableData: [],
      multipleSelection: [],
      dialogToggleState: false, // 合并发送
      conditionSendDialog: false, // 条件发送
      btnLoadingState: true,
      batchNoList: [], // 向后台传递的数组
      disabledBtnState: false,
      mergeSendBtnState: false,
      dialogSendState: false,
      sendState: {
        ydsts: '',
        ltsts: '',
        dxsts: ''
      },
      sendId: '',
      form: {
        userCode: '',
        name: '',
        yd: '',
        dx: '',
        lt: '',
        ydSign: '',
        ltSign: '',
        dxSign: '',
        signSelect: '',
        sendStateYdSelect: '',
        sendStateDxSelect: '',
        sendStateLtSelect: '',
        ydButtonValue: '加载中',
        ltButtonValue: '加载中',
        dxButtonValue: '加载中',
        taskIds: [],
        beginTime: week,
        endTime: '',
        loading: false
      },
      page: {
        currentIndex: 1,
        pageSize: 10,
        totalPage: 0
      },
      ydOption: [],
      ltOption: [],
      dxOption: [],
      pageSizeArr: [10, 50, 100, 150, 200],
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
  computed: {
    sendExportParams () {
      let beginTime = this.form.beginTime ? this._formatterDate(this.form.beginTime) : ''
      let endTime = this.form.endTime ? this._formatterDate(this.form.endTime) : ''
      let userCode = this.form.userCode
      return `/getview/web/m/orgsms/exportUserBatch?beginTime=${beginTime}&endTime=${endTime}&userCode=${userCode}`
    },
    calculateTotal () {
      if (this.form.ydButtonValue !== '加载中' && this.form.ltButtonValue !== '加载中' && this.form.dxButtonValue !== '加载中') {
        return Number(this.form.ydButtonValue) + Number(this.form.dxButtonValue) + Number(this.form.ltButtonValue)
      }
      return 0
    }
  },
  created () {
    this._getTableData()
  },
  methods: {
    _getTableData (index) {
      this.form.loading = true
      let currentPage = index || this.page.currentIndex
      let beginTime = this.form.beginTime ? this._formatterDate(this.form.beginTime) : getWeekDate()
      let endTime = this.form.endTime ? this._formatterDate(this.form.endTime) : ''
      let sign = this.form.signSelect
      let ydsts = this.form.sendStateYdSelect
      let ltsts = this.form.sendStateLtSelect
      let dxsts = this.form.sendStateDxSelect
      let params = {
        currentPage,
        pageSize: this.page.pageSize,
        userCode: this.form.userCode,
        beginTime,
        endTime,
        sign,
        ydsts,
        ltsts,
        dxsts
      }
      axios({
        url: '/getview/web/m/orgsms/userBatchPages',
        method: 'post',
        params
      }).then(res => {
        if (res.data.code === '200' || res.data.code === 200) {
          let data = res.data.data
          let len = data.datas.length
          for (let i = 0; i < len; i++) {
            if (data.datas[i].ydsts === '0') {
              data.datas[i].ydsts = '未发送'
            } else if (data.datas[i].ydsts === '1') {
              data.datas[i].ydsts = '人工发送'
            } else if (data.datas[i].ydsts === '2') {
              data.datas[i].ydsts = '自动发送'
            } else if (data.datas[i].ydsts === '3') {
              data.datas[i].ydsts = '驳回'
            }

            if (data.datas[i].ltsts === '0') {
              data.datas[i].ltsts = '未发送'
            } else if (data.datas[i].ltsts === '1') {
              data.datas[i].ltsts = '人工发送'
            } else if (data.datas[i].ltsts === '2') {
              data.datas[i].ltsts = '自动发送'
            } else if (data.datas[i].ltsts === '3') {
              data.datas[i].ltsts = '驳回'
            }

            if (data.datas[i].dxsts === '0') {
              data.datas[i].dxsts = '未发送'
            } else if (data.datas[i].dxsts === '1') {
              data.datas[i].dxsts = '人工发送'
            } else if (data.datas[i].dxsts === '2') {
              data.datas[i].dxsts = '自动发送'
            } else if (data.datas[i].dxsts === '3') {
              data.datas[i].dxsts = '驳回'
            }
          }
          this.tableData = data.datas
          this.page.totalPage = Number(data.totalCount)
          // console.log(response.data)
          this.page.currentIndex = Number(data.pageNo)
          this.form.loading = false
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err)
        this.form.loading = false
      })
    },
    handleSearch () {
      this._getTableData(1)
    },
    showSendState (row) {
      this.dialogSendState = true
      this.sendState.ydsts = row.ydsts
      this.sendState.ltsts = row.ltsts
      this.sendState.dxsts = row.dxsts
      this.sendId = row.id // 保存发送时传递的id
    },
    _formatterDate (time) {
      let result = time.getFullYear() + '' + (this._addZero(time.getMonth() + 1)) + '' + this._addZero(time.getDate()) + '' + this._addZero(time.getHours()) + '' + this._addZero(time.getMinutes()) + '' + this._addZero(time.getSeconds())
      return result
    },
    _addZero (str) {
      return str < 10 ? '0' + str : str
    },
    formatterTime ({ t }) {
      if (t) {
        return formatterTime(t)
      } else {
        return ''
      }
    },
    formatterYdSendState (row) {
      if (row.ydsts) {
        return formatterSendState(row.ydsts)
      } else {
        return ''
      }
    },
    formatterDxSendState (row) {
      if (row.dxsts) {
        return formatterSendState(row.dxsts)
      } else {
        return ''
      }
    },
    formatterLtSendState (row) {
      if (row.ltsts) {
        return formatterSendState(row.ltsts)
      } else {
        return ''
      }
    },
    handleModifySign (row) {
      this.$prompt('请输入签名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: row.sign,
        lockScroll: false
      }).then(({ value }) => {
        let batchId = row.id
        let sign = value
        let params = {
          batchId,
          sign
        }
        // this.$message({
        //   type: 'success',
        //   duration: 1000,
        //   message: '你的签名是: ' + value
        // })
        axios({
          url: '/getview/web/m/orgsms/updateUserBatch',
          method: 'post',
          params
        }).then(res => {
          if (res.data.code === '200') {
            this._getTableData(this.page.currentIndex)
            setTimeout(() => {
              this.$message({
                showClose: true,
                duration: 2000,
                message: '恭喜您,修改成功!',
                type: 'success'
              })
            }, 1000)
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          duration: 1000,
          message: '取消输入'
        })
      })
    },
    handleMergeSend () {
      if (!this.multipleSelection.length) {
        this.$message({
          type: 'warning',
          duration: 1800,
          message: '请勾选列表，然后合并发送'
        })
        return false
      } else {
        this.form.taskIds = [] // 每次点击合并 清空数组【保存发送id】
        this.multipleSelection.forEach(element => {
          this.form.taskIds.push(element.id)
        })
      }
      this.mergeSendBtnState = false // 解除按钮禁用状态
      this.dialogToggleState = true
      axios.post('/getview/web/m/sms/allChannels').then((res) => {
        if (res.data.code === '200' || res.data.conde === 200) {
          let result = res.data.data
          this.ydOption = result
          this.ltOption = result
          this.dxOption = result
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    selectable (row, index) {
      // console.log(row.ydBNo)
      // if (row.ydBNo && row.ltBNo && row.dxBNo) {
      //   return false
      // }
      return true
    },
    handleCancel () {
      this.dialogToggleState = false
      this.form.yd = this.form.dx = this.form.lt = ''
    },
    handleSubmit () {
      if (this.mergeSendBtnState) {
        return false
      }
      let data = {
        taskIds: this.form.taskIds,
        ydSmsCnl: this.form.yd,
        ltSmsCnl: this.form.lt,
        dxSmsCnl: this.form.dx
      }
      axios({
        url: '/getview/web/m/orgsms/send',
        method: 'post',
        params: data
      }).then(res => {
        if (res.data.code === '200' || res.data.code === 200) {
          this.dialogToggleState = false
          this.$message({
            showClose: true,
            duration: 2000,
            message: res.data.msg,
            type: 'success'
          })
          setTimeout(() => {
            this.form.yd = this.form.dx = this.form.lt = ''
          }, 500)
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(err => console.log(err))
      this.mergeSendBtnState = true // 按钮禁用状态
    },
    handleSendStateSubmit () {
      let ydsts = transformSendState(this.sendState.ydsts)
      let ltsts = transformSendState(this.sendState.ltsts)
      let dxsts = transformSendState(this.sendState.dxsts)
      let params = {
        batchId: this.sendId,
        ydsts,
        ltsts,
        dxsts
      }
      axios({
        url: '/getview/web/m/orgsms/updateUserBatch',
        method: 'post',
        params
      }).then(res => {
        if (res.data.code === '200' || res.data.code === 200) {
          this.dialogSendState = false
          this._getTableData(this.page.currentIndex)
          setTimeout(() => {
            this.$message({
              showClose: true,
              duration: 2000,
              message: '恭喜您,修改成功!',
              type: 'success'
            })
          }, 1000)
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleCurrentChange (currentIndex) {
      // console.log(currentIndex)
      this._getTableData(currentIndex)
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this._getTableData()
    },
    showYdSign (item) {
      this.form.ydSign = item.name
    },
    showDxSign (item) {
      this.form.dxSign = item.name
    },
    showLtSign (item) {
      this.form.ltSign = item.name
    },
    conditionSend () {
      if (this.form.userCode === '') {
        this.$message({
          message: '请输入查询账号！',
          duration: 1500,
          showClose: true,
          type: 'warning'
        })
        return false
      }
      if (this.form.sendStateYdSelect === '') {
        this.$message({
          message: '请选择移动发送状态！',
          duration: 1500,
          showClose: true,
          type: 'warning'
        })
        return false
      }
      if (this.form.sendStateLtSelect === '') {
        this.$message({
          message: '请选择联通发送状态！',
          duration: 1500,
          showClose: true,
          type: 'warning'
        })
        return false
      }
      if (this.form.sendStateDxSelect === '') {
        this.$message({
          message: '请选择电信发送状态！',
          duration: 1500,
          showClose: true,
          type: 'warning'
        })
        return false
      }
      if (this.form.beginTime === '') {
        this.$message({
          message: '请选择开始时间！',
          duration: 1500,
          showClose: true,
          type: 'warning'
        })
        return false
      }
      if (this.form.endTime === '') {
        this.$message({
          message: '请选择结束时间！',
          duration: 1500,
          showClose: true,
          type: 'warning'
        })
        return false
      }
      if (this.form.signSelect === '') {
        this.$message({
          message: '请输入查询签名！',
          duration: 1500,
          showClose: true,
          type: 'warning'
        })
        return false
      }
      this.conditionSendDialog = true
      this.btnLoadingState = true // 按钮loading
      this.disabledBtnState = false // 解除按钮禁用状态
      axios.post('/getview/web/m/sms/allChannels').then((res) => {
        if (res.data.code === '200' || res.data.conde === 200) {
          let result = res.data.data
          this.ydOption = result
          this.ltOption = result
          this.dxOption = result
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(err => { console.log(err) })

      let userCode = this.form.userCode
      let beginTime = this.form.beginTime ? this._formatterDate(this.form.beginTime) : ''
      let endTime = this.form.endTime ? this._formatterDate(this.form.endTime) : ''
      let sign = this.form.signSelect
      let ydsts = this.form.sendStateYdSelect
      let ltsts = this.form.sendStateLtSelect
      let dxsts = this.form.sendStateDxSelect
      let params = {
        userCode,
        beginTime,
        endTime,
        sign,
        ydsts,
        ltsts,
        dxsts
      }
      axios({
        url: '/getview/web/m/orgsms/getBatchInfos',
        method: 'post',
        params
      }).then(res => {
        console.log(res.data)
        if (res.data.code === '200') {
          this.btnLoadingState = false
          let data = res.data.data
          this.form.ydButtonValue = data.ydc
          this.form.ltButtonValue = data.ltc
          this.form.dxButtonValue = data.dxc
          // 向后台传递的数组【在这里保存】
          this.batchNoList = data.batchNoList
          console.log(data)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    conditionSendSubmit () {
      // 加载数据中
      if (this.btnLoadingState) {
        return false
      }
      // 禁用按钮 点一次
      if (this.disabledBtnState) {
        return false
      }
      let userCode = this.form.userCode
      let beginTime = this.form.beginTime ? this._formatterDate(this.form.beginTime) : ''
      let endTime = this.form.endTime ? this._formatterDate(this.form.endTime) : ''
      let sign = this.form.signSelect
      let ydsts = this.form.sendStateYdSelect
      let ltsts = this.form.sendStateLtSelect
      let dxsts = this.form.sendStateDxSelect
      let data = {
        ydSmsCnl: this.form.yd,
        ltSmsCnl: this.form.lt,
        dxSmsCnl: this.form.dx,
        userCode,
        beginTime,
        endTime,
        sign,
        ydsts,
        ltsts,
        dxsts
      }
      axios({
        url: '/getview/web/m/orgsms/smartSend',
        method: 'post',
        params: data
      }).then(res => {
        if (res.data.code === '200' || res.data.code === 200) {
          this.conditionSendDialog = false
          this.$message({
            showClose: true,
            duration: 2000,
            message: res.data.msg,
            type: 'success'
          })
          setTimeout(() => {
            this.form.ydButtonValue = this.form.dxButtonValue = this.form.ltButtonValue = '加载中'
            this.form.yd = this.form.dx = this.form.lt = ''
          }, 500)
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(err => console.log(err))
      this.disabledBtnState = true // 禁用按钮点击
    },
    conditionCancel () {
      this.conditionSendDialog = false
      this.form.ydButtonValue = this.form.dxButtonValue = this.form.ltButtonValue = '加载中'
      this.form.yd = this.form.dx = this.form.lt = ''
    },
    handleClickOnBatchModify () {
      if (this.form.userCode === '') {
        this.$message({
          message: '请输入查询账号！',
          duration: 1500,
          showClose: true,
          type: 'warning'
        })
        return false
      }
      if (this.form.sendStateYdSelect === '') {
        this.$message({
          message: '请选择移动发送状态！',
          duration: 1500,
          showClose: true,
          type: 'warning'
        })
        return false
      }
      if (this.form.sendStateLtSelect === '') {
        this.$message({
          message: '请选择联通发送状态！',
          duration: 1500,
          showClose: true,
          type: 'warning'
        })
        return false
      }
      if (this.form.sendStateDxSelect === '') {
        this.$message({
          message: '请选择电信发送状态！',
          duration: 1500,
          showClose: true,
          type: 'warning'
        })
        return false
      }
      if (this.form.beginTime === '') {
        this.$message({
          message: '请选择开始时间！',
          duration: 1500,
          showClose: true,
          type: 'warning'
        })
        return false
      }
      if (this.form.endTime === '') {
        this.$message({
          message: '请选择结束时间！',
          duration: 1500,
          showClose: true,
          type: 'warning'
        })
        return false
      }
      if (this.form.signSelect === '') {
        this.$message({
          message: '请输入查询签名！',
          duration: 1500,
          showClose: true,
          type: 'warning'
        })
        return false
      }
      this.$refs.batchModify.show()
      this.$refs.batchModify.hideState() // 禁用状态
      this.$refs.batchModify.showClickOnceState() // 可以点击
      this.$refs.batchModify.empty() // 清空所输入的值
    },
    handleBatchModify (data) {
      let selectCondition = {
        userCode: this.form.userCode,
        beginTime: this.form.beginTime ? this._formatterDate(this.form.beginTime) : '',
        endTime: this.form.endTime ? this._formatterDate(this.form.endTime) : '',
        sign: this.form.signSelect,
        ydsts: this.form.sendStateYdSelect,
        ltsts: this.form.sendStateLtSelect,
        dxsts: this.form.sendStateDxSelect
      }
      let params = Object.assign({}, selectCondition, data)
      console.log(params)
      axios({
        url: '/getview/web/m/orgsms/updateUserBatchs',
        method: 'post',
        params
      }).then(res => {
        if (res.data.code === '200') {
          this.$refs.batchModify.hide()
          this.$message({
            showClose: true,
            duration: 2000,
            message: res.data.msg,
            type: 'success'
          })
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  components: {
    BatchModify
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.send-btn-wrapper
  display flex
  flex-direction row-reverse
.demo-panel-title
  font normal 22px/40px "Helvetica Neue", Helvetica, Arial, sans-serif
  color #34495e
.select-wrapper
  width 100%
  box-sizing border-box
  .search-button
    width 100%
    font-size 16px
  .search-button-link
    width 100%
    font-size 16px
    padding 0 0
    height 100%
.page-wrapper
  padding 20px 0
.select-wrapper
  box-sizing border-box
  margin-bottom 20px
  .el-row
    display flex
    justify-content flex-start
.select-wrapper-second
  box-sizing border-box
  margin-bottom 20px
  .el-row-second
    display flex
    justify-content flex-start
.el-date-editor.el-input
  width 100%
.el-checkbox__inner
  width 20px
  height 20px
.el-button--text// 修改button按钮字体颜色
  color inherit
  font-size 18px
.el-total-show
  height 40px
  display flex
  align-items center
  justify-content center
  .total-show
    font-size 16px
.el-dialog__body
  padding 15px 20px
</style>
