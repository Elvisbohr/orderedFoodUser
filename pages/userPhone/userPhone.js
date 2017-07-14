// pages/userPhone/userPhone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  onLoad: function (options) {
    console.log(options.userPhone)
    var that = this;
    if (options.userPhone == ''){
      that.setData({
        userPhone: '',
      })
    }else{
      that.setData({
        userPhone: options.userPhone,
      })
    }
    
  },
  userPhone: function (e) {
    var that = this;
    console.log(e)
    var userPhone = e.detail.value;
    that.setData({
      userPhone: userPhone,
    })
    console.log(that.data.userPhone)
  },
  clear: function () {  //清空输入空内容
    var that = this;
    var userPhone = that.data.userPhone;
    that.setData({
      userPhone: ''
    })
  },
})