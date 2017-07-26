//index.js
//获取应用实例
var app = getApp()
var amapFile = require('../../utils/amap-wx.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
Page({
  data: {
    mainHieght:'',  //商铺列表的高度
    city: '',
    bannerUrls: [//轮播
      '../../images/indexBanner0.jpg',
      '../../images/indexBanner1.jpg',
      '../../images/indexBanner2.jpg'
    ],
  },
  city: function (e) {
    wx.redirectTo({
      url: '../switchcity/switchcity',
    });
  },
 

  // 获取当前城市位置与点击选取城市
  getCoordinates: function (options) {
    console.log(options)
    if (options.city) {
      var data = {};
      data.city = options.city;
      this.setData(data);
    } else {
      var myAmapFun = new amapFile.AMapWX({ key: app.globalData.gdxcxKey });
      var that = this;
      myAmapFun.getRegeo({
        success: function (res) {
          console.log('获取当前位置')
          var data = {};
          if (options.city) {
            data.city = options.city;
            that.setData({
              'city': options.city
            });
          } else {
            that.setData({
              'city': res[0].regeocodeData.addressComponent.city
            });
            data.lat = res[0].latitude;
            data.lon = res[0].longitude;
          }
          //成功回调
          that.setData(data);
        },
        fail: function (info) {
          wx.showToast({
            title: '网络错误',
          });
        }
      });
    }
  },
  onLoad: function (options) {
    console.log('onLoad')
    var that = this;
    console.log(options)
    that.getCoordinates(options);
     //获取手机信息(宽高等)
    wx.getSystemInfo({ 
      success: function (res) {
        console.log(res)
        that.setData({
          mainHieght: res.windowHeight - 250,
        });
        console.log(that.data.mainHieght)
      }
    });
    
  },
  onShow:function(){
  

  },
  onHide: function () {
    var i=0;
    setInterval(function () {
      i++;
      wx.setTopBarText({
        text: "aaaa"+i,
        success: function (res) {
          console.log(res);
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 1000);
     
  },
})
