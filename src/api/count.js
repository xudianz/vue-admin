import axios from 'axios'

export const getChannel = () => axios.post('/getview/web/m/sms/allChannels')

export const getTableData = params => axios({
  url: '/getview/web/m/sms/getReport',
  method: 'post',
  params
})
