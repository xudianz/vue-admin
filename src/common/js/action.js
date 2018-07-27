import { baseLoadData } from './base'
import { baseWebRoot, requestMethod } from './config'
import { key, encryptedString, bodyRSA } from './RSA'

export function login (url, tipsId, successCallback, username, password, errorCallback) {
  var urlStr = baseWebRoot + '/getview/web/o/login'
  // var username = document.querySelector('#username').value
  // console.log(username)
  // var password = document.querySelector('#password').value
  // var identifyingCode = document.querySelector('#identifyingCode').value
  bodyRSA()
  password = encryptedString(key, password)
  var para = {username: username, password: password, identifyingCode: ''}
  if (successCallback === null || successCallback === '' || typeof successCallback === 'undefined') {
    successCallback = function () {
      window.location.href = url ? baseWebRoot + url : baseWebRoot + '/getview/web/m/index'
    }
  }
  baseLoadData(urlStr, para, requestMethod, successCallback, errorCallback, tipsId)
}
