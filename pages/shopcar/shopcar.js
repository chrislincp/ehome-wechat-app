// pages/shopcar/shopcar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopcarList: [],
    total: 0,
    selectAll: false,
    isLogin: false,
    shopList: ''
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
    var [user, shopcar] = [wx.getStorageSync('user') || null, wx.getStorageSync('shopcar')]
    if (user) {
      this.setData({ isLogin: true })
      if (shopcar != this.data.shopList) this.getShopCar()
    }
    else this.setData({ isLogin: false })
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

  getShopCar() {
    let shopcar = wx.getStorageSync('shopcar')
    this.setData({
      shopList: shopcar
    })
    // let host = 'http://localhost/'
    let host = "https://www.ehometd.com/"
    let that = this
    if (shopcar) {
      wx.request({
        url: `${host}api/wechat/getApi/getShopCar.php`,
        data: {
          sid: shopcar
        },
        success: function (res) {
          let [selectShop, total, selectAll] = [wx.getStorageSync('selectShop'), 0, false]
          for (let i of res.data.list) {
            if (i.urlimg.substring(0, 3) == 'img') i.urlimg = `${host}${i.urlimg}`
            if (selectShop.includes(i.ID)) {
              i.select = true
              total += i.totalPrice
            }else i.select = false       
          }
          if (res.data.list.length == selectShop.split(';').length && selectShop != '') selectAll = true 
          else selectAll = false     
          that.setData({
            shopcarList: res.data.list,
            total,
            selectAll
          })
        }
      })
    } else {
      that.setData({
        shopcarList: [],
        total: 0
      })
    }

  },
  selectShop(e) {
    let [id, arr, selectShop] = [e.currentTarget.dataset.id, this.data.shopcarList, wx.getStorageSync('selectShop')]
    if (selectShop == '') selectShop = []
    else selectShop = selectShop.split(';')
    for (let i of arr) {
      if (i.ID == id) {
        i.select = !i.select
        if (i.select) {
          selectShop.push(i.ID)
          wx.setStorageSync('selectShop', selectShop.join(';'))
          let selectAll = false
          if (selectShop.length == arr.length) selectAll = true
          else selectAll = false
          this.setData({
            shopcarList: arr,
            total: this.data.total + i.totalPrice,
            selectAll
          })
        }
        else {
          this.setData({
            shopcarList: arr,
            total: this.data.total - i.totalPrice,
            selectAll: false
          })
          selectShop.splice(selectShop.indexOf(i.ID), 1)
          wx.setStorageSync('selectShop', selectShop.join(';'))
        }
      }
    }
  },
  decrease(e) {
    let [id, shopcar] = [e.currentTarget.dataset.id, wx.getStorageSync('shopcar').split(';')]
    shopcar.splice(shopcar.indexOf(id), 1)
    wx.setStorageSync('shopcar', shopcar.join(';'))
    // this.getShopCar()
    let arr = this.data.shopcarList
    for (let i of arr) {
      if (i.ID == id) {
        i.num -= 1
        i.totalPrice = i.totalPrice - (i.price - 0)
        this.setData({
          shopcarList: arr
        })
        if (i.select) {
          this.setData({
            total: this.data.total - (i.price - 0)
          })
        }
      }
    }
  },
  increase(e) {
    let [id, shopcar] = [e.currentTarget.dataset.id, wx.getStorageSync('shopcar').split(';')]
    shopcar.push(id)
    wx.setStorageSync('shopcar', shopcar.join(';'))
    let arr = this.data.shopcarList
    for (let i of arr) {
      if (i.ID == id) {
        i.num = i.num - 0 + 1
        i.totalPrice = i.totalPrice + (i.price - 0)
        this.setData({
          shopcarList: arr
        })
        if (i.select) {
          this.setData({
            total: this.data.total + (i.price - 0)
          })
        }
      }
    }
  },
  deleteItem(e) {
    let id = e.currentTarget.dataset.id
    let that = this
    wx.showModal({
      title: '提示',
      content: '确认删除该产品？',
      success: function (res) {
        if (res.confirm) {
          let [shopcar, selectShop, arr] = [wx.getStorageSync('shopcar').split(';'), wx.getStorageSync('selectShop').split(';'), []]
          for (let i of shopcar) if (i != id) arr.push(i)
          selectShop.splice(selectShop.indexOf(id), 1)
          wx.setStorageSync('shopcar', arr.join(';'))
          wx.setStorageSync('selectShop', selectShop.join(';'))
          that.getShopCar()
          arr.length == 0 ? that.setData({selectAll: false}) : ''
        } else if (res.cancel) {
          
        }
      }
    })
  },
  // touchstart(e) {
  //   this.setData({
  //     touchX: e.changedTouches[0].pageX
  //   })
  // },
  // touchmove(e) {

  // },
  // touchend(e) {
  //   if (e.changedTouches[0].pageX < this.data.touchX) {
  //     this.setData({
  //       left: '-60px'
  //     })
  //   }
  // },
  selectAll () {
    if (this.data.shopcarList.length == 0) {
      wx.showToast({
        title: '暂无商品',
      })
    }else {
      this.setData({
        selectAll: !this.data.selectAll
      })
      let [arr, list] = [[], this.data.shopcarList]
      if (this.data.selectAll) {
        let total = 0
        for (let i of list) {
          arr.push(i.ID)
          i.select = true
          total += i.totalPrice
        }
        this.setData({
          shopcarList: list,
          total
        })
      } else {
        for (let i of list) i.select = false
        this.setData({
          shopcarList: list,
          total: 0
        })
      }
      wx.setStorageSync('selectShop', arr.join(';'))
    }
  },
  goTocheckout() {
    let arr = []
    for (let i of this.data.shopcarList) if (i.select) arr.push(i)
    console.log(arr)
  },
})