// pages/upload/upload.js
const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: null,
    type: null,
    uploaddata: null,
    isAuthorize: false,
    showrename: false,
    inputValue: null,
    showDelete:false,
    id:null,
    mp4logo: '../../images/upload/MP4logo.png',
    otherlogo: '../../images/upload/file-unknown.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let typeDB = 'users'
    if (options.title === "'图片'") {
      typeDB = 'picture'
    } else if (options.title === "'我的'") {
      typeDB = 'mine'
    } else if (options.title === "'收藏'") {
      typeDB = 'collection'
    } else {
      typeDB = 'video'
    }
    this.setData({
      title: options.title,
      type: typeDB
    })
    this.getCurrentPage()

    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success(res) {
              console.log(res);
              _this.setData({
                isAuthorize: true
              })
            }
          })
        }
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
    } else if (e.currentTarget.dataset.type.isVideo) {
      console.log('点击了视频');

    }

  },
  /**
   * 长按 
   */
  longPress(e) {
    let _this = this
    console.log(e);
    let typeDB = _this.data.type;
    let id = e.currentTarget.dataset.type._id
    let item = e.currentTarget.dataset.type
    wx.showActionSheet({
      itemList: ['保存到本地', '设为分享', '重命名', '删除'], //按钮的文字数组，数组长度最大为6个,
      itemColor: '#000000', //按钮的文字颜色,
      success: res => {
        console.log(res);

        if (res.tapIndex === 0) {
          //保存到本地
          if (item.isImg) {
            wx.cloud.downloadFile({
              fileID: item.pic,
              success(res) {
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success(saveres) {
                    console.log('保存成功', saveres);

                  },
                })
              }
            })
          } else if (item.isVideo) {
            wx.cloud.downloadFile({
              fileID: item.videoPic,
              success(res) {
                console.log(res);
                wx.saveVideoToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success(saveres) {
                    console.log('保存视频成功', saveres);
                  }
                })
              }
            })
          } else {

          }



          // if (_this.data.isAuthorize) {

          // } else {
          //   wx.showModal({
          //     title: '提示', //提示的标题,
          //     content: '您还没有同意授权,无法保存到本地相册,可在设置->授权管理中再次授权', //提示的内容,
          //   });
          // }

        } else if (res.tapIndex === 1) {
          //设为分享
          db.collection(typeDB).doc(id).update({
            data: {
              isShare: true
            },
            success(res) {
              console.log(res);
            }
          });

          _this.getCurrentPage();
          console.log(_this.data.uploaddata);

        } else if (res.tapIndex === 2) {
          //重命名
          _this.setData({
            showrename: true,
            id
          })
        } else if (res.tapIndex === 3) {
          //删除
          this.setData({
            showDelete: true,
            id
          })
        }
      }
    });
  },
  /**
   * 选择方法
   */
  chooseImage() {
    let _this = this
    let type = this.data.type;
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
            let fileID = res.fileID;
            db.collection(type).add({
              data: {
                pic: fileID,
                des: name,
                isImg: true,
                isShare: false
              },
              success() {
                wx.showToast({
                  title: '图片存储成功', //提示的内容,
                  icon: 'success', //图标,
                  duration: 2000, //延迟时间,
                  mask: true, //显示透明蒙层，防止触摸穿透,
                  success: res => {
                    _this.getCurrentPage()
                  },
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
    let type = this.data.type;
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
            let fileID = res.fileID;
            db.collection(type).add({
              data: {
                videoPic: fileID,
                des: name,
                isVideo: true,
                isShare: false
              },
              success() {
                wx.showToast({
                  title: '视频存储成功', //提示的内容,
                  icon: 'success', //图标,
                  duration: 2000, //延迟时间,
                  mask: true, //显示透明蒙层，防止触摸穿透,
                  success: res => {
                    _this.getCurrentPage()
                  },
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
   * 获取数据
   */
  getCurrentPage() {
    let typeDB = this.data.type;
    wx.cloud.callFunction({
      name: 'getFileList',
      data: {
        typeDB
      },
      complete: res => {
        this.setData({
          uploaddata: res.result.list
        })
      }
    })
  },
  /**
   * reName
   */
  reNameCancel() {
    this.setData({
      showrename: false
    })
  },
  reNameConfirm() {
    let inputValue = this.data.inputValue;
    let typeDB = this.data.type;
    let id = this.data.id
    db.collection(typeDB).doc(id).update({
      data: {
        des: inputValue
      },
      success(res) {
        console.log(res);
      }
    });
    this.getCurrentPage();
    this.setData({
      showrename: false
    })
  },
  setRenameValue(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  /**
   * delete
   */
  deleteCancel() {
  
    this.setData({
      showDelete:false
    })
  },
  deleteConfirm() {
    let _this = this
    let typeDB = this.data.type;
    let id = this.data.id
    db.collection(typeDB).doc(id).remove({
      success(res) {
        console.log(res);
        _this.getCurrentPage();
      },
      fail(e) {
        console.log(e);
      }
    })
   
    this.setData({
      showDelete: false
    })
  }
})