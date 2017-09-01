//app.js
App({
  onLaunch: function (cb) {
    //调用API从本地缓存中获取数据
    var user = wx.getStorageSync('user') || null
    if (user)  this.globalData.user = user
    this.login()
    // 获取登录信息
    wx.checkSession({
      success: function () {
        console.log('login success')
      },
      fail: function () {
        this.login()
      }
    })
  },
  onShow: function (options) {

  },
  onHide: function () {
    
  },
  login () {
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: 'https://www.ehometd.com/api/wechat/login/getOpenId.php',
            data: {
              code: res.code
            },
            success(res) {
              that.globalData.openid = res.data.openid
              console.log(that.globalData)
            }
          })
        }
        wx.getUserInfo({
          success: function (res) {
            that.globalData.avatar = res.userInfo.avatarUrl
          },
          fail: function (res) {
            // app.globalData.avatar = `https://www.ehometd.com/Avatar/${user.ID}/avatar.jpg`
          }
        })
      }
    })
  },
  globalData:{
    user:null,
    login: false,
    avatar: '',
    openid: ''
  }
})