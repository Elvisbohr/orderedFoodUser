// pages/menu/menu.js
import menus from '../resources/json/menus.js';
Page({
  data: {
    attention: 0,  //判断他是否收藏(0未关注1已关注)
    chit:'慢100减10',   //代金券活动
    manjian:'满100减1000', //满减活动
    tabs: ["点餐", "商家"], 
    activeIndex: "0",
    sliderOffset: 0,
    sliderLeft: 0,
    jieshao:true,         //店铺介绍是否全部显示
    opentime:'10:00-12:00', //商铺营业时间
    shopPhone:'130xxxxxxxx',  //商铺电话
    shopsite:'中南海sadasd',   //商铺地址
    privilege:false,    //商铺活动
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 3000,
    duration: 1200,
    toView: 'blue',
    'menus': menus,
    selectedMenuId: 0,
    curIndex: 0,
    total: {
      count: 0,
      money: 0,
      goods: []
    },
    cartTab: false
  },

  attention:function(){ //点击后改变收藏状态
    var that = this;
    var atten = that.data.attention;  //获取当前收藏状态(0未关注1已关注)
    var msg = '';   //提示词
    if(atten == 0){
      atten = 1;
      msg = '收藏成功'
    }else{
      atten = 0;
      msg = '取消成功'
    }
    wx.showToast({
      title: msg,
      icon: 'success',
      duration: 2000
    })
    that.setData({
      attention : atten,
    })
  },
  
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({  //获取手机信息(宽高等)
      success: function (res) {
        console.log(res)
        that.setData({
          menuhieght: res.windowHeight - 134,
        });
        console.log(that.data.menuhieght)
      }
    });
  },
  // 点击显示全图
  patImg:function(e){
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [] // 需要预览的图片http链接列表
    })

  },
  //显示全部优惠活动
  prompt:function(){
    var that = this;
    that.setData({
      privilege: (!that.data.privilege),
    })
  },
  // 点击事件Tab
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  selectMenu: function (event) {  //点击商品分类列表
    console.log(11)

    let data = event.currentTarget.dataset;
    console.log(data)
    var that = this, menus = that.data.menus;
    for (var i = 0; i < menus.length; i++) {
      if (i === parseInt(data.id)) {
        menus[i].curClass = "on";
      } else {
        menus[i].curClass = "";
      }
    }
    this.setData({
      toView: data.tag,
      selectedMenuId: data.id,
      menus: menus
    });

  },
  addCount: function (event) {
    // menus列表个数递增
    var dataset = event.currentTarget.dataset;
    let menus = this.data.menus;
    let curIndex = this.data.selectedMenuId;
    let dish = menus[curIndex].list.find(function (v) {
      return v.fid == dataset.fid
    })
    dish.count += 1;
    // total总个数增,总额增
    let total = this.data.total;
    total.count += 1;
    total.money = (Number(total.money) + Number(dish.foodprice)).toFixed(2);
    //total列表内容
    let isFood = total.list.find(function (v) {
      return v.fid == dataset.fid;
    })
    if (isFood === undefined) {
      dish.typeIndex = curIndex;
      total.list.push(dish);
    } else {
      isFood.count += 1;
    }
    console.log(isFood)
    //判断total是否有菜品
    let cartTab = this.data.cartTab;
    let carshop = this.data.carshop;
    if (total.count <= 0) {
      cartTab = false;
      carshop = true;
    } else {
      cartTab = true;
      carshop = false;
    }
    this.setData({
      'menus': menus,
      'cartTab': cartTab,
      'carshop': carshop,
      'total': total
    });
  },
  minusCount: function (event) {
    // menus列表个数递减
    var dataset = event.currentTarget.dataset;
    let menus = this.data.menus;
    let curIndex;
    if (dataset.typeIndex === undefined) {
      curIndex = this.data.selectedMenuId;
    } else {
      curIndex = dataset.typeIndex;
    }
    let dish = menus[curIndex].list.find(function (v) {
      return v.fid == dataset.fid
    })
    dish.count -= 1;
    // total总个数减,总额减
    let total = this.data.total;
    total.count -= 1;
    total.money = (Number(total.money) - Number(dish.foodprice)).toFixed(2);
    //更新total列表内容
    for (var i = 0; i < total.list.length; i++) {
      if (total.list[i].fid === dataset.fid) {
        if (total.list[i].count <= 1) {
          total.list.splice(i, 1);
        } else {
          total.list[i].count -= 1;
        }
      }
    }
    //判断total是否有菜品
    let cartTab = this.data.cartTab;
    let carshop = this.data.carshop;
    let shop = this.data.shop;
    if (total.count <= 0) {
      cartTab = false;
      carshop = true;
      shop = false;
    } else {
      cartTab = true;
      carshop = false;
    }
    this.setData({
      'menus': menus,
      'cartTab': cartTab,
      'carshop': carshop,
      'total': total,
      shop: shop,
    });
  },
  cartshopbtn: function () {
    var that = this;
    that.setData({
      shop: true,
      carshop: true,
    })
  },
  shopbtn: function () {
    var that = this;
    that.setData({
      shop: false,
      carshop: false,
    })
  },
  menuok: function () {
    var that = this;
    wx.setStorage({
      key: 'total',
      data: that.data.total,
      success: function () {
        wx.navigateTo({
          url: '../fail/fail?shopid=' + that.data.shopid,
        })
      }
    })
  },
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'total',
      success: function (res) {
        if (res.data.list.length > 0) {
          that.setData({
            cartTab: true,
            shop: false
          })
        }
        that.setData({
          total: res.data
        })
      },
    })
  },
  jiesao:function(){
    var that =this;
    that.setData({
      jieshao: (!that.data.jieshao)
    })
  },
})