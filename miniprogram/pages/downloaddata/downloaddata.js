// pages/downloaddata/downloaddata.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: null,
    id: null,
    type: null,
    isShow: false,
    isVideo: false,
    isImg: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    console.log(options);
    if (options.type === "video") {
      this.changeVideoLink(options.id).then(res => {
        _this.setData({
          url: res.fileList[0].tempFileURL,
          type: options.type,
          id: options.id,
          isShow: true,
          isVideo: true
        })
      })
    } else {
      _this.setData({
        type: "img",
        id: options.id,
        isShow: true,
        isImg: true
      })
    }
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
  /**
   * 点击返回
   */
  clickReturn() {
    console.log(1)
    wx.reLaunch({
      url: '../share/share'
    })
  },
  changeVideoLink(cloudLink) {
    return new Promise((resolve, reject) => {
      wx.cloud.getTempFileURL({
        fileList: [{
          fileID: cloudLink
        }],
        success: res => {
          resolve(res);
        },
        fail: error => {
          reject(error)
        }
      })
    })
  },
  /**
   * 点击下载
   */
  onDownLoad(e) {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success(res) {
              console.log(res);
            }
          })
        }
      }
    })
    console.log(e.currentTarget.dataset.type);
    console.log(e.currentTarget.dataset.item);
    let item = e.currentTarget.dataset.item;
    wx.cloud.downloadFile({
      fileID: item
    }).then(res => {
      console.log(res.tempFilePath);
      if (e.currentTarget.dataset.type==="img") {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(saveres) {
            wx.showToast({
              title: '保存成功', //提示的内容,
              icon: 'success', //图标,
              duration: 2000, //延迟时间,
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {}
            });
          },
        })
      } else {
        wx.saveVideoToPhotosAlbum({
          filePath: res.tempFilePath,
          success(saveres) {
            wx.showToast({
              title: '保存成功', //提示的内容,
              icon: 'success', //图标,
              duration: 2000, //延迟时间,
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {}
            });
          }
        })
      }
      // wx.saveFile({
      //   tempFilePath: res.tempFilePath, //需要保存的文件的临时路径,
      //   success: res => {
      //     console.log(res);
      //     wx.showToast({
      //       title: '下载成功', //提示的内容,
      //       icon: 'success', //图标,
      //       duration: 2000, //延迟时间,
      //       mask: false, //显示透明蒙层，防止触摸穿透,
      //       success: res => {}
      //     });
      //   }
      // });
    }).catch(error => {
      console.log(error);
      wx.showToast({
        title: '下载失败,请检查网络', //提示的内容,
        icon: 'loading', //图标,
        duration: 2000, //延迟时间,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });

    })
  }

})