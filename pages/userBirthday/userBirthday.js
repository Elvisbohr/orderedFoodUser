// pages/userBirthday/userBirthday.js
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
    var that = this;
    console.log(options.userBirthday)
    // 获取用户生日如果没有显示文字
    if (options.userBirthday == ""){
      console.log('未设置生日')
      that.setData({
        userBirthday: '请设置您的生日',
      })
    }else{
      that.setData({
        userBirthday: options.userBirthday,
      })
    }
   
  },
  // 设置生日加入接口
  bindBirthday: function (e) {
    this.setData({
      userBirthday: e.detail.value
    })
  },

  
})