// pages/setting/setting.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: app.globalData.userInfo,
    isLogin: app.globalData.isLogin,
    settingItems: [{
        url: '../mine/mine',
        img: '../../images/setting/ownfile.png',
        title: '个人资料'
      },
      {
        method:'onRight',
        img: '../../images/setting/toright.png',
        title: '授权管理'
      },
      {
        url: '../about/about',
        img: '../../images/setting/about.png',
        title: '关于'
      },
    ],
    dataBean: []
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
    if (app.globalData.userInfo !== undefined) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    }

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
  authorizeClick(e) {
    console.log(e.detail.userInfo);
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo
      })
 
    }
  },
  onRight() {
    wx.openSetting();
  },
})