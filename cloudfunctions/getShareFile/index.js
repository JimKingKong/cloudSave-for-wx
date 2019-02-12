// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
function clone(arr,allShare){
  arr.map((item)=>{
    allShare.push(item)
  })
  return allShare
}
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  // let list = await db.collection(typeDB).get();
  let allShare = [];
  let minelist = await db.collection('mine').where({
    isShare: true
  }).get();
  let piclist =  await db.collection('picture').where({
    isShare: true
  }).get();
  let videolist = await db.collection('video').where({
    isShare: true
  }).get();
  let collectionlist = await db.collection('collection').where({
    isShare: true
  }).get();
  allShare = clone(minelist.data, allShare);
  allShare = clone(piclist.data, allShare);
  allShare = clone(videolist.data, allShare);
  allShare = clone(collectionlist.data, allShare)
  // allShare.push(minelist.data, piclist.data, videolist.data, collectionlist.data)
  
  return {
    list: allShare,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}