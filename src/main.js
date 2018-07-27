import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router/index'
import { Col, Row, Table, TableColumn, Form, FormItem, Input, Checkbox, Select, Option, Radio, Button, Upload, Pagination, Loading, MessageBox, Message, Dialog, Card, DatePicker, Tooltip, Popover, Dropdown, DropdownMenu, DropdownItem, Tag, Menu, Submenu, MenuItem } from 'element-ui'

import 'common/stylus/index.styl'
// import { getCookie } from 'common/js/common'

Vue.use(Col)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(Select)
Vue.use(Radio)
Vue.use(Option)
Vue.use(Button)
Vue.use(Upload)
Vue.use(Pagination)
Vue.use(Loading)
Vue.use(Dialog)
Vue.use(Card)
Vue.use(DatePicker)
Vue.use(Tooltip)
Vue.use(Popover)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Tag)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
// Vue.use(MessageBox)

Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$message = Message

Vue.config.productionTip = false
// Vue.prototype.$getCookie = getCookie

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

// router.beforeEach((to, from, next) => {
//   if (to.meta.auth)
// })
