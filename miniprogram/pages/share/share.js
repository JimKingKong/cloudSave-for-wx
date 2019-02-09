// pages/share/share.js
const getHomeData = require('../../utils/service').getHomeData
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sharedata: [],
    userInfo: null,
    isLogin:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getHomeData()
    .then((res) => {
      console.log(res);
      this.setData({
        homeBean: res.data.data
      }) 

    
    })
    .catch((error) => {
      console.log(error);
    
    });
  /**
   * 判断授权
   */
   
      this.setData({
        userInfo:app.globalData.userInfo
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
    this.setData({
      userInfo:app.globalData.userInfo
    })
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
  onAuthorize(e) { 
    // console.log(e.detail.userInfo);
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo
    })
    wx.login({
      success: res => {
        wx.request({
          url: 'http://47.93.30.78:8080/XiaoMiShop/mine?code='+res.code, //开发者服务器接口地址",
          success: res => {
            // console.log(res.data);
            app.globalData.isLogin = true;
            this.setData({
              isLogin:true
            })
          },
        });
      },
      fail: () => {},
      complete: () => {}
    });
  },
})