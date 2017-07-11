//app.js
App({
  // 设置全局属性
  globalData: {
    total: {},
    adminAddress: "https://ad.kulizhi.com/ydc",
    // adminAddress: "http://192.168.1.128:8080/ydc/",
    // adminAddress: "http://192.168.1.101:8180/ydc/",
    appid: 'wx923af279b0388603',
    secret: '81beb1a470654ec92ce7fc27f14009b5',
    mealTime: "",
    chooseMeal: "",//当前要查看的订单详情
    appid: "wx923af279b0388603",
    secret: "81beb1a470654ec92ce7fc27f14009b5",
    gdKey: "5441fba65213bf0d9a6c4b1c81b8cd1e",//高的地图key
    gdxcxKey: "8489da6764f20baa70182ed141893109",//高的地图小程序key
    qqxcxKey: "Z56BZ-Q6CWG-K65QM-IFB67-JWYXK-OBFUF"//腾讯地图小程序key
  },
  onLaunch: function() {
    // 获取用户信息(openID,姓名,头像)
    var that = this
    var user = wx.getStorageSync('user') || {};
    var userInfo = wx.getStorageSync('userInfo') || {};
    if ((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600)) && (!userInfo.nickName)) {
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.getUserInfo({
              success: function (res) {
                var objz = {};
                objz.avatarUrl = res.userInfo.avatarUrl;
                objz.nickName = res.userInfo.nickName;
                //console.log(objz);  
                wx.setStorageSync('userInfo', objz);//存储userInfo  
              }
            });
            var d = that.globalData;//这里存储了appid、secret、token串    
            var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d.appid + '&secret=' + d.secret + '&js_code=' + res.code + '&grant_type=authorization_code';
            wx.request({
              url: l,
              data: {},
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT    
              // header: {}, // 设置请求的 header    
              success: function (res) {
                var obj = {};
                obj.openid = res.data.openid;
                obj.expires_in = Date.now() + res.data.expires_in;
                //console.log(obj);  
                wx.setStorageSync('user', obj);//存储openid    
              }
            });
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    }
  },


})
