// pages/index/classify/classify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSelect: 0,
    classify: [
      { id: 0, title: '热门推荐', list: [{title: '床'}, {title: '椅子'}, {title: '其他'}] },
      { id: 1, title: '床' },
      { id: 2, title: '柜类' },
      { id: 3, title: '沙发' },
      { id: 4, title: '桌' },
      { id: 5, title: '椅' },
      { id: 6, title: '架' },
      { id: 7, title: '凳' },
      { id: 8, title: '几' },
      { id: 9, title: '台' }
    ]
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

  selected (e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      isSelect: id
    })
  }
})