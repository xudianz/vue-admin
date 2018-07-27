<template>
  <div>
    <el-form ref="AccountFrom" :model="account" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title">管理员登录</h3>
      <el-input type="text"
        v-model.trim="account.username"
        auto-complete="off"
        placeholder="请输入账号"
        @keyup.native="handleAccountKeyUp"
      >
      </el-input>
      <div class="error-tip">
        <span>{{accountError}}</span>
      </div>
      <el-input type="password"
        v-model.trim="account.password"
        @keyup.native="handlePassWordKeyUp"
        auto-complete="off"
        placeholder="请输入密码"
      >
      </el-input>
      <div class="error-tip">
        <span>{{passwordError}}</span>
      </div>
      <!--<el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>-->
      <el-form-item style="width:100%">
        <el-button type="primary" style="width:100%" @click.native.prevent="handleSubmit" :loading="loading">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
import { baseGetwebrsapublickey } from 'common/js/base'
import { baseWebRoot, requestMethod, tid } from 'common/js/config'
import { key, encryptedString, bodyRSA } from 'common/js/RSA'

export default {
  data () {
    return {
      loading: false,
      account: {
        username: '',
        password: ''
      },
      accountError: '',
      passwordError: ''
    }
  },
  created () {
    baseGetwebrsapublickey()
  },
  computed: {
    // handleLogin () {
    //   localStorage.setItem('tokenId', '123')
    //   if (localStorage.getItem('tokenId')) {
    //     if (this.$route.query.redirect) {
    //       let path = this.$route.query.redirect
    //       this.$router.push({
    //         path
    //       })
    //     } else {
    //       this.$router.push({
    //         path: '/list'
    //       })
    //     }
    //   }
    // }
  },
  methods: {
    handleAccountKeyUp (e) {
      if (this.account.username) {
        this.accountError = ''
      }
      if (e.keyCode === 46 || e.keyCode === 8) {
        if (this.account.username === '') {
          this.accountError = '请输入账号'
        }
      }
    },
    handlePassWordKeyUp (e) {
      if (e.keyCode === 46 || e.keyCode === 8) {
        if (this.account.password === '') {
          this.passwordError = '请输入密码'
        }
      } else if (e.keyCode === 13) {
        this.handleSubmit()
      } else {
        if (this.account.password) {
          this.passwordError = ''
        }
      }
    },
    handleSubmit () {
      let username = this.account.username
      let password = this.account.password
      if (username === '') {
        this.accountError = '账号不能为空'
        return false
      }
      if (password === '') {
        this.passwordError = '密码不能为空'
        return false
      }
      let _this = this
      var successCallback = function () {
        _this.$router.push({
          path: '/list'
        })
      }
      this.login('', tid, successCallback, username, password)
    },
    login (url, tipsId, successCallback, username, password, errorCallback) {
      var urlStr = baseWebRoot + '/getview/web/o/login'
      bodyRSA()
      password = encryptedString(key, password)
      var para = {username: username, password: password, identifyingCode: ''}
      if (successCallback === null || successCallback === '' || typeof successCallback === 'undefined') {
        successCallback = function () {
          // 登录成功的回调
          // window.location.href = url ? baseWebRoot + url : baseWebRoot + '/getview/web/m/index'
        }
      }
      this.baseLoadData(urlStr, para, requestMethod, successCallback, errorCallback, tipsId)
    },
    baseGetwebrsapublickey () {
      var urlStr = baseWebRoot + '/getview/com/o/getwebrsapublickey'
      var para = ''
      var successCallback = function () {
        // baseRemoveLoad()
      }
      var errorCallback = function () {}
      var tid = null
      this.baseLoadData(urlStr, para, requestMethod, successCallback, errorCallback, tid)
    },
    baseLoadData (urlStr, para, requestMethod, successCallback, errorCallback, tid, rdrcturl, ajaxAsync, alertCallback) {
      // baseLoad()
      axios({
        url: urlStr,
        method: requestMethod,
        params: para
      }).then(response => {
        if (response.data.code === '200' || response.data.code === 200) {
          let e = response.data
          if (e.code === 200 || e.code === '200') {
            if (successCallback !== null && successCallback !== '' && typeof (successCallback) !== 'undefined') {
              successCallback(e)
            }
          } else if (e.code === '-100' || e.code === '-200' || e.code === '-300' || e.code === '-333') {
            if (rdrcturl || rdrcturl === '') {} else {
              rdrcturl = 'login.html'
            }
            window.location.href = rdrcturl
          } else {
            this.passwordError = e.msg
          }
        } else {
          this.$message.error(response.data.msg)
          console.log(response.data.msg)
          this.passwordError = response.data.msg
        }
        // baseRemoveLoad()
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.login-container
  /*box-shadow 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02)*/
  -webkit-border-radius 5px
  border-radius 5px
  -moz-border-radius 5px
  background-clip padding-box
  margin 160px auto
  width 350px
  padding 35px 35px 15px 35px
  background #fff
  border 1px solid #eaeaea
  box-shadow 0 0 25px #cac6c6

  background -ms-linear-gradient(top, #ace, #00C1DE) /* IE 10 */
  background -moz-linear-gradient(top, #ace, #00C1DE) /*火狐*/
  background -webkit-gradient(linear, 0% 0%, 0% 100%, from(#ace), to(#00C1DE)) /*谷歌*/
  background -webkit-linear-gradient(top, #ace, #00C1DE) /*Safari5.1 Chrome 10+*/
  background -o-linear-gradient(top,#ace, #00C1DE) /*Opera 11.10+*/
  .title
    margin 0px auto 40px auto
    text-align center
    color #505458
    font-size 22px
    font-weight bold
  .remember
    margin 0px 0px 35px 0px
  .error-tip
    height 36px
    line-height 36px
    font-size 14px
    color #f56c6c
    span
      padding-left 16px
</style>
