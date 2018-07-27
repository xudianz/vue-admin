<template>
  <div class="smslist">
    <el-card>
      <div slot="header" class="clearfix">
        <span class="demo-panel-title">用户信息</span>
      </div>
      <el-table :data="tableData" v-loading="page.loading" style="width:100%;margin-top:10px">
        <el-table-column prop="key" label="账号"></el-table-column>
        <!-- <el-table-column prop="mobileSend" label="移动发送" width="60">00</el-table-column>
        <el-table-column prop="mobileRes" label="移动回复" width="60"></el-table-column> -->
        <el-table-column prop="name" label="通道名称"></el-table-column>
        <el-table-column prop="id" label="通道商" width="210"></el-table-column>
        <el-table-column prop="smsm" label="模板" width="180"></el-table-column>
        <el-table-column prop="isPoll" label="短信报告" :formatter="formatterResult"></el-table-column>
        <el-table-column prop="isSelfdom" label="支持追踪" :formatter="formatterIsSelfdom"></el-table-column>
        <el-table-column prop="isOpen" label="状态" :formatter="formatterState" width="100"></el-table-column>
        <el-table-column prop="operation" label="操作" width="120">
          <template slot-scope="scope">
            <i class="el-icon-edit" @click="handleModify(scope.$index, scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-wrapper">
        <el-pagination
          background
          layout="prev, pager, next, total"
          :current-page="page.currentIndex"
          :page-size="page.pageSize"
          :total="page.totalPage"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
      <modify :propsId="propsId" @refresh="refresh" ref="modify"></modify>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
import Modify from 'components/modify/modify'

export default {
  data () {
    return {
      title: 'SMS详情列表',
      desc: '简单·快捷·实用·便宜',
      tableData: [],
      page: {
        currentIndex: 1,
        pageSize: 10,
        totalPage: 0,
        loading: false
      },
      propsId: ''
    }
  },
  created () {
    this._getPageData()
  },
  methods: {
    _getPageData (index, size) {
      this.page.loading = true
      let currentPage = index || this.page.currentIndex
      let pageSize = size || this.page.pageSize
      let params = { currentPage, pageSize }
      axios({
        url: '/getview/web/m/sms/channelPages',
        method: 'post',
        params
      }).then((response) => {
        if (response.data.code === '200') {
          let data = response.data.data
          this.tableData = data.datas
          this.page.totalPage = Number(data.totalCount)
          this.page.currentIndex = Number(data.pageNo)
          this.page.loading = false
        } else {
          this.$message.error(response.data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.page.loading = false
      })
    },
    refresh () {
      this._getPageData()
    },
    handleModify (index, row) {
      // let id = this.tableData[index].id
      // this.$router.push({
      //   name: 'modify',
      //   params: {id}
      // })
      let id = row.id
      this.propsId = id
      this.$refs.modify.show()
    },
    formatterIsSelfdom (row) {
      return row.isSelfdom === '1' ? '是' : '否'
    },
    formatterState (row, col) {
      return row.isOpen === '1' ? '启用' : '禁用'
    },
    formatterResult (row) {
      return row.isPoll === '1' ? '自取' : '回调'
    },
    handleCurrentChange (currentIndex) {
      this._getPageData(currentIndex, this.page.pageSize)
    }
  },
  components: {
    Modify
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.smslist
  width 100%
.demo-panel-title
  font normal 22px/40px "Helvetica Neue", Helvetica, Arial, sans-serif
  color #34495e
.page-wrapper
  padding 20px 0
</style>
