// pages/index/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 0,
    filterFixed: false,
    search: '',
    filter: [
      { name: '综合', ftype: 'all' },
      { name: '销量', ftype: 'sale' },
      { name: '新品', ftype: 'new' },
      { name: '价格', ftype: 'price' }
    ],
    filterSelect: 'all',
    searchButton: '取消',
    isSearch: false,
    searched: false,
    priceSort: 0,
    searchResult: [],
    page: 1,
    toTop: true,
    lock: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.search) {
      this.setData({
        search: options.search,
        searched: true
      })
      this.getResults(1)
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
  
  searchValue (e) {
    this.setData({
      search: e.detail.value
    })
    if (e.detail.value) {
      this.setData({
        isSearch: true,
        searchButton: '搜索'
      })
    }else {
      this.setData({
        isSearch: false,
        searchButton: '取消'
      })
    }
  },
  search () {
    this.setData({
      searched: true
    })
    this.getResults(1)
  },
  back () {
    wx.navigateBack()
  },
  getResults(page,sort) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var [that, search, filterSelect, sort] = [this, this.data.search, this.data.filterSelect, sort]
    if (!sort) sort = 0

    // let host = "http://localhost/"
    let host = "https://www.ehometd.com/"
    if (search) {
      wx.setNavigationBarTitle({
        title: search
      })
      wx.request({
        url: `${host}api/wechat/getApi/search.php`,
        data: {
          page,
          search,
          filterSelect,
          sort
        },
        success: function (res) {
          setTimeout(() => {
            if (res.data.length > 0) {
              for (let i of res.data) if (i.urlimg.substring(0, 3) == 'img') i.urlimg = `${host}${i.urlimg}`
              let list = that.data.searchResult
              let searchResult = page == 1 ? res.data : list.concat(res.data)
              that.setData({
                searchResult,
                lock: false
              })
              wx.hideLoading()
            } else {
              if (page == 1) {
                that.setData({
                  searchResult: []
                })
                wx.showToast({
                  title: '无相关商品'
                })
              } else {
                wx.showToast({
                  title: '无更多商品'
                })
              }

            }
          }, 500)
        }
      })
    }else {
      wx.showToast({
        title: '输入要查询的商品',
      })
    }
    
  },
  filterChange (e) {
    if (this.data.filterSelect != e.currentTarget.dataset.filter) {
      this.setData({
        filterSelect: e.currentTarget.dataset.filter,
        priceSort: 0,
        scrollTop: 41
      })
      this.getResults(1)   
    } else if (this.data.filterSelect == e.currentTarget.dataset.filter && this.data.filterSelect == 'price') {
      if (this.data.priceSort == 0) this.setData({priceSort: 1})
      else this.setData({priceSort: 0})

      this.getResults(1, this.data.priceSort)
    }
    
  },
  imageReady() {
    
  },
  scroll (e) {
    // 导航固定
    if (e.detail.scrollTop >= 41) this.setData({ filterFixed: true })
    else this.setData({ filterFixed: false })
    // 显示回到顶部
    if (e.detail.scrollTop > 300) this.setData({ toTop: false })
    else this.setData({ toTop: true })
  },
  scrollBottomLoad() {
    if (!this.data.lock) {
      let page = this.data.page += 1
      this.setData({
        page,
        lock: true
      })
      this.getResults(page)
    }
  },
  toTop(e) {
    this.setData({
      scrollTop: 0
    })
  },
  showItem(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/index/detail/detail?id=${id}`
    })
  }
})