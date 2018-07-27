
var Cookies = {}

// 设置Cookies。 expires 毫秒
Cookies.setValue = function (name, value, expires, path) {
  if (path === null || path === '') {
    path = '/'
  }
  if (expires === null || expires === -1 || expires === '') {
    document.cookie = name + '=' + escape(value) + ';path=' + path
  } else {
    // var Days = 30;
    var exp = new Date()
    exp.setTime(exp.getTime() + expires) // Days*24*60*60*1000
    document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';path=' + path
  }
}

// function setCookie (name, value, time) {
//   var strsec = getsec(time)
//   var exp = new Date()
//   exp.setTime(exp.getTime() + strsec * 1)
//   document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';path=/'
// }

// function getsec (str) {
//   var str1 = str.substring(1, str.length) * 1
//   var str2 = str.substring(0, 1)
//   if (str2 === 's') {
//     return str1 * 1000
//   } else if (str2 === 'h') {
//     return str1 * 60 * 60 * 1000
//   } else if (str2 === 'd') {
//     return str1 * 24 * 60 * 60 * 1000
//   }
// }

// 读取Cookies。
Cookies.getCookie = function (name) {
  var arr
  var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if (document.cookie.match(reg)) {
    arr = document.cookie.match(reg)
    return unescape(arr[2])
  } else {
    return null
  }
}

// 获取Cookie
Cookies.getValue = function (name) {
  if (name !== null) {
    var value = new RegExp('(?:^|; )' + encodeURIComponent(String(name)) + '=([^;]*)').exec(document.cookie)
    var rs = value ? decodeURIComponent(value[1]) : null
    // console.log(rs);
    if (rs === null) {
      return ''
    } else {
      // if (rs.indexOf('"') === 0) {
      //   rs = rs.replace(/\"/g, '')// 替换半角双引号为空
      // }
      return rs
    }
  }
}

// 清除Cookies。
Cookies.clear = function (name) {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1000000000000)
  var cval = Cookies.getValue(name)
  if (cval !== null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString() + ';path=/'
  }
}

// 获取Cookies值。
// Cookies.getCookieVal = function (offset) {
//   var endstr = document.cookie.indexOf(';', offset)
//   if (endstr === -1) {
//     endstr = document.cookie.length
//   }
//   return decodeURl(unescape(document.cookie.substring(offset, endstr)))
// }

Cookies.test = function () {
  console.log('this is a test')
}

export default Cookies
