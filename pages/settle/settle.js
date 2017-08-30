var app = getApp()
// pages/settle/settle.js
Page({
    data: {
        upmore: true,    //查看全部已点餐品
        xl: false,      //下拉箭头
        shopname: '天一阁',  //店铺名
        circle: false,   //就餐方式
        cirImg: true,    //就餐方式
        time: '',   //取餐时间

        discount: [],
        actIndex: 0,        //选中的优惠活动下标
        couIndex: 0,        //选中的代金券活动的下标
        
    },

    onLoad: function (options) {
        // console.log(options)
        var shopName = app.globalData.shopName;     //从全局里取出店铺名
        // console.log(shopName)
        var that = this;
        //获取当前时间戳  
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        //获取当前时间  
        var n = timestamp * 1000;
        var date = new Date(n);
        //时  
        var h = date.getHours();
        //分  
        var m = date.getMinutes();
        console.log("当前时间：" + h + ":" + m);
        that.setData({
            time: h + ":" + m,
            shopName: shopName,
        })
        //获取本地缓存里数据
     
        wx.getStorage({
            key: 'total',
            success: function (res) {
                var submitshop = res.data;
                console.log(123123)
                console.log(submitshop)

                // 算外卖费
                var cnaheprice1 = 0,    //声明单个外卖费
                    cnaheprice2 = 0,
                    count = 0,  //声明总数量
                    count1 = 0,  //声明无规格数量
                    count2 = 0,  //声明有规格数量
                    allcnaheprice = 0;  //声明总外卖费用
                for (var i = 0; i < submitshop.list.length; i++) {  //循环列表累加
                    // 判断是否是有规格菜品              
                    if (submitshop.list[i].standard == undefined){     //无规格的菜品                                         
                        count1 += submitshop.list[i].count;         //无规格的数量
                        cnaheprice1 = submitshop.list[i].boxPrice;            //无规格的餐盒费         
                                          
                    }else{                                        //   有规格的菜品
                        for (var j = 0; j < submitshop.list[i].standard.length; j++){
                            count2 += submitshop.list[i].standard[j].count;     //遍历出有规格的数量加起来
                        }   
                        cnaheprice2 = submitshop.list[i].boxPrice;      //有规格的餐盒费                                                                                   
                    }                                       
                }
                
                allcnaheprice = (count1 * cnaheprice1) + (count2 * cnaheprice2)     //总餐盒费
                // allcnaheprice += (cnaheprice * count) 
                that.setData({
                    allcnaheprice: allcnaheprice,
                    submitshop: submitshop,
                    shopid: options.shopId,
                
                });
                //使用用户优惠活动接口
                var actdata = {};
                actdata.openid = app.globalData.openId;
                actdata.shopId = options.shopId;
                actdata.total = submitshop.price
                that.upActivity(actdata);
            },
        })
       

    },
    // 查看全部已点菜品
    upmore: function () {
        var that = this;
        that.setData({
            upmore: (!that.data.upmore),
        })
    },
    // 就餐方式(堂食还是外卖)
    waytach: function (e) {
        var that = this;
        var upActivity = that.data.upActivity;  //从接口获取订单总数据
        var types = e.currentTarget.dataset.types;  //获取点击的是那个
        if (types === 'DiningWay') {
            console.log('堂食')
            upActivity.payMoney = (Number(that.data.tsprice)); 
            that.setData({
                circle: (!that.data.circle),
                cirImg: (!that.data.cirImg),
                upActivity: upActivity,
            });
        } else if (types === 'invoice') {
            console.log('外卖')
            upActivity.payMoney = that.data.wmprice;
            that.setData({
                invoice: (!that.data.invoice),
                upActivity: upActivity,
                circle: true,
                cirImg: false,
            });
        }
    },
    // 就餐时间
    bindTimeChange: function (e) {
        this.setData({
            time: e.detail.value
        })
    },
    //选择优惠活动
    bindActivityChange: function (e) {
        var that = this;
        var index = e.detail.value; 
        var preferentialType = that.data.discount[index].preferentialType;  //折扣和满减选中项(传回接口)	
        this.setData({
            actIndex: e.detail.value
        })
        //使用用户优惠活动接口
        var actdata = {};
        actdata.openid = app.globalData.openId;
        actdata.shopId = that.data.shopid;
        actdata.total = that.data.submitshop.price;
        actdata.discount_money_Type = preferentialType;
        that.upActivity(actdata);
    },
    //选择代金券
    bindCouponsChange:function(e){
        var that = this;
        var index = e.detail.value;
        var couponId = this.data.discount[index].id;
        console.log(couponId)
        this.setData({
            couIndex: e.detail.value
        }) 
        //使用用户优惠活动接口
        var actdata = {};
        actdata.openid = app.globalData.openId;
        actdata.shopId = that.data.shopid;
        actdata.total = that.data.submitshop.price
        actdata.couponId = couponId
        that.upActivity(actdata);
    },
    //获取用户优惠活动接口
    upActivity:function(data){
        var that = this;
        wx.request({
            url: app.globalData.adminAddress + '/applet_customer/calculateAmount',
            data: data,
            method: "GET",
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                console.log(data.discount_money_Type == undefined)
                wx.hideLoading();
                console.log(res.data.data)
                var discount = res.data.data.discount_moneyoff;      //从接口中取出优惠活动数组
                var coupons = res.data.data.coupons;                 //从数组中取出代金券数组
                var upActivity = res.data.data;
                var allcnaheprice = that.data.allcnaheprice;    //声明总餐盒费
                //堂食的总计(upActivity.payMoney为系统计算好的总价)
                var tsprice = (Number(upActivity.payMoney));         //堂食是总价         
                //外卖的总计
                var wmprice = (Number(upActivity.payMoney) + Number(allcnaheprice)).toFixed(2);    //外卖的总价
                //判断如果是第一次进入则调用接口默认最优选项
                if (data.discount_money_Type == undefined && data.couponId == undefined){  
                    // 初次调取优惠信息接口
                    //找接口返回的匹配id的下标
                    console.log('找到默认最优优惠选项')
                    var tachdisId = upActivity.discount_moneyoff_seled  //优惠活动默认id
                    var d = discount.findIndex(function (v) {                       
                        return v.preferentialType == tachdisId;
                    })
                    var actIndex = d;
                    var tachcouId = upActivity.coupons_seled  //优惠活动默认id
                    var c = coupons.findIndex(function (v) {
                        return v.id == tachcouId;
                    })
                    var couIndex = c;
                    that.setData({
                        actIndex: actIndex,
                        couIndex: couIndex,
                    })
                }                
                
                that.setData({
                    upActivity: upActivity,     //所有优惠数组 
                    discount: discount,         //优惠数组
                    coupons: coupons,           //代金券数组
                    tsprice: tsprice,           //堂食总金额
                    wmprice: wmprice,           //外带总金额
                   
                });
            },
            fail: function () {
                wx.showLoading('请求数据失败');
            }
        })
    },
    //验证手机号
    checkPhone: function (telphone) {
        if (!(/^1[34578]\d{9}$/.test(telphone))) {
            return false;
        }
        return true;
    },
    // 提交订单
    submitOrder:function(e){
        console.log(e)
        var that = this;
        var result = this.checkPhone(e.detail.value.telphone);  //判断手机号是否正确
        var cirnum = e.detail.value.cirnum;     //填写的桌号
        var note = e.detail.value.note;         //填写备注
        var telphone = e.detail.value.telphone; //填写手机号
        if (e.detail.value.telphone === "") {
            wx.showToast({
                title: '请填写手机号码',
                mask: true
            });
        } else if (!result) {
            wx.showToast({
                title: '请填写正确的手机号码',
                mask: true
            });
        }
        var submitData = {}; //声明上传接口数组
        data.comments = note;   //订单备注
        data.contactNumber = telphone;   //联系电话
        data.openid = app.globalData.openId; //用户openid
        data.payAmount = that.data.upActivity.payMoney;  //支付金额
        data.preferMoney = that.data.upActivity.preferential; //优惠金额
        data.shopId = that.data.shopid;  //商铺Id
        data.shopName = that.data.shopName; //店铺名称
        data.tableNum = that.data.cirnum;   //餐桌号



    }
})