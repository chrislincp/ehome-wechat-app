var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    telVal: '',
    telFocus: true,
    identifyVal: '',
    identify: '发送验证码',
    identifyCode: '',
    disabled: false,
    time: 30,
    submitDisabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.uid) {
      this.setData({
        uid: options.uid
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


  sendIdentifyCode () {
    // 检验手机号是否合法
    let tel = this.data.telVal
    // 请求获取验证码并发送给用户
    if (!tel || tel.length != 11) {
      wx.showToast({
        title: '请输入手机号'
      })
    }else {
      wx.showLoading({
        title: '获取中',
        mask: true
      })
      var that = this
      wx.request({
        url: 'https://www.ehometd.com/api/wechat/msg/industrySMS.php',
        data: {
          tel
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
          
        },
        success: function (res) {
          wx.hideLoading()
          if (res.data.result.respCode == "00025") {
            wx.showToast({
              title: '号码不存在',
            })
          } else if (res.data.result.respCode == '00000') {
            that.setData({
              identifyCode: res.data.identifyCode
            })
            wx.showToast({
              title: '已发送',
              icon: 'success'
            })
            that.countDown()
          }else {
            wx.showToast({
              title: '发送验证码失败',
            })
          }
        }
      })
    }
  },
  countDown () {
    var time = this.data.time
    if (time == 0) {
      this.setData({
        identify: '重新获取',
        disabled: false
      })
      this.setData({ time: 30 })
    } else {
      this.setData({ disabled: true })
      time--;
      this.setData({
        identify: `已发送(${time}s)`,
        time
      })
      setTimeout(() => {
        this.countDown()
      }, 1000)
    }
  },
  submit (e) {
    let [tel, ideCode, uid] = [this.data.telVal, this.data.identifyVal, this.data.uid]
    // 确认提交
    // success
    if (!tel || tel.length != 11) {
      wx.showToast({
        title: '手机号错误'
      })
    }else if (!ideCode || ideCode != this.data.identifyCode) {
      wx.showToast({
        title: '验证码错误'
      })
    }else {
      this.setData({ submitDisabled: true })
      wx.showLoading({
        title: '登录中',
        mask: true
      })
      // 发送请求 成功后跳转到个人中心
      wx.request({
        url: 'https://www.ehometd.com/api/wechat/login/login.php',
        data: {
          tel,
          uid
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.setStorageSync('user', res.data)
          app.globalData.user = res.data
          app.globalData.login = true
          wx.hideLoading()
          wx.switchTab({
            url: '/pages/me/me',
          })
        }
      })
    }    
  },
  telValue (e) {
    let telVal = e.detail.value
    this.setData({ telVal })
    if (telVal.length == 11) {
      this.setData({ telFocus: false }) 
    }
  },
  identifyValue (e) {
    let identifyVal = e.detail.value
    this.setData({ identifyVal })
  }
})