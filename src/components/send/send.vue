<template>
  <div class="send">
    <el-card>
      <div slot="header" class="clearfix">
        <span class="demo-panel-title">批次发送</span>
      </div>
      <el-form ref="form" label-position="top" :model="form">
        <el-row :gutter="15">
          <el-col :span="5">
            <el-form-item label="通道">
              <el-select clearable v-model="form.channel" name="smsCnl" style="width:100%">
                <el-option v-for="(item, index) in id" :key="index" :label="item.id" :value="item.id" @click.native="handleIsShowTrack(index)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="签名">
              <el-input v-model="form.sign"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="13" style="margin-left: 20px">
            <el-form-item label="线索">
              <el-upload
                class="upload-demo"
                ref="upload"
                action="/getview/com/m/sms/batchsend"
                :on-preview="handlePreview"
                :auto-upload="false"
                :on-change="handleChange"
                :limit="1"
                :on-remove="handleRemove"
                :on-exceed="handleExceed"
              >
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <div slot="tip" class="el-upload__tip">只能上传 txt / cvs 文件，且不超过20MB</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="发送时间">
              <el-date-picker
                v-model="form.taskTime"
                type="datetime"
                placeholder="选择发送时间"
                width="100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="过期时间 (单位：分钟)">
              <el-input @keyup.native="validate" clearable v-model="form.failureTime" placeholder="请输入整数"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" style="margin-right: 25px">
            <el-form-item label="短信文案"><!--@keyup.native="calculateLength"-->
              <el-input @keyup.native="calculateLength" v-model="form.smstxt" type="textarea" name="smstxt" :rows="4"></el-input>
              <span class="show-length">还可以输入 {{maxValueLen - showLength}}&nbsp;个字符</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备注">
              <el-input name="memo" v-model="form.memo" type="textarea" :rows="4" placeholder="memo"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-checkbox name="jump" v-model="form.jump" label="重定向" border class="checkbox"></el-checkbox>
            <el-checkbox v-show="form.isTrack" name="track" v-model="form.track" label="追 踪" border class="checkbox"></el-checkbox>
          </el-col>
        </el-row>
        <el-row v-show="this.form.jump || this.form.track">
          <el-col :span="12">
            <el-form-item label="长链">
              <el-input name="url" v-model="form.url"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="bottom">
          <el-button @click="handleCancel">取&nbsp;&nbsp;&nbsp;&nbsp;消</el-button>
          <el-button class="myButton" type="primary" @click="onSubmit($event)">立即发送</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
import { formatterSendDate } from 'common/js'

export default {
  data () {
    return {
      title: 'SMS批次发送',
      desc: '简单·快捷·实用·便宜',
      showLength: 0,
      maxValueLen: 140,
      form: {
        channel: '',
        sign: '【】',
        file: '',
        smstxt: '',
        jump: false,
        track: false,
        isTrack: true,
        url: '',
        memo: '',
        taskTime: '',
        failureTime: ''
      },
      id: []
    }
  },
  created () {
    axios.post('/getview/web/m/sms/allChannels').then((res) => {
      if (res.data.code === '200') {
        this.id = res.data.data
      } else {
        this.$message.error(res.data.msg)
      }
    })
  },
  methods: {
    validate () {
      if (!/^[0-9]+$/.test(this.form.failureTime)) {
        this.form.failureTime = ''
      }
    },
    calculateLength (val) {
      let value = this.form.smstxt
      let len = this.getValueLength(value)
      if (len > this.maxValueLen) {
        let end = this.form.smstxt.substr(0, value.length - 1)
        this.form.smstxt = end
      } else {
        this.showLength = len
      }
    },
    getValueLength (value) {
      let myLen = 0
      for (var i = 0; i < value.length; i++) {
        if (value.charCodeAt(i) > 0 && value.charCodeAt(i) < 128) {
          myLen++
        } else {
          myLen += 2
        }
      }
      return myLen
    },
    handlePreview (file) {
      console.log(file)
    },
    handleRemove (file, fileList) {
      console.log('remove')
    },
    handleExceed (file) {
      this.$message({
        showClose: true,
        duration: 2000,
        message: '最多能上传一个文件',
        type: 'error'
      })
    },
    handleChange (file) {
      let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      let result1 = testmsg === 'txt'
      let result2 = testmsg === 'cvs'
      const isLt2M = file.size / 1024 / 1024 < 20
      if (!result1 && !result2) {
        console.log('只能上传txt、cvs格式')
        this.$message({
          showClose: true,
          duration: 2000,
          message: '只能上传txt、cvs格式',
          type: 'error'
        })
        return
      }
      if (!isLt2M) {
        console.log('上传文件大小不能超过20MB')
        this.$message({
          showClose: true,
          duration: 2000,
          message: '上传文件大小不能超过20MB',
          type: 'error'
        })
        return
      }
      // console.log('passed')
      let fileValue = document.querySelector('.el-upload__input')
      this.form.file = fileValue.files[0]
    },
    handleIsShowTrack (index) {
      // 是否显示 追踪选项
      if (this.id[index].isSelfdom === '0') {
        this.form.isTrack = false
      } else {
        this.form.isTrack = true
      }
      // console.log(this.id)
    },
    onSubmit (e) {
      e.preventDefault()
      this.$confirm('是否发送所填信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll: false,
        type: 'warning'
      }).then(() => {
        let jump = this.form.jump === true ? '1' : '0'
        let track = this.form.track === true ? '1' : '0'
        let taskTime = this.form.taskTime ? formatterSendDate(this.form.taskTime) : ''
        let failureTime = this.form.failureTime ? String(Number(this.form.failureTime) * 60) : ''
        let formData = new FormData()
        formData.append('smsCnl', this.form.channel)
        formData.append('sign', this.form.sign)
        formData.append('url', this.form.url)
        formData.append('taskTime', taskTime)
        formData.append('failureTime', failureTime)
        formData.append('memo', this.form.memo)
        formData.append('jump', jump)
        formData.append('track', track)
        formData.append('smstxt', this.form.smstxt)
        formData.append('file', this.form.file)
        axios.post('/getview/com/m/sms/batchsend', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }).then((res) => {
          if (res.data.code === '200') {
            this.$message({
              showClose: true,
              duration: 2000,
              message: '恭喜您，发送成功!',
              type: 'success'
            })
          } else {
            this.$message({
              showClose: true,
              duration: 2000,
              message: res.data.msg,
              type: 'error'
            })
          }
        }).catch((error) => {
          console.log(error)
          this.$message({
            showClose: true,
            duration: 2000,
            message: '发送失败, 请稍后重试',
            type: 'error'
          })
        })
      }).catch(() => {
        this.$message({
          showClose: true,
          type: 'info',
          duration: 2000,
          message: '已取消发送!'
        })
      })
    },
    handleCancel () {
      this.$router.push({
        path: '/'
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.send
  width 100%
  .demo-panel-title
    font normal 22px/40px "Helvetica Neue", Helvetica, Arial, sans-serif
    color #34495e
  .upload-demo
    display flex
    align-items center
    .el-upload__tip
      margin 0 20px
  .checkbox
    margin-right 40px
    margin-bottom 10px
  .bottom
    padding 40px 0 20px
    button
      margin 0 30px
  .el-button--default
    width 98px
.el-form-item
  margin-bottom 12px
  .show-length
    float right
    color #606266
</style>
