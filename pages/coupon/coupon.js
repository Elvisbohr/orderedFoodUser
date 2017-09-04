// pages/coupon/coupon.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
    var myCouponsData = [];
     myCouponsData.openid = app.globalData.openId;
     that.myCoupons(myCouponsData)
  },
  myCoupons:function(data){
    var that = this;
    wx.request({
      url: app.globalData.adminAddress + '/applet_customer/myCoupons',
      data: data,
      method: "GET",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log('查看可用代金券')
        console.log(res)
        that.setData({
          myCoupons:res.data.data
        })
      },
      fail: function () {
        wx.showLoading('请求数据失败');
      }
    })
  }

})