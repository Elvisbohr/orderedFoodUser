// pages/userName/userName.js
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
    console.log(options.userName)
    var that = this;
    that.setData({
      userName:options.userName,
    })
  },
  userName:function(e){
    var that = this;
    console.log(e)
    var userName = e.detail.value;
    that.setData({
      userName: userName,
    })
    console.log(that.data.userName)
  },
  clear:function(){  //清空输入空内容
    var that = this;
    var userName = that.data.userName;
    that.setData({
      userName:''
    })
  },


  
})