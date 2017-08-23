// pages/mine/mine.js
var app = getApp();
Page({
  data: {
    userInfo:[], //个人信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // var userInfo = [];
    // wx.getStorage({
    //   key: 'userInfo',
    //   success: function (res) {  
    //     userInfo = res.data;
    //     // console.log(userInfo)
    //     that.setData({
    //       userInfo: userInfo,
    //     })
    //     var data = {};
    //     data.openid = app.globalData.openId;
    //     data.headImg = userInfo.avatarUrl;
    //     data.name = userInfo.nickName;
    //     console.log(data);
    //     that.mine(data);
    //   }
      
    // });
  },
  onShow:function(){
    var that = this;
    var userInfo = [];
    wx.getStorage({
        key: 'userInfo',
        success: function (res) {
            userInfo = res.data;
            // console.log(userInfo)
            that.setData({
                userInfo: userInfo,
            })
            var data = {};
            data.openid = app.globalData.openId;
            data.headImg = userInfo.avatarUrl;
            data.name = userInfo.nickName;
            console.log(data);
            that.mine(data);
        }

    });
  },
  mine:function(data){
    var that = this;
    wx.request({
      url: app.globalData.adminAddress + '/applet_customer/getCustomerInfo',
      data: data,
      method: "GET",
      // header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        wx.hideLoading();
        console.log(res)
        var personal = res.data.data  //声明获取到的数据
        if (personal.headImg == "" || personal.headImg == undefined){   //判断如果没有用户头像,用微信头像
          personal.headImg = data.headImg 
        } if (personal.name == '' || personal.name == undefined) {      //判断如果没有用户姓名,用微信姓名
          personal.name = data.name          
        }
        // that.setData({
        //   personal: res.data.data,
        // });
        app.globalData.personal = personal;
        that.setData({
          personal: app.globalData.personal,
        });
        
      },
      fail: function () {
        wx.showLoading('请求数据失败');
      }
    })
  }
  
})