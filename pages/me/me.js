// pages/me/me.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    user: {},
    avatar: '',
    nickName:'',
    showCode: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    if (app.globalData.user) {
      let user = Object.assign({}, app.globalData.user)
      user.tel = `${user.tel.substring(0, 3)}****${user.tel.substring(7)}`
      this.setData({
        isLogin: true,
        user,
        avatar: app.globalData.avatar,
        nickName: app.globalData.nickName
      })
      // if (this.data.user.position.includes('销售')) {
      //   this.setData({
      //     showCode: true
      //   })
      // }
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
    if (app.globalData.login == true) {
      this.onLoad()
      app.globalData.login = false
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
    if (!app.globalData.user) {
      wx.stopPullDownRefresh()
    } else {
      let id = app.globalData.user.ID
      let that = this
      wx.request({
        url: 'https://www.ehometd.com/api/wechat/user/getUserInfo.php',
        data: {
          id
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.stopPullDownRefresh()
          wx.setStorageSync('user', res.data)
          app.globalData.user = res.data
          app.globalData.login = true
          that.onLoad()
        }
      })
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  showMyCode() {
    let uid = this.data.user.ID
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: 'https://www.ehometd.com/api/wechat/wxcode/getMyCode.php',
      data: {
        path: `/pages/me/register/register?uid=${uid}`
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        let {code} = res.data
        if (code == 200) {
          wx.navigateTo({
            url: `/pages/me/myCode/myCode?uid=${uid}`
          })
        }
      }
    })
  },
  logout() {
    wx.showModal({
      title: '提示',
      content: '确认退出登录？',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('user')
          app.globalData.user = null
          wx.reLaunch({
            url: '/pages/me/me'
          })
        } else if (res.cancel) {

        }
      }
    })
  }
})