<template>
  <el-dialog title="批量修改" :lock-scroll="false" :visible.sync="dialogFormVisible">
    <el-form :model="form" label-position="right">
      <el-form-item label="签名" :label-width="formLabelWidth">
        <el-row>
          <el-col :span="10">
            <el-input v-model="form.sign" auto-complete="off"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="短信文案" :label-width="formLabelWidth">
        <el-row>
          <el-col :span="10">
            <el-input v-model="form.smstxt" auto-complete="off"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="移动发送状态" :label-width="formLabelWidth">
        <el-select v-model="form.ydState" placeholder="请选择活动区域">
          <el-option label="未发送" value="0"></el-option>
          <el-option label="人工发送" value="1"></el-option>
          <el-option label="自动发送" value="2"></el-option>
          <el-option label="驳回" value="3"></el-option>
          <el-option label="异常" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联通发送状态" :label-width="formLabelWidth">
        <el-select v-model="form.ltState" placeholder="请选择活动区域">
          <el-option label="未发送" value="0"></el-option>
          <el-option label="人工发送" value="1"></el-option>
          <el-option label="自动发送" value="2"></el-option>
          <el-option label="驳回" value="3"></el-option>
          <el-option label="异常" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电信发送状态" :label-width="formLabelWidth">
        <el-select v-model="form.dxState" placeholder="请选择活动区域">
          <el-option label="未发送" value="0"></el-option>
          <el-option label="人工发送" value="1"></el-option>
          <el-option label="自动发送" value="2"></el-option>
          <el-option label="驳回" value="3"></el-option>
          <el-option label="异常" value="4"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" :class="{'is-disabled': state}" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialogFormVisible: false,
      form: {
        sign: '',
        smstxt: '',
        ydState: '',
        ltState: '',
        dxState: ''
      },
      state: false, // 按钮禁用样式
      clickOnceState: true,
      formLabelWidth: '110px'
    }
  },
  methods: {
    show () {
      this.dialogFormVisible = true
    },
    hide () {
      this.dialogFormVisible = false
    },
    showState () {
      this.state = true
    },
    hideState () {
      this.state = false
    },
    showClickOnceState () {
      this.clickOnceState = true
    },
    hideClickOnceState () {
      this.clickOnceState = false
    },
    cancel () {
      this.dialogFormVisible = false
      this.empty()
    },
    empty () {
      this.form.sign = ''
      this.form.smstxt = ''
      this.form.ydState = ''
      this.form.ltState = ''
      this.form.dxState = ''
    },
    submit () {
      let data = {
        sign_new: this.form.sign,
        smsTxt_new: this.form.smstxt,
        ydsts_new: this.form.ydState,
        ltsts_new: this.form.ltState,
        dxsts_new: this.form.dxState
      }
      this.showState()
      this.hide()
      if (this.clickOnceState) {
        this.$emit('sure', data)
        this.hideClickOnceState()
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog
  width 60%
</style>
