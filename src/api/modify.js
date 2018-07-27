import axios from 'axios'

export const getData = (id) => {
  const url = '/getview/web/m/sms/findChannel'

  return axios({
    url,
    method: 'post',
    params: {
      smsCnl: id
    }
  }).then((res) => Promise.resolve(res.data))
}

export const saveChannel = (params) => {
  const url = '/getview/web/m/sms/saveChannel'

  return axios({
    url,
    method: 'post',
    params
  }).then((res) => Promise.resolve(res.data))
}
