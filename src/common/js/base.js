import axios from 'axios'
import { baseWebRoot, requestMethod } from './config'

export function baseGetwebrsapublickey () {
  var urlStr = baseWebRoot + '/getview/com/o/getwebrsapublickey'
  var para = ''
  var successCallback = function () {
    // baseRemoveLoad()
  }
  var errorCallback = function () {}
  var tid = null
  baseLoadData(urlStr, para, requestMethod, successCallback, errorCallback, tid)
}

/* 显示加载 */
// function baseLoad () {
//   console.log('显示加载')
// }

/* 隐藏加载 */
// function baseRemoveLoad () {
//   console.log('隐藏加载')
// }

export function baseLoadData (urlStr, para, requestMethod, successCallback, errorCallback, tid, rdrcturl, ajaxAsync, alertCallback) {
  // baseLoad()
  axios({
    url: urlStr,
    method: requestMethod,
    params: para
  }).then(response => {
    console.log(response.data)
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
      errorCallback()
    }

    // baseRemoveLoad()
  }).catch(err => {
    // alert(e)
    if (errorCallback === null) {
      baseAlert(err)
    } else {
      errorCallback(err)
    }
    // baseRemoveLoad()
  })
}

export function baseAlert (e, tid, alertCallback) {
  var el = document.querySelector(tid)
  console.log(el)
  if (alertCallback === null || typeof (alertCallback) === 'undefined') {
    tid ? el.innerHtml(e.msg) : e.msg && alert(e.msg)
  } else {
    alertCallback(e, tid)
  }
}
