// pages/upload/upload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: null,
    uploaddata: null,
    mp4logo: '../../images/upload/MP4logo.png',
    otherlogo:'../../images/upload/file-unknown.png'
    
    // {
    //   pic: '../../images/upload/test.jpg',
    //   des: '1231457891'
    // }, {
    //   pic: '../../images/upload/test.jpg',
    //   des: '1231457891'
    // }, {
    //   pic: '../../images/upload/test.jpg',
    //   des: '1231457891'
    // }, {
    //   pic: '../../images/upload/test.jpg',
    //   des: '1231457891'
    // }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'getFileList',
      data: {
        // type:options.title
        typeDB:'users'
      },
      complete: res => {
        console.log(res.result);
        
      }
    })
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
  
  /**
   * 点击上传事件
   */
  onUpload() {
    if (this.data.title === "'图片'") {

      this.chooseImage()

    } else if (this.data.title === "'视频'") {

      this.chooseVideo()
    } else {
      let _this = this;

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
    let currentIndex = e.currentTarget.id
    if (e.currentTarget.dataset.type.isImg) {
      wx.previewImage({
        urls: [this.data.uploaddata[currentIndex].pic] //需要预览的图片链接列表,
      });
    }else if (e.currentTarget.dataset.type.isVideo) {
      console.log('点击了视频');
      
    }
   
  },
  /**
   * 长按
   */
  longPress() {
    console.log('弹出菜单');
    wx.showActionSheet({
      itemList: ['保存到本地', '设为分享', '重命名', '删除'], //按钮的文字数组，数组长度最大为6个,
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
    let _this = this
    wx.chooseImage({
      count: '1', //最多可以选择的图片张数,
      success: res => {
        wx.showLoading({
          title: '上传中',
        });
        console.log(res);
        let filePath = res.tempFilePaths[0] //返回图片的本地文件路径列表 tempFilePaths,
        const name = new Date().getTime();
        const cloudPath = name + filePath.match(/\.[^.]+?$/)[0];
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            let newUploadData = null
        
            if (_this.data.uploaddata === null) {
              newUploadData = []
            } else {
              newUploadData = _this.data.uploaddata;
            }

            newUploadData.push({
              pic: res.fileID,
              des: name,
              isImg: true,
              isShare:false
            })
            console.log('[上传图片] 成功：', res);
            _this.setData({
              uploaddata: newUploadData
            })
            console.log(_this.data);;
            let fileID = res.fileID;
            const db = wx.cloud.database();
            db.collection("users").add({
              data: {
                bigImg: fileID,  
                isImg: true,
                isShare:false
              },
              success() {
                wx.showToast({
                  title: '图片存储成功', //提示的内容,
                  icon: 'success', //图标,
                  duration: 2000, //延迟时间,
                  mask: true, //显示透明蒙层，防止触摸穿透,
                  success: res => {},
                  fail() {
                    wx.showToast({
                      title: '图片存储失败', //提示的内容,
                      icon: 'fail', //图标,
                      duration: 2000, //延迟时间,
                      mask: true, //显示透明蒙层，防止触摸穿透,

                    });
                  }
                });
              }
            })
          },
          fail: error => {
            console.log('[上传图片] 失败：', error);

          },
          complete: () => {
            wx.hideLoading();
          }

        })

      },
    });
  },
  chooseVideo() {
    let _this = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        console.log(res);
        wx.showLoading({
          title: '上传中',
        });
        let filePath = res.tempFilePath;
        const name = new Date().getTime();
        const cloudPath = name + filePath.match(/\.[^.]+?$/)[0];
        wx.cloud.uploadFile({
          cloudPath, //云存储图片名字
          filePath, //临时路径
          success: res => {
            let newUploadData = null
            
            if (_this.data.uploaddata == null) {
              newUploadData = []
            } else {
              newUploadData = _this.data.uploaddata;
            }

            console.log('[上传视频] 成功：', res)
            

            newUploadData.push({
              videoPic: res.fileID,
              des: name,
              isVideo: true,
              isShare:false
            })
            _this.setData({
              uploaddata: newUploadData
            });
            console.log(_this.data.uploaddata);
            let fileID = res.fileID;
            const db = wx.cloud.database();
            db.collection("users").add({
              data: {
                bigVideo: fileID,
                isVideo: true,
                isShare:false
              },
              success() {
                wx.showToast({
                  title: '视频存储成功', //提示的内容,
                  icon: 'success', //图标,
                  duration: 2000, //延迟时间,
                  mask: true, //显示透明蒙层，防止触摸穿透,
                  success: res => {},
                  fail() {
                    wx.showToast({
                      title: '视频存储失败', //提示的内容,
                      icon: 'fail', //图标,
                      duration: 2000, //延迟时间,
                      mask: true, //显示透明蒙层，防止触摸穿透,

                    });
                  }
                });
              }
            })
          }
        })
      }
    })
  },
  /**
   * 
   */
})