// pages/mine/mine.js
Page({
  data: {
    userInfo:[], //个人信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var userInfo = [];
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {  
        userInfo = res.data;
        console.log(userInfo)
        that.setData({
          userInfo: userInfo,
        })
      }
    })
   
  },

  
})