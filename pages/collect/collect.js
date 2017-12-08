// pages/collect/collect.js
var app = getApp();
var initdata = function (that) {
  var collect = that.data.collect
  for (var i = 0; i < collect.length; i++) {
    collect[i].txtStyle = ""
  }
  that.setData({ collect: collect })
}
Page({
  data: {
    delBtnWidth: 180,//删除按钮宽度单位（rpx） 
  },

  
  onLoad: function (options) {
    var that = this;   
    that.initEleWidth();
    that.setData({
      appImg: app.globalData.adminAddressImg,
    })
  },
  onShow: function (){
    var that = this,
    data = {};
    data.openid = app.globalData.openId
    data.lat = app.globalData.lat
    data.lon = app.globalData.lon
    console.log(data)
    // this.initEleWidth();
    this.collectShop(data);
    // 清空total(本地购物车缓存)的数据
    wx.setStorage({
      key: 'total',
      data: { count: 0, price: 0, list: [] },
    })
  },
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置  
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    var that = this
    initdata(that)
    if (e.touches.length == 1) {
      //手指移动时水平方向位置  
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值  
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变  
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离  
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度  
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项  
      var index = e.target.dataset.index;
      var collect = this.data.collect;
      collect[index].txtStyle = txtStyle;
      //更新列表的状态  
      this.setData({
        collect: collect
      });
    }
  },

  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置  
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离  
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮  
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项  
      var index = e.target.dataset.index;
      var collect = this.data.collect;
      collect[index].txtStyle = txtStyle;
      //更新列表的状态  
      this.setData({
        collect: collect
      });
    }
  },
  //获取元素自适应后的实际宽度  
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应  
      // console.log(scale);  
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error  
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  //点击删除按钮事件  
  delItem: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否删除？',
      success: function (res) {
        if (res.confirm) {
          //获取列表中要删除项的下标  
          var index = e.target.dataset.index;
          var collect = that.data.collect;
          console.log(collect[index].id)
          var data = [];
          data.id = collect[index].id;
          console.log(data)          
          that.deleteCollect(data);
          wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000
          })
          //移除列表中下标为index的项  
          collect.splice(index, 1);
          //更新列表的状态  
          that.setData({
            collect: collect
          });
         
        } else {
          initdata(that)
        }
      }
    })

  },
  //点击跳转商铺
  shopnav:function(e){
    var txtStyle = "";
    console.log(e)
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../menu/menu?id='+id+'&name='+name,
      success: function (res) {

      }
    })
  },
//   收藏店铺接口
  collectShop:function(data){
    var that = this;
    wx.getStorage({
      key: 'userLocation',
      success: function (res) {
        console.log(res.data)
      }
    })
    wx.request({
      url: app.globalData.adminAddress + '/applet_customer/myShopCollectList',
      data: data,
      method: "GET",
      // header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        wx.hideLoading();

        that.setData({
          collect: res.data.data,
        });
      },
      fail: function () {
        wx.showLoading('请求数据失败');
      }
    })
  },
  deleteCollect:function(data){
      var that = this;
      wx.request({
          url: app.globalData.adminAddress + '/applet_customer/deleteCollectShop',
          data: data,
          method: "GET",
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          success: function (res) {
            console.log('删除成功')
          },
          fail: function () {
              wx.showLoading('请求数据失败');
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
  },
})