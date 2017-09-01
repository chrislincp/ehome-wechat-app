var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    products: [],
    page: 1,
    scrollTop: 0,
    toTop: true,
    lock: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHotProducts(1)
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
  getHotProducts (page) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this
    // let host = "http://localhost/"
    let host = "https://www.ehometd.com/"
    wx.request({
      url: `${host}api/wechat/getApi/getHotProducts.php`,
      data: {
        page
      },
      success: function (res) {
        setTimeout(() => {
          if (res.data.length > 0) {
            for (let i of res.data) if (i.urlimg.substring(0, 3) == 'img') i.urlimg = `${host}${i.urlimg}`
            let list = that.data.products
            let products = page == 1 ? res.data : list.concat(res.data)
            that.setData({
              products,
              lock: false
            })
          } else {
            wx.showToast({
              title: '无更多商品'
            })
          } 
        }, 500)     
      }
    })
  },
  imageReady () {
    wx.hideLoading()
  },
  scroll (e) {
    if (e.detail.scrollTop > 300) {
      this.setData({
        toTop: false
      })
    }else {
      this.setData({
        toTop: true
      })
    }
  },
  scrollBottomLoad () {
    if (!this.data.lock) {
      let page = this.data.page += 1
      this.setData({
        page,
        lock: true
      })
      this.getHotProducts(page)  
    }
  },
  toTop (e) {
    this.setData({
      scrollTop: 0
    })
  },
  showItem (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/index/detail/detail?id=${id}`
    })
  }
})