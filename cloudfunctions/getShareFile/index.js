// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
function getMineShare(arr) {
  let newArr = [];
  arr.map((item) => {
    newArr.push( ...Array.from((item.dirData.filter((item) => {
      return item.isShare === true
    }))))
  })
  return newArr
}
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  let allShare = [];
  let minelist = await db.collection('mine').where({
    _openid: wxContext.OPENID,
  }).get();
  let piclist = await db.collection('picture').where({
    _openid: wxContext.OPENID,
    isShare: true
  }).get();
  let videolist = await db.collection('video').where({
    _openid: wxContext.OPENID,
    isShare: true
  }).get();
  let collectionlist = await db.collection('collection').where({
    _openid: wxContext.OPENID,
    isShare: true
  }).get();

  allShare.push(...getMineShare(minelist.data),...piclist.data,...videolist.data,...collectionlist.data)


  return {
    list: allShare,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}