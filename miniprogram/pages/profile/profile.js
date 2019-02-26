// pages/profile/profile.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grids: [{
      title: '我的',
      pic: '../../images/profile/filetag.png'
    }, {
      title: '图片',
      pic: '../../images/profile/picture.png'
    }, {
      title: '视频',
      pic: '../../images/profile/video.png'
    }, {
      title: '收藏',
      pic: '../../images/profile/collection.png'
      }],
      userInfo: null,
      isLogin:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    
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
  onShareAppMessage: function () {

  },
  
})