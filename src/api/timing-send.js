import axios from 'axios'

export const getData = (data) => {
  const url = '/getview/web/m/sms/getTaskSms'

  return axios({
    url,
    method: 'post',
    params: data
  }).then(res => Promise.resolve(res.data))
}
