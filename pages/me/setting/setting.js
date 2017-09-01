// pages/me/setting/setting.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    avatar: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      user: app.globalData.user,
      avatar: app.globalData.avatar
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

  nameChange (e) {
    let user = this.data.user
    user.user = e.detail.value
    this.setData({
      user  
    })
  },
  maleSelect () {
    let user = this.data.user
    user.sex = 1
    this.setData({
      user
    })
  },
  femaleSelect() {
    let user = this.data.user
    user.sex = 0
    this.setData({
      user
    })
  },
  infoSubmit () {
    wx.showLoading({
      title: '加载中',
    })
    let user = this.data.user
    let host = "https://www.ehometd.com/"
    wx.request({
      url: `${host}api/wechat/user/editUser.php`,
      data: {
        user
      }, 
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        wx.setStorageSync('user', res.data)
        app.globalData.user = res.data
        app.globalData.login = true
        wx.hideLoading()
        wx.navigateBack({
          delta: 1
        })
      } 
    })
  }
})