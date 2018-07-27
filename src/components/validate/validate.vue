<template>
  <div class="validate">
    <el-card>
      <div slot="header" class="clearfix">
        <span class="demo-panel-title">账号验证</span>
      </div>
      <el-form ref="form" :model="form">
        <el-row :gutter="30">
          <el-col :span="5">
            <el-form-item label="短信账号（必选）">
              <el-select v-model="form.selectAccount" clearable>
                <el-option v-for="(item, index) in account" :key="index" :label="item.id" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="签名">
              <el-input v-model="sign"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="手机号(必填，多个使用英文逗号分隔)">
              <el-input v-model="form.phoneNumber" placeholder="phones" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item label="短信内容(必填)">
              <el-input v-model="form.smsm" type="textarea" :rows="3" placeholder="sms content"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item class="bottom">
          <el-button class="myButton" type="primary" @click="onSubmit">立即验证</el-button>
          <el-button @click="cancel">取&nbsp;&nbsp;&nbsp;&nbsp;消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      form: {
        selectAccount: '',
        phoneNumber: '',
        smsm: '',
        isSupportMobileRes: '',
        response: ''
      },
      account: [],
      sign: '【】'
    }
  },
  created () {
    axios.post('/getview/web/m/sms/allChannels').then((res) => {
      if (res.data.code === '200') {
        this.account = res.data.data
      } else {
        this.$message.error(res.data.msg)
      }
    })
  },
  methods: {
    // accountToSign (index) {
    //   this.sign = this.account[index].smsm
    // },
    onSubmit () {
      let params = {
        smsCnl: this.form.selectAccount,
        sign: this.sign,
        memo: '',
        smstxt: this.form.smsm,
        phones: this.form.phoneNumber
      }

      axios({
        url: '/getview/com/m/sms/testSend',
        method: 'post',
        params
      }).then((response) => {
        if (response.data.code === '200') {
          // console.log(response)
          this.$message({
            showClose: true,
            duration: 2000,
            message: '恭喜您，验证成功',
            type: 'success'
          })
        } else {
          this.$message.error(response.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message({
          showClose: true,
          duration: 2000,
          message: '验证失败',
          type: 'error'
        })
      })
    },
    cancel () {
      this.$router.push({
        path: '/list'
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.validate
  width 100%
  box-sizing border-box
  .demo-panel-title
    font normal 22px/40px "Helvetica Neue", Helvetica, Arial, sans-serif
    color #34495e
  .bottom
    padding 20px 0
    button
      width 98px
</style>
