// pages/share/share.js
const getHomeData = require('../../utils/service').getHomeData
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sharedata: [{
      title: '1549706325',
      pic: '../../images/upload/test.jpg',
      time:1549706325
    }, {
      title: '1549706325',
      pic: '../../images/upload/tom.jpg',
      time: 1549706325
    }, {
      title: '1549706325',
      pic: '../../images/share/duck.jpg',
      time: 1549706325
    }, {
      title: '1549706325',
      pic: '../../images/share/gkd.jpg',
      time: 1549706325
    }],
    userInfo: null,
    isLogin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: "getShareFile",
      success(res) {
        console.log(res);
        
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    console.log(event)
    let targetId = event.target.id
    return {
      title:'分享文件',
      path:'pages/downloaddata/downloaddata?pic='+this.data.sharedata[targetId].pic,
    }
  },
 
})