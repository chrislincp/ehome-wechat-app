// pages/me/myClient/myClient.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    myClient: [],
    searchClient: [],
    searchValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uid: app.globalData.user.ID
    })
    this.getMyClient()
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
    // this.getMyClient()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  
  getMyClient () {
    var that = this
    // let host = 'http://localhost/'
    let host = "https://www.ehometd.com/"
    wx.request({
      url: `${host}api/wechat/getApi/getMyClient.php`,
      data: {
        uid: this.data.uid
      },
      success: function (res) {
        that.setData({
          myClient: res.data,
          searchClient: res.data
        })
      }
    })
  },
  searchInput (e) {
    if (e.detail.value) {
      var arr = []
      for (let i of this.data.searchClient) {
        if (i.user.includes(e.detail.value) || i.tel.includes(e.detail.value)) {
          arr.push(i)
        }
      }
      this.setData({
        searchValue: e.detail.value,
        myClient: arr
      })
    }else {
      this.setData({
        searchValue: '',
        myClient: this.data.searchClient
      })
    }
  },
  call (e) {
    let tel = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: tel,
    })
  }
})