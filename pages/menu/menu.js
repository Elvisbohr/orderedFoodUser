// pages/menu/menu.js
var app = getApp();
// import menus from '../resources/json/menus.js';
Page({
    data: {
        attention: 0,  //判断他是否收藏(0未关注1已关注)
        // coupon: '',   //代金券活动
        // manjian: '满100减1000', //满减活动
        tabs: ["点餐", "商家"],
        activeIndex: "0",
        sliderOffset: 0,
        sliderLeft: 0,
        jieshao: true,         //店铺介绍是否全部显示
        // opentime: '10:00-12:00', //商铺营业时间
        // shopPhone: '130xxxxxxxx',  //商铺电话
        // shopsite: '中南海sadasd',   //商铺地址
        privilege: false,    //商铺活动
        xl: false,     //下拉显示全部活动
        indicatorDots: true,
        vertical: false,
        autoplay: false,
        interval: 3000,
        duration: 1200,
        toView: 'blue',
        // 'menus': menus,
        'menus': '',
        selectedMenuId: 0,
        curIndex: 0,
        total: {
            count: 0,
            money: 0,
            list: []
        },
        cartTab: false,
        chitR: true,   //判断是否有代金券
        chitMain: false,   //显示领取代金券页面 
        specShade: false,   //是否显示规格页面
        spec: [    //选规格
            { name: '特大', pic: '14' },
            { name: '大', pic: '13' },
            { name: '中', pic: '12' },
            { name: '小', pic: '11' }
        ],
        taste: [ //选口味
            { name: '微辣' },
            { name: '辣' }
        ]
    },
    onLoad: function (options) {
        var that = this;
        // 获取商铺基本信息接口
        var data = [];
        data.shopId = options.id;
        that.shopInfo(data);
        that.setData({
            shopId: options.id,
        });
        //判断店铺是否已收藏接口
        var isData = [];
        isData.shopId = options.id;
        isData.openid = app.globalData.openId;
        that.isCollect(isData)
        wx.getSystemInfo({  //获取手机信息(宽高等)
            success: function (res) {
                console.log(res)
                that.setData({
                    menuhieght: res.windowHeight - 174,
                });
                console.log(that.data.menuhieght)
            }
        });
        //判断是否有优惠活动
        var activityData = [];
        activityData.shopId = options.id;
        that.isActivity(activityData);
        //获取菜品列表
        var menuData = [];
        menuData.shopId = options.id;
        that.menuLsit(menuData)
    },
    attention: function () { //点击后改变收藏状态
        var that = this;
        var atten = that.data.attention;  //获取当前收藏状态(0未关注1已关注)
        var msg = '';   //提示词
        // 获取需要传回接口的参数
        var data = [];
        // console.log(that.data)
        if (atten == 0) {
            atten = 1;
            msg = '收藏成功'
            data.openid = app.globalData.openId;    //用户openId
            data.shopId = that.data.shopId;     //商户Id
            that.shopCollect(data);     //调用收藏接口
        } else {
            atten = 0;
            msg = '取消成功';
            data.id = that.data.collectId;     //商户Id
            that.deleteCollect(data)
        }
        wx.showToast({
            title: msg,
            icon: 'success',
            duration: 2000
        })
        that.setData({
            attention: atten,
        })
    },
    //点击选择规格按钮显示选规格弹框
    selectGg: function (e) {
        var that = this;
        var menus = this.data.menus;        //获取菜品列表
        var curIndex = this.data.selectedMenuId;    //获取他是属于哪个分类的
        var index = e.currentTarget.dataset     //获取该菜品的食物id
        var dish = menus[curIndex].goodses.find(function (v) {
            return v.id == index.cid
        })
        console.log(menus)
        console.log(curIndex)
        console.log(dish)
        var selectSpec = []
        selectSpec = dish
        that.setData({
            selectSpec : selectSpec,
            specShade: true,
        })
    },
    spec: function (e) { //点击获取选到的规格
        var that = this;
        var num = e.currentTarget.dataset.index;  //获取点击的是那个规格
        var selectSpec = that.data.selectSpec;    //获取菜品数组
        var spec = selectSpec.specifications;    //获取菜品规格数组
        for (var i = 0; i < spec.length; i++) {   //循环这个数组把所有都变成false
            spec[i].isspec = false;
        }
        spec[num].isspec = true;  //把点击的这个改为true

        var isPic = spec[num].price   //声明点击的这个规格多钱
        selectSpec.specId = spec[num].id;  //获取规格id      
        var isspecname = '(' + spec[num].name + ')' //声明点击的这个名字
        that.setData({      //赋值
            selectSpec: selectSpec,
            isPic: isPic,
            isspecname: isspecname,
        })
    },
    //点击口味
    taste: function (e) {
        var that = this;
        var num = e.currentTarget.dataset.index;  //获取点击的是那个规格
        var selectSpec = that.data.selectSpec;    //获取菜品数组        
        var taste = selectSpec.flavors;    //获取规格数组
        for (var i = 0; i < taste.length; i++) {   //循环这个数组把所有都变成false
            taste[i].istaste = false;
        }
        taste[num].istaste = true;  //把点击的这个改为true
        selectSpec.tasteId = taste[num].id;  //获取口味id
        var istastename = '(' + taste[num].name + ')' //声明点击的这个名字
        that.setData({      //赋值
            selectSpec: selectSpec,
            istastename: istastename,
        })
    },
    //点击加入购物车
    shopcar: function () {
        var that = this;
        that.setData({
            specShade: false,
        })
    },

    // 点击显示全图
    patImg: function (e) {
        wx.previewImage({
            current: '', // 当前显示图片的http链接
            urls: [] // 需要预览的图片http链接列表
        })

    },
    //显示全部优惠活动
    prompt: function () {
        var that = this;
        that.setData({
            privilege: (!that.data.privilege),
            xl: (!that.data.xl),
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
        var that = this, 
        menus = that.data.menus;
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
        var dataset = event.currentTarget.dataset;  //获取点击的data-的信息 id fid
        let menus = this.data.menus;        //获取菜品列表
        let curIndex = this.data.selectedMenuId;    //获取他是属于哪个分类的
        console.log(dataset)
        console.log(menus)
        console.log(curIndex)
        let dish = menus[curIndex].goodses.find(function (v) {
            return v.id == dataset.cid
        })
        console.log(dish)
        dish.count += 1;
        // total总个数增,总额增
        let total = this.data.total;
        total.count += 1;
        total.money = (Number(total.money) + Number(dish.foodprice)).toFixed(2);
        //total列表内容
        let isFood = total.list.find(function (v) {
            return v.id == dataset.cid;
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
            // cartTab = false;
            carshop = true;
        } else {
            // cartTab = true;
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
        let curIndex = this.data.selectedMenuId;
        
        if (dataset.typeIndex === undefined) {
            curIndex = this.data.selectedMenuId;
        } else {
            curIndex = dataset.typeIndex;
        }
        let dish = menus[curIndex].goodses.find(function (v) {
            return v.id == dataset.cid
        })
        console.log(dataset.cid)
        
        console.log(dish)
        dish.count -= 1;
        // total总个数减,总额减
        let total = this.data.total;
        total.count -= 1;
        total.money = (Number(total.money) - Number(dish.foodprice)).toFixed(2);
        //更新total列表内容
        for (var i = 0; i < total.list.length; i++) {
            if (total.list[i].id === dataset.cid) {
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
    // 店铺介绍显示全部
    jiesao: function () {
        var that = this;
        that.setData({
            jieshao: (!that.data.jieshao)
        })
    },
    // 跳转到地图页
    shopmap: function () {
        var that = this;
        // 经纬度应该是数字而不是字符串,把接到的数据转换为数值
        var lat = Number(that.data.shopInfo.latitude);
        var lon = Number(that.data.shopInfo.longitude);
        // console.log(lat)
        // console.log(lon)
        wx.openLocation({
            latitude: lat,
            longitude: lon,
            scale: 28
        })
    },
    //点击代金券打开领取页面
    chitMoney: function () {
        var that = this;
        if (that.data.chitR == true) {
            console.log(111)
            that.setData({
                // chitR: false,
                chitMain: true
            })
        }
    },
    //点击关闭领取代金券页面
    error: function () {
        var that = this;
        // console.log(111)
        that.setData({
            chitMain: false,
        })
    },
    //点击确认按钮之后是代金券变灰
    shitbut: function () {
        var that = this;
        that.setData({
            chitR: false,
            chitMain: false,
        })
    },
    //   获取接口信息(商铺基本信息)
    shopInfo: function (data) {
        var that = this;
        wx.request({
            url: app.globalData.adminAddress + '/applet_customer/getMerchantInfo',
            data: data,
            method: "GET",
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                console.log(res.data.data)
                that.setData({
                    shopInfo: res.data.data,
                })
            },
            fail: function () {
                wx.showLoading('请求数据失败');
            }
        })

    },
    //判断店铺是否已收藏接口
    isCollect: function (data) {
        var that = this;
        wx.request({
            url: app.globalData.adminAddress + '/applet_customer/checkIsShopCollect',
            data: data,
            method: "GET",
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                // console.log('判断店铺是否已收藏接口')
                // console.log(res)
                if (res.data.data.isCollect){
                    console.log('已收藏')
                    that.setData({
                        isCollect: res.data.data.isCollect,
                        collectId: res.data.data.collectId,
                        attention: 1,
                    });
                    console.log(that.data)
                }else{
                    console.log('未收藏')
                    that.setData({
                        isCollect: res.data.data.isCollect,
                        attention: 0,
                    })
                }
            },
            fail: function () {
                wx.showLoading('请求数据失败');
            }
        })

    },
    //   获取接口信息(点击收藏)
    shopCollect: function (data) {
        var that = this;
        wx.request({
            url: app.globalData.adminAddress + '/applet_customer/collectShop',
            data: data,
            method: "GET",
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                // console.log('点击收藏')
                // console.log(res)
            },
            fail: function () {
                wx.showLoading('请求数据失败');
            }
        })

    },
    //   获取接口信息(删除收藏)
    deleteCollect: function (data) {
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
    isActivity:function(data){
        var that = this;
        wx.request({
            url: app.globalData.adminAddress + '/applet_customer/getShopPreferentials',
            data: data,
            method: "GET",
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                console.log('判断是否有优惠活动')
                console.log(res.data.data)
                var activityIndex = res.data.data.num;
                console.log(activityIndex)
                that.setData({
                    activityIndex: activityIndex,
                })
                //判断该店是否有{{代金券}}活动
                if (res.data.data.coupon == '' || res.data.data.coupon == undefined){   
                    that.setData({
                        iscoupon :false,
                    })
                }else{
                    that.setData({
                        coupon: res.data.data.coupon,
                        iscoupon: true,
                    })
                }
                //判断该店是否有{{满减}}活动
                if (res.data.data.moneyoff == '' || res.data.data.moneyoff == undefined) {
                    that.setData({
                        ismoneyoff: false,
                    })
                } else {
                    that.setData({
                        moneyoff: res.data.data.moneyoff,
                        ismoneyoff: true,
                    })
                }
                //判断该店是否有{{折扣}}活动
                if (res.data.data.discount == '' || res.data.data.discount == undefined) {
                    that.setData({
                        isdiscount: false,
                    })
                } else {
                    that.setData({
                        discount: res.data.data.discount,
                        isdiscount: true,
                    })
                }
            },
            fail: function () {
                wx.showLoading('请求数据失败');
            }
        })
    },
    //查询菜品接口
    menuLsit:function(data){
        var that = this;
        wx.request({
            url: app.globalData.adminAddress + '/applet_customer/getGoodsList',
            data: data,
            method: "GET",
            header: { 'content-type': 'application/x-www-form-urlencoded'},
            success: function (res) {
                console.log('菜品接口')
                // console.log(res)
                // 先把餐单里的数量变为0
                let menusdata = res.data.data;
                console.log('menusdata');
                console.log(menusdata);
                for (var i = 0; i < menusdata.length; i++) {
                    for (var j = 0; j < menusdata[i].goodses.length; j++) {
                        menusdata[i].goodses[j].count = 0;
                        // console.log(j)
                        // console.log(menusdata);
                    }
                }
                menusdata[0].curClass = "on";
                wx.hideLoading()
                that.setData({
                    menus: menusdata,
                });
            },
            fail: function () {
                wx.showLoading('请求数据失败');
            }
        })
    }
})