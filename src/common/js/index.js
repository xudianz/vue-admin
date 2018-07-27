export function formatterTime (time) {
  return time.substr(0, 4) + '-' + time.substr(4, 2) + '-' + time.substr(6, 2) + ' ' + time.substr(8, 2) + ':' + time.substr(10, 2) + ':' + time.substr(12, 2)
}

export function formatterSendState (state) {
  switch (state) {
    case '0' :
      return '未发送'
    case '1' :
      return '人工发送'
    case '2' :
      return '自动发送'
    case '3' :
      return '驳回'
  }
}

export function transformSendState (value) {
  switch (value) {
    case '未发送' :
      return '0'
    case '人工发送' :
      return '1'
    case '自动发送' :
      return '2'
    case '驳回' :
      return '3'
  }
}

export function getWeekDate () {
  const date = new Date()
  date.setTime(date.getTime() - 7 * 24 * 3600 * 1000)
  let year = date.getFullYear()
  let month = addZero(date.getMonth() + 1)
  let day = addZero(date.getDate())
  let hours = addZero(date.getHours())
  let minutes = addZero(date.getMinutes())
  let seconds = addZero(date.getSeconds())
  let result = `${year}${month}${day}${hours}${minutes}${seconds}`
  return result
}

function addZero (time) {
  if (time < 10) {
    return '0' + time
  } else {
    return time
  }
}

export const formatterSendDate = (time) => {
  let result = time.getFullYear() + '' + (addZero(time.getMonth() + 1)) + '' + addZero(time.getDate()) + '' + addZero(time.getHours()) + '' + addZero(time.getMinutes()) + '' + addZero(time.getSeconds())
  return result
}
