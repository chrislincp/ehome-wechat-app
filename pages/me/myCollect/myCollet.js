// pages/me/myCollect/myCollet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect: '',
    collectList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    let collect = wx.getStorageSync('collect')
    if (collect != this.data.collect) this.getCollect()
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

  getCollect () {
    let [collect, that] = [wx.getStorageSync('collect'), this]
    this.setData({
      collect
    })
    if (collect) {
      let host = "https://www.ehometd.com/"
      wx.request({
        url: `${host}api/wechat/getApi/getCollect.php`,
        data: {
          collect
        },
        success: function (res) {
          for (let i of res.data) if (i.urlimg.substring(0, 3) == 'img') i.urlimg = `${host}${i.urlimg}`
          that.setData({
            collectList: res.data
          })
        }
      })
    }else {
      this.setData({
        collectList: []
      })
    }
  }
})