<template>
  <div id="dialog">
    <el-dialog
      title="用户修改"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
    >
      <el-form :model="form">
        <el-row :gutter="20">
          <el-col :span="6">
              <el-form-item label="账号">
              <el-input v-model="form.key" width="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="密钥">
              <el-input v-model="form.pwd"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="运营商">
              <el-input v-model="form.name" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="企业代码">
              <el-input v-model="form.corpid"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="开启状态">
              <el-select v-model="form.isOpen" width="100">
                <el-option label="开启" value="开启"></el-option>
                <el-option label="禁用" value="禁用"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="支持移动">
              <el-select v-model="form.yd" width="100">
                <el-option label="是" value="是"></el-option>
                <el-option label="否" value="否"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="支持电信">
                <el-select v-model="form.dx" width="100">
                <el-option label="是" value="是"></el-option>
                <el-option label="否" value="否"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="支持联通">
                <el-select v-model="form.lt" width="100">
                <el-option label="是" value="是"></el-option>
                <el-option label="否" value="否"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="短信报告自取url">
              <el-input v-model="form.reportUrl"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="短信发送量/次">
              <el-input v-model="form.bulk"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="短信报告提取量/次">
              <el-input v-model="form.reportNum"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="短信模板">
              <el-input type="textarea" :rows="3" v-model="form.smsm"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getData, saveChannel } from 'api/modify'

export default {
  props: {
    propsId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      dialogVisible: false,
      id: '',
      form: {
        key: '',
        pwd: '',
        name: '',
        isOpen: '',
        yd: '',
        dx: '',
        lt: '',
        reportUrl: '',
        corpid: '',
        bulk: '',
        reportNum: '',
        smsm: ''
      }
    }
  },
  methods: {
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    show () {
      this.dialogVisible = true
    },
    hide () {
      this.dialogVisible = false
    },
    _getData (id) {
      getData(id).then((res) => {
        if (res.code === '200') {
          let data = res.data
          let form = this.form
          let { key, pwd, isOpen, name, yd, dx, lt, smsm, corpid, bulk, reportUrl, reportNum } = data
          form.key = key
          form.pwd = pwd
          form.isOpen = isOpen === '1' ? '开启' : '禁用'
          form.name = name
          form.yd = yd === '1' ? '是' : '否'
          form.dx = dx === '1' ? '是' : '否'
          form.lt = lt === '1' ? '是' : '否'
          form.smsm = smsm
          form.corpid = corpid
          form.bulk = bulk
          form.reportUrl = reportUrl
          form.reportNum = reportNum
        } else {
          this.$message.error(res.msg)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    onSubmit () {
      this.$confirm('是否要修改所填信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        lockScroll: false,
        type: 'warning'
      }).then(() => {
        let _id = this.id
        let isOpen = this.form.isOpen === '开启' ? '1' : '0'
        let yd = this.form.yd === '是' ? '1' : '0'
        let dx = this.form.dx === '是' ? '1' : '0'
        let lt = this.form.lt === '是' ? '1' : '0'
        let params = {
          key: this.form.key,
          pwd: this.form.pwd,
          name: this.form.name,
          smsm: this.form.smsm,
          _id,
          isOpen,
          yd,
          dx,
          lt,
          corpid: this.form.corpid,
          bulk: this.form.bulk,
          reportUrl: this.form.reportUrl,
          reportNum: this.form.reportNum
        }
        saveChannel(params).then((res) => {
          if (res.code === '200') {
            this.hide()
            this.$emit('refresh')
            this.$message({
              showClose: true,
              duration: 2000,
              message: '恭喜您，修改成功',
              type: 'success'
            })
          } else {
            this.$message.error(res.msg)
          }
        }).catch((err) => {
          console.log(err)
          this.$message({
            showClose: true,
            duration: 2000,
            message: '修改失败',
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
    }
  },
  watch: {
    propsId (newValue) {
      this._getData(newValue)
      this.id = newValue
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
#dialog
  width 100%
  .el-form-item
    margin-bottom 0px
  .el-dialog__body
    padding 0 20px 0 !important
</style>
