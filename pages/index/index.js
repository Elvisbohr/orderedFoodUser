//获取应用实例
var app = getApp()
var amapFile = require('../../utils/amap-wx.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
//index.js
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
    console.log(options.city)
    if (options.city) {
      var data = {};
      data.city = options.city;
      this.setData(data);
      this.isOpenid(data);
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
            app.globalData.lat = res[0].latitude
            app.globalData.lon = res[0].longitude
          }
          //成功回调
          that.setData(data);
          that.isOpenid(data);
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
    console.log(options.city)
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
  /**
   * 判断openid是否存在
   */
  isOpenid: function (data) {
    console.log('判断openid是否存在');
    var that = this;
    wx.getStorage({
      key: 'user',
      success: function (res) {
        that.setData({
          openId: res.data.openid
        });
        app.globalData.openId = res.data.openid;
        data.openid = res.data.openid;
        that.getMerchantList(data);
      },
      fail: function () {
        wx.login({
          success: function (res) {
            if (res.code) {
              var d = app.globalData;//这里存储了appid、secret、token串    
              var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d.appid + '&secret=' + d.secret + '&js_code=' + res.code + '&grant_type=authorization_code';
              wx.request({
                url: l,
                data: {},
                method: 'GET',
                success: function (res) {
                  var obj = {};
                  obj.openid = res.data.openid;
                  obj.expires_in = Date.now() + res.data.expires_in;
                  wx.setStorageSync('user', obj);//存储openid    

                  data.openid = obj.openid;
                  that.getMerchantList(data);
                }
              });
            } else {
              console.log('获取用户登录态失败！' + res.errMsg);
            }
          }
        });
      }
    })
  },
  getMerchantList: function (data) {
    console.log('商戶列表接口數據');
    var that = this;
    wx.request({
      url: app.globalData.adminAddress + '/applet_customer/fjshoplist',
      data: data,
      method: "GET",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        wx.hideLoading();
        console.log(res)
        that.setData({
          merchants: res.data.data,
        });
      },
      fail: function () {
        wx.showLoading('请求数据失败');
      }
    })
  },
  //搜索框搜索地址或店铺的值放入data里
  blurInput:function(e){
    var that = this; 
    that.setData({
      searchTerm: e.detail.value
    })
  },
  // 搜索完成后点击完成或者图标或者失去input焦点时获取data里值上传
  tapSearch:function(){
    var that = this,
        data = {};
    data.keywords = that.data.searchTerm;
    data.openId = that.data.openId;    
    this.getMerchantList(data);
  },
  
  onShow:function(){
  

  },
  onHide: function () {

     
  },
})
