// pages/upload/upload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: null,

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
  },
  /**
   * 点击上传事件
   */
  onUpload() {
    if (this.data.title === "'图片'") {
      console.log(2);
      this.chooseImage()

    } else if (this.data.title === "'视频'") {
      console.log(3);
      this.chooseVideo()
    } else {
      let _this = this;
      console.log(4);
      wx.showActionSheet({
        itemList: ['图片', '视频'],
        success(res) {
          console.log(res.tapIndex);
          if (res.tapIndex === 0) {
            _this.chooseImage()
          } else {
            _this.chooseVideo()
          }
        },
        fail(res) {
          console.log(res.errMsg)
        }
      })
    }
  },
  /**
   * 点击图片
   */
  itemClick(e) {
    console.log(e);
    console.log('判断图片或者影片,预览图片或者影片'); 
  },
  /**
   * 长按
   */
  longPress() {
    console.log('弹出菜单');
    wx.showActionSheet({
      itemList: ['保存到本地', '重命名', '删除'], //按钮的文字数组，数组长度最大为6个,
      itemColor: '#000000', //按钮的文字颜色,
      success: res => {
        console.log(res);

      }
    });
  },
  /**
   * 选择方法
   */
  chooseImage() {
    wx.chooseImage({
      count: '1', //最多可以选择的图片张数,
      success: res => {
        console.log(res);
        const tempFilePaths = res.tempFilePaths

      }, //返回图片的本地文件路径列表 tempFilePaths,
      fail: (res) => {
        console.log(res);

      },
    });
  },
  chooseVideo() {
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        console.log(res);
        const tempFilePaths = res.tempFilePaths
      }
    })
  }
})