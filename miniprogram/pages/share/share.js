// pages/share/share.js
const getHomeData = require('../../utils/service').getHomeData
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareList:null,
    userInfo: null,
    isLogin: false,
    mp4logo: '../../images/upload/MP4logo.png',
    shareLogo:'../../images/setting/cloudshare.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData()
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
    this.getPageData()
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
    if (this.data.shareList[targetId].isImg) {
      return {
        title:'分享文件',
        path: 'pages/downloaddata/downloaddata?url=' + this.data.shareList[targetId].pic,
        imageUrl:this.data.shareLogo
      }
      
    }else if (this.data.shareList[targetId].isVideo) {
      return {
        title:'分享文件',
        path: 'pages/downloaddata/downloaddata?url=' + this.data.shareList[targetId].videoPic,
        imageUrl:this.data.shareLogo
      }
      
    }
    
  },
  getPageData() {
    let _this =this
    wx.cloud.callFunction({
      name: "getShareFile",
      success(res) {
        _this.setData({
          shareList:res.result.list
        })
        console.log(_this.data.shareList);
        
      }
    })
  }
 
})