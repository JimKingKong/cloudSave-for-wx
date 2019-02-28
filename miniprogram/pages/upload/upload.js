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
    showreDir: false,
    inputValue: null,
    showDelete: false,
    //文件夹操作
    isDir: false,
    currentDirNum: null,
    currentDir: null,
    currentItem: null,
    dirItemNum: null,

    id: null,
    item: null,
    mp4logo: '../../images/upload/MP4logo.png',
    otherlogo: '../../images/upload/folder.png'
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
    if (this.data.type === "mine" && this.isDir) {
      this.getCurrentFile()
    } else {
      this.getCurrentPage()
    }

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
    let _this = this;
    if (this.data.title === "'图片'") {
      //图片模块
      this.chooseImage()
    } else if (this.data.title === "'视频'") {
      //视频模块
      this.chooseVideo()
    } else if (this.data.title === "'我的'") {
      //我的模块
      if (this.data.isDir) {
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
      } else {
        this.setData({
          showreDir: true
        })
      }
    } else {
      //收藏模块
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
    let _this = this
    console.log(e.currentTarget.dataset.type);
    let currentIndex = e.currentTarget.id
    if (e.currentTarget.dataset.type.isImg) {
      wx.previewImage({
        urls: [this.data.uploaddata[currentIndex].pic] //需要预览的图片链接列表,
      });
    } else if (e.currentTarget.dataset.type.isVideo) {
      let videoLink = e.currentTarget.dataset.type.videoPic;
      _this.changeVideoLink(videoLink).then(res => {
        console.log(res);
        let realUrl = res.fileList[0].tempFileURL
        wx.navigateTo({
          url: '../watchvideo/watchvideo?link=' + realUrl
        });
      }).catch(error => {
        wx.showToast({
          title: '请求失败,请检查网络', //提示的内容,
          icon: 'loading', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
        console.log(error);
      })
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
    if (typeDB == 'mine') {
      console.log(1);
      wx.showActionSheet({
        itemList: ['删除文件夹'], //按钮的文字数组，数组长度最大为6个,
        itemColor: '#000000', //按钮的文字颜色,
        success: res => {
          if (res.tapIndex === 0) {
            this.setData({
              showDelete: true,
              id,
              item
            })
          }
        }
      });
    } else {
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
                      wx.showToast({
                        title: '保存成功', //提示的内容,
                        icon: 'success', //图标,
                        duration: 2000, //延迟时间,
                        mask: true, //显示透明蒙层，防止触摸穿透,
                        success: res => {}
                      });
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
              })
            } else {

            }

          } else if (res.tapIndex === 1) {
            //设为分享
            db.collection(typeDB).doc(id).update({
              data: {
                isShare: true
              },
              success(res) {
                console.log(res);
                wx.showToast({
                  title: '设置成功', //提示的内容,
                  icon: 'success', //图标,
                  duration: 2000, //延迟时间,
                  mask: true, //显示透明蒙层，防止触摸穿透,
                  success: res => {}
                });
              }
            });

            _this.getCurrentPage();

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
              id,
              item
            })
          }
        }
      });
    }
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
            if (_this.data.isDir) {
              let currentDirData = {
                pic: fileID,
                from: type,
                fromId:_this.data.currentDir._id,
                des: name,
                isImg: true,
                isShare: false,
                time: name
              }
              let tempArr = _this.data.currentDir.dirData
              tempArr.push(currentDirData)
              console.log(type, _this.data.currentDir._id);
              db.collection(type).doc(_this.data.currentDir._id).update({
                data: {
                  dirData: tempArr
                },
                success(res) {
                  console.log(res);
                  wx.showToast({
                    title: '图片存储成功', //提示的内容,
                    icon: 'success', //图标,
                    duration: 2000, //延迟时间,
                    mask: true, //显示透明蒙层，防止触摸穿透,
                    success: res => {
                      _this.getCurrentFile()
                    },
                    fail() {
                      wx.showToast({
                        title: '图片存储失败', //提示的内容,
                        icon: 'loading', //图标,
                        duration: 2000, //延迟时间,
                        mask: true, //显示透明蒙层，防止触摸穿透,
                      });
                    }
                  });
                }
              })
            } else {
              db.collection(type).add({
                data: {
                  pic: fileID,
                  from: type,
                  des: name,
                  isImg: true,
                  isShare: false,
                  time: name
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
                        icon: 'loading', //图标,
                        duration: 2000, //延迟时间,
                        mask: true, //显示透明蒙层，防止触摸穿透,

                      });
                    }
                  });
                }
              })
            }
          },
          fail: error => {
            console.log('[上传图片] 失败：', error);
            wx.showToast({
              title: '上传失败,请检查网络',
              icon: 'loading', //图标,
              duration: 2000, //延迟时间,
              mask: true, //显示透明蒙层，防止触摸穿透,
            })
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
            if (_this.data.isDir) {
              let currentDirData = {
                videoPic: fileID,
                from: type,
                des: name,
                isVideo: true,
                isShare: false,
                time: name
              }
              let tempArr = _this.data.currentDir.dirData
              tempArr.push(currentDirData)
              console.log(type, _this.data.currentDir._id);
              db.collection(type).doc(_this.data.currentDir._id).update({
                data: {
                  dirData: tempArr
                },
                success(res) {
                  console.log(res);
                  wx.showToast({
                    title: '视频存储成功', //提示的内容,
                    icon: 'success', //图标,
                    duration: 2000, //延迟时间,
                    mask: true, //显示透明蒙层，防止触摸穿透,
                    success: res => {
                      _this.getCurrentFile()
                    },
                    fail() {
                      wx.showToast({
                        title: '视频存储失败', //提示的内容,
                        icon: 'loading', //图标,
                        duration: 2000, //延迟时间,
                        mask: true, //显示透明蒙层，防止触摸穿透,
                      });
                    }
                  });
                }
              })
            } else {
              db.collection(type).add({
                data: {
                  videoPic: fileID,
                  from: type,
                  des: name,
                  isVideo: true,
                  isShare: false,
                  time: name
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
                        icon: 'loading', //图标,
                        duration: 2000, //延迟时间,
                        mask: true, //显示透明蒙层，防止触摸穿透,

                      });
                    }
                  });
                }
              })
            }
          }
        })
      }
    })
  },
  /**
   * 拿到当前文件夹的文件
   */
  getCurrentFile() {
    let typeDB = this.data.type;
    let currentDirNum = this.data.currentDirNum
    wx.cloud.callFunction({
      name: 'getFileList',
      data: {
        typeDB
      },
      success: res => {
        this.setData({
          currentDir: res.result.list[currentDirNum]
        })
        console.log(this.data.currentDir);
      },
      fail: e => {
        console.log(e)
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
      success: res => {
        this.setData({
          uploaddata: res.result.list
        })
        console.log(this.data.uploaddata);

      },
      fail: e => {
        console.log(e)
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
    let _this = this
    let inputValue = this.data.inputValue;
    if (this.commonConfirm('文件名不能为空', inputValue)) return
    let typeDB = this.data.type;
    let id = this.data.id
    //文件夹内重命名
    if (typeDB === "mine") {
      let totalData = this.data.currentDir.dirData;
      totalData[this.data.dirItemNum].des = inputValue
      db.collection(typeDB).doc(id).update({
        data: {
          dirData: totalData
        },
        success(res) {
          console.log(res);
          wx.showToast({
            title: '设置成功', //提示的内容,
            icon: 'success', //图标,
            duration: 2000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
          });
        }
      });
      _this.getCurrentFile();
    } else {
      //外部重命名
      db.collection(typeDB).doc(id).update({
        data: {
          des: inputValue
        },
        success(res) {
          console.log(res);
        }
      });
      this.getCurrentPage();
    }
    this.setData({
      showrename: false,
      inputValue: null
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
      showDelete: false
    })
  },
  deleteConfirm() {
    let _this = this
    let typeDB = this.data.type;
    let id = this.data.id
    if (typeDB === "mine" && this.data.isDir) {
      let totalData = this.data.currentDir.dirData;
      totalData.splice(this.data.dirItemNum, 1)
      db.collection(typeDB).doc(id).update({
        data: {
          dirData: totalData
        },
        success(res) {
          console.log(res);
          wx.showToast({
            title: '删除成功', //提示的内容,
            icon: 'success', //图标,
            duration: 2000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success() {
              _this.getCurrentFile()
            }
          });
        }
      });
 
    } else {
      db.collection(typeDB).doc(id).remove({
        success(res) {
          console.log(res);
          wx.showToast({
            title: '删除成功', //提示的内容,
            icon: 'success', //图标,
            duration: 2000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: res => {
              _this.getCurrentPage();
            }
          });

        },
        fail(e) {
          console.log(e);
        }
      })
    }

    this.setData({
      showDelete: false
    })
  },
  // 文件
  /**
   * changeVideoLink(转换视频为http链接)
   */
  changeVideoLink(cloudLink) {
    return new Promise((resolve, reject) => {
      wx.cloud.getTempFileURL({
        fileList: [{
          fileID: cloudLink
        }],
        success: res => {
          console.log(res);
          resolve(res)
        },
        fail: error => {
          reject(error)
        }
      })
    })
  },
  //文件夹
  dirCancel() {
    this.setData({
      showreDir: false
    })
  },
  dirConfirm() {
    let typeDB = this.data.type;
    let inputValue = this.data.inputValue;
    if (this.commonConfirm('文件名不能为空', inputValue)) return
    db.collection(typeDB).add({
      data: {
        des: inputValue,
        dirData: []
      },
      success(res) {
        wx.showToast({
          title: '创建成功', //提示的内容,
          icon: 'success', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
      }
    });
    this.getCurrentPage();
    this.setData({
      showreDir: false
    })
  },
  // 我的文件夹点击
  mineClick(e) {
    //显示路径
    this.setData({
      isDir: true,
      currentDirNum: e.currentTarget.id
    })
    this.getCurrentFile()
  },
  // 回退到文件夹
  BackToDir() {
    this.setData({
      isDir: false
    })
  },
  commonConfirm(tips, inputValue) {
    if (inputValue === null || inputValue.trim().length == 0) {
      wx.showToast({
        title: tips, //提示的内容,
        icon: 'loading', //图标,
        duration: 2000, //延迟时间,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
      return true
    }
  },
  dirPress(e) {
    let _this = this

    console.log(e);

    let typeDB = _this.data.type;
    let totalData = this.data.currentDir.dirData;
    let id = this.data.currentDir._id

    let itemNum = e.currentTarget.id
    let item = e.currentTarget.dataset.type

    console.log(id, itemNum, item, totalData);

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
                    wx.showToast({
                      title: '保存成功', //提示的内容,
                      icon: 'success', //图标,
                      duration: 2000, //延迟时间,
                      mask: true, //显示透明蒙层，防止触摸穿透,
                      success: res => {}
                    });
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
            })
          }
        } else if (res.tapIndex === 1) {
          //设为分享
          totalData[itemNum].isShare = true
          db.collection(typeDB).doc(id).update({
            data: {
              dirData: totalData
            },
            success(res) {
              console.log(res);
              wx.showToast({
                title: '设置成功', //提示的内容,
                icon: 'success', //图标,
                duration: 2000, //延迟时间,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {}
              });
            }
          });

          _this.getCurrentFile();

        } else if (res.tapIndex === 2) {
          //重命名
          _this.setData({
            showrename: true,
            id,
            dirItemNum: itemNum
          })
        } else if (res.tapIndex === 3) {
          //删除
          this.setData({
            showDelete: true,
            id,
            currentItem: item,
            dirItemNum: itemNum
          })
        }
      }
    });

  },

})