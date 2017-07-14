// pages/orderparticulars/orderparticulars.js
Page({
  data: {
    upmore:true,    //查看全部已点餐品
  },

  onLoad: function (options) {
  
  },
  // 查看全部已点菜品
  upmore: function () {
    var that = this;
    that.setData({
      upmore: (!that.data.upmore)
    })
  },
  // 拨打电话
  call:function(){
    var that = this;
    wx.makePhoneCall({
      phoneNumber: '' //仅为示例，并非真实的电话号码
    })
  },
})