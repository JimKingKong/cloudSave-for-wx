// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//数据库
const db = cloud.database();


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  let typeDB = event.typeDB;
  let id = event.id
    
  //集合数据的载体list
  let list = await db.collection(typeDB).doc(id).get();
  //获取云端typeDB集合的所有数据(上限为100)
  return {
    list: list.data,
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}