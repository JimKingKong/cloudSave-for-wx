// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//数据库
const db = cloud.database();
const mineDB = db.collection("mine");
const pictureDB = db.collection("picture");
const videoDB = db.collection("video");
const usersDB = db.collection("users");
const collectionDB = db.collection("collection")

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  let typeDB = event.typeDB;
  //集合数据的载体list
  let list = [];
  //获取云端typeDB集合的所有数据(上限为100)
  function getAllFromCloud (typeDB){
    db.collection('collection').get({
      success(res) {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        console.log(res.data)
        list.push(res.data)
      },
      fail(e){console.log(e)}
    })

  };
  getAllFromCloud(typeDB);
  
  return {
    list,
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}