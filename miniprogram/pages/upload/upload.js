// pages/upload/upload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: null,
    currentPage: null,
    data: [{
      pic: '../../images/upload/test.jpg',
      des: '1231457891'
    }, {
      pic: '../../images/upload/test.jpg',
      des: '1231457891'
    }, {
      pic: '../../images/upload/test.jpg',
      des: '1231457891'
    }, {
      pic: '../../images/upload/test.jpg',
      des: '1231457891'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      title: options.title
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
  onShareAppMessage: function () {

  },
  backTo() {
    console.log(1);
    wx.navigateBack({
      delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
    });
  }
})