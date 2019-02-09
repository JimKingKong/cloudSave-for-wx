const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const fetch = function ({ url = '', method = 'get', data = '', dataType = 'json', header = { 'content-type': 'application/json' } } = {}) {
  return new Promise((resolve,reject) => {
    wx.request({
      url, //开发者服务器接口地址",
      data, //请求的参数",
      method,
      dataType, //如果设为json，会尝试对返回的数据做一次 JSON.parse
      header,
      success: res => {resolve(res)},
      fail: error => {reject(error)},
    });
  })
}
module.exports = {
  formatTime: formatTime,
  fetch:fetch
}
