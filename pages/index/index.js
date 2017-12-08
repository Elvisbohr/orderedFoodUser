//获取应用实例
var app = getApp()
var amapFile = require('../../utils/amap-wx.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
//index.js
Page({
  data: {
    mainHieght: '',  //商铺列表的高度
    city: '',
    pageNum: 1,
    autoplay: true,
    isMore: false,
    moreTit: '加载更多',
  },
  city: function (e) {
    console.log("暂未开发")
    // wx.navigateTo({
    //   url: '../switchcity/switchcity',
    // });
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
            data.keywords = that.data.searchTerm;
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
    // console.log(options.city)
    that.getCoordinates(options); //获取当前城市
    //获取手机信息(宽高等)
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          appImg: app.globalData.adminAddressImg,
          mainHieght: res.windowHeight - 250,
        });
        // console.log(that.data.mainHieght)
      }
    });
    that.orderList(); //广告轮播图


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
  //商铺列表接口
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
        //如果是下拉刷新的话使用
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        // console.log(res)
        //根据pageNum判断是从哪里调取接口(大于1为点击加载分页)
        if (that.data.pageNum > 1) {
          if (res.data.data.list == null) {
            that.setData({
              moreTit: '暂无更多'
            })
          } else {
            var merchants = that.data.merchants;
            for (var i = 0; i < res.data.data.list.length; i++) {
              merchants.push(res.data.data.list[i]);
            }
            console.log(merchants)
            that.setData({
              merchants: merchants,
            })
          }
        } else {
          that.setData({
            merchants: res.data.data.list
          });
        }

      },

      fail: function () {
        wx.showLoading('请求数据失败');
      }
    })
  },
  //搜索框搜索地址或店铺的值放入data里
  blurInput: function (e) {
    var that = this;
    console.log(e.detail.value)
    if (e.detail.value == undefined) {
      var searchTerm = ''
    } else {
      var searchTerm = e.detail.value
    }
    console.log(searchTerm)
    that.setData({
      searchTerm: searchTerm
    })
  },
  // 搜索完成后点击完成或者图标或者失去input焦点时获取data里值上传
  tapSearch: function () {
    var that = this,
      data = {};
    if (that.data.searchTerm == undefined) {
      that.setData({
        searchTerm: '',
      })
    }
    data.keywords = that.data.searchTerm;
    data.openId = that.data.openId;
    data.lat = that.data.lat;
    data.lon = that.data.lon;
    //重置分页(加载更多)
    that.setData({
      pageNum: 1,
      moreTit: '加载更多'
    })
    this.getMerchantList(data);
  },

  onShow: function () {
    wx.setStorage({
      key: 'total',
      data: { count: 0, price: 0, list: [] },
    })

  },
  //跳转店铺
  shopnav: function (e) {
    var that = this;
    var merchants = that.data.merchants;    //获取data里的商铺接口数据
    var index = e.currentTarget.dataset.index;  //获取点击的是啊哪个个
    //点击店铺时调取接口判断当前是否营业     
      wx.request({
        url: app.globalData.adminAddress + '/applet_customer/isOpen',
        data: {
          shopId: merchants[index].id
        },
        method: "POST",
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          if(res.data.data){
            console.log(1)
            if (merchants[index].isOpen == 1) { //判断如果是营业中则跳转页面
              wx.navigateTo({
                url: '../menu/menu?id=' + merchants[index].id + '&name=' + merchants[index].shopName,

              })
            } else if (merchants[index].isOpen == 2) {   //状态为休息中弹出提示框
              wx.showToast({
                title: '暂未营业',
                icon: 'loading',
                duration: 2000
              })
            }
          }else{
            console.log(2)
            wx.showToast({
              title: '暂未营业',
              icon: 'loading',
              duration: 2000
            })
          }
        },
        fail: function () {
          wx.showLoading('判断当前是否营业失败');
        }
      })
    



    
  },
  //首页广告图
  orderList: function () {
    var that = this;
    wx.request({
      url: app.globalData.adminAddress + '/applet_customer/queryAdvert',
      method: "GET",
      // header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {

        console.log('轮播')
        console.log(res.data.data)

        var bannerUrls = res.data.data;


        that.setData({
          bannerUrls: bannerUrls,
        })
        console.log(bannerUrls)
      },
      fail: function () {
        wx.showLoading('请求数据失败');
      }
    })
  },
  //加载更多接口
  loadMore: function () {
    var that = this,
      pageNum = that.data.pageNum,
      data = {};
    console.log(pageNum)
    pageNum += 1;
    console.log(pageNum)
    data.openId = that.data.openId;
    data.lat = that.data.lat;
    data.lon = that.data.lon;
    data.keywords = that.data.searchTerm;
    data.pageNum = pageNum;
    that.setData({
      pageNum: pageNum,
    })
    console.log(data)
    if (that.data.moreTit != '暂无更多') {
        //判断如果为暂无更多的话不执行
      this.getMerchantList(data);
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //刷新导入商铺接口
    var data = {};
    data.openid = that.data.openid;
    data.lat = that.data.lat;
    data.lon = that.data.lon;
    data.keywords = that.data.searchTerm;
    that.getMerchantList(data); //调取查询上去列表接口
    that.setData({    //重置商铺列表
      merchants: [],
      pageNum: 1,
      moreTit: '加载更多',
    })
  },
  //调取扫一扫api(跳转到商铺)
  sweep: function(res){
    // 只允许从相机扫码
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log("调取成功")
        console.log(res.path)
        let ss = res.path
        var reg2 = /([^?]+)$/;
        var bluefile = ss.match(reg2)[1];
        console.log(bluefile)        
        wx.navigateTo({
          url: '../menu/menu?'+bluefile
        })
      }
    })
  },
  // 转发
  onShareAppMessage: function (res) {
    if (res.from === 'menu') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '爱点自助点餐',
      path: 'pages/index/index',
      imageUrl: "/images/message.png",
      success: function (res) {
        // 转发成功
        // console.log(res)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
