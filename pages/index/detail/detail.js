// pages/index/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    products: [],
    imgList: [],
    productSelected: {},
    selectIndex: 0,
    selectNum: 1,
    shopCarNum: 0,
    isCollected: false,
    isLogin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var user = wx.getStorageSync('user') || null
    if (user) this.setData({ isLogin: true })
    else this.setData({ isLogin: false })
    if (this.data.isLogin) this.colAndShop(options.id)
    this.getProductInfo(options.id)
    // setTimeout(() => {
    //   this.getProductInfo()
    // }, 500)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // setTimeout(() => {
    //   if (this.data.imgList.length == 0) {
    //     wx.hideLoading()
    //     wx.showToast({
    //       title: '暂无图片',
    //     })
    //   }
    // }, 1500)
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
  colAndShop (id) {
    let [collect, isCollected] = [wx.getStorageSync('collect'), false]
    if (collect.includes(id)) isCollected = true
    else isCollected = false
    let shopcar = wx.getStorageSync('shopcar')
    if (shopcar) shopcar = shopcar.split(';').length
    else shopcar = 0
    this.setData({
      isCollected,
      shopCarNum: shopcar
    })
  },
  getProductInfo (id) {  
    let that = this
    // let host = 'http://localhost/'
    let host = "https://www.ehometd.com/"
    wx.request({
      url: `${host}/api/wechat/getApi/getProductInfo.php`,
      data: {
        id
      },
      success: function (res) {
        that.setData({
          products: res.data.products,
          imgList: res.data.pic,
          productSelected: res.data.products[0]
        })
      }
    })
  },
  showToLogin () {
    wx.showToast({
      title: '请先登录',
    })
  },
  showImage (e) {
    let arr = []
    for (let i of this.data.imgList) arr.push(i.photo_url)
    let index = e.currentTarget.dataset.i
    wx.previewImage({
      current: arr[index],
      urls:arr
    })
  },
  imageReady (e) {
    // wx.hideLoading()
  },
  changeSelect (e) {
    let selectIndex = e.currentTarget.dataset.index
    let productSelected = this.data.products[selectIndex]
    this.setData({
      selectIndex,
      productSelected
    })
  },
  decrease () {
    let num = this.data.selectNum -= 1
    this.setData({
      selectNum: num
    })
  },
  increase () {
    let num = this.data.selectNum += 1
    this.setData({
      selectNum: num
    })
  },
  checkNum (e) {
    if (e.detail.value == '' || e.detail.value == '0') {
      this.setData({
        selectNum: 1
      })
    }
  },
  numInput (e) {
  this.setData({
    selectNum: e.detail.value
  })
  },
  intoShopCar () {
    let arr = []
    for (let i = 0; i < this.data.selectNum; i++) arr.push(this.data.productSelected.ID)
    let shopcar = wx.getStorageSync('shopcar')
    if (shopcar) arr = shopcar.split(';').concat(arr)
    shopcar = arr.join(';')
    wx.setStorageSync('shopcar', shopcar)
    this.setData({
      shopCarNum: arr.length
    })
    wx.showToast({
      title: '添加成功',
    })
  },
  collected () {
    if (!this.data.isCollected) {
      let collect = wx.getStorageSync('collect')
      if (collect) {
        let arr = collect.split(';')
        arr.push(this.data.productSelected.ID)
        let newCollect = arr.join(';')
        wx.setStorageSync('collect', newCollect)
      }else {
        wx.setStorageSync('collect', this.data.productSelected.ID)
      }
      this.setData({
        isCollected: true
      })
    }else {
      let collect = wx.getStorageSync('collect')
      let arr = collect.split(';')
      let index = arr.indexOf(this.data.productSelected.ID)
      arr.splice(index, 1)
      let newCollect = arr.join(';')
      wx.setStorageSync('collect', newCollect)
      this.setData({
        isCollected: false
      })
    }
    if (this.data.isCollected) {
      wx.showToast({
        title: '收藏成功',
      })
    } else {
      wx.showToast({
        title: '取消收藏',
      })
    }
  },
  goToShopcar () {
    wx.switchTab({
      url: '/pages/shopcar/shopcar'
    })
  }
})