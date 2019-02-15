// pages/share/share.js
const db = wx.cloud.database();
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
  },
  /**
   * 长按弹出菜单
   */
  longPress(e) { 
    let item = e.currentTarget.dataset.item;
    console.log(item);
    let _this = this
    wx.showActionSheet({
      itemList: ['取消分享'], //按钮的文字数组，数组长度最大为6个,
      itemColor: '#000000', //按钮的文字颜色,
      success: res => {
        if (res.tapIndex === 0) {
          db.collection(item.from).doc(item.id).update({
            data: {
              isShare: false
            },
            success(res) {
              console.log(res);
              wx.showToast({
                title: '设置成功', //提示的内容,
                icon: 'success', //图标,
                duration: 2000, //延迟时间,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {
                  _this.getPageData();
                }
              });
            },
            fail(e) {
              console.log(e);
              wx.showToast({
                title: '设置失败,请检查网络', //提示的内容,
                icon: 'fail', //图标,
                duration: 2000, //延迟时间,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {}
              });
            }
          });
        } 
      }
    });
  }
 
})