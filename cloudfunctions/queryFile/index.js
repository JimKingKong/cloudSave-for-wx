// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  let typeDB = event.typeDB;
  
  //集合数据的载体list
  try{
    return await db.collection(typeDB).where({des:event.des}).update({
      data: {
        isShare: true
      },
      success(res) {
        console.log('res.data')
      }
    });
  } catch(e){
    console.log(e)
  }
 
}