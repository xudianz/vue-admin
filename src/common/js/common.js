var heightnum = 100
var widthnum = 100
var baseH1
var baseH2
var baseW1
var baseW2
function resize (id) {
  setheightnum()
  setwidthnum()
  setheight(id)
  setwidth(id)
}
function setheight (id) {
  setheightnum()
  document.getElementById(id).style.height = heightnum
}
function setwidth (id) {
  setwidthnum()
  document.getElementById(id).style.width = widthnum
}
function setheightnum () {
  if (document.documentElement.clientHeight === 0 || document.documentElement.clientHeight === '') {
    heightnum = document.body.clientHeight - baseH1
  } else {
    heightnum = document.documentElement.clientHeight - baseH2
  }
}
function setwidthnum () {
  if (document.documentElement.clientWidth === 0 || document.documentElement.clientWidth === '') {
    widthnum = document.body.clientWidth - baseW1
  } else {
    widthnum = document.documentElement.clientWidth - baseW2
  }
}
function getRemainingHeight (num) {
	if (document.documentElement.clientHeight === 0 || document.documentElement.clientHeight === '') {
    return document.body.clientHeight - num
  } else {
    return document.documentElement.clientHeight - num
  }
}
function getRemainingWidth (num) {
	if (document.documentElement.clientWidth === 0 || document.documentElement.clientWidth === '') {
    return document.body.clientWidth - num
  } else {
    return document.documentElement.clientWidth - num
  }
}
