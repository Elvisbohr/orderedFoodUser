var app = getApp()
// pages/settle/settle.js
Page({
    data: {
        upmore: true,    //查看全部已点餐品
        xl: false,      //下拉箭头
        shopname: '天一阁',  //店铺名
        circle: false,   //就餐方式
        cirImg: true,    //就餐方式
        takeFoodtime: '',   //取餐时间

        discount: [],
        actIndex: 0,        //选中的优惠活动下标
        couIndex: 0,        //选中的代金券活动的下标
        waytachType: 1,        //上传接口(就餐类型 1堂食 2外带)
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
            takeFoodtime: h + ":" + m,
            shopName: shopName,
        })
        //获取本地缓存里数据
     
        wx.getStorage({
            key: 'total',
            success: function (res) {
                var submitshop = res.data;
                console.log(123123)
                console.log(submitshop)

                // 算外卖费并往上传的数据里赋值
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
                            // upgoods.boxPrice = submitshop.list[i].boxPrice;  
                        }   
                        cnaheprice2 = submitshop.list[i].boxPrice;      //有规格的餐盒费                                                                                   
                                              
                    }
                                                     
                }
                
                allcnaheprice = (count1 * cnaheprice1) + (count2 * cnaheprice2)     //总餐盒费
               
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
                waytachType: 1,     //上传接口(就餐类型 1堂食 2外带)
            });
        } else if (types === 'invoice') {
            console.log('外卖')
            upActivity.payMoney = that.data.wmprice;
            that.setData({
                invoice: (!that.data.invoice),
                upActivity: upActivity,
                circle: true,
                cirImg: false,
                waytachType: 2,     //上传接口(就餐类型 1堂食 2外带)
            });
        }
    },
    // 就餐时间
    bindTimeChange: function (e) {
        this.setData({
            takeFoodtime: e.detail.value
        })
    },
    //选择优惠活动
    bindActivityChange: function (e) {
        var that = this;
        var index = e.detail.value; 
        var preferentialType = that.data.discount[index].preferentialType;  //折扣和满减选中项(传回接口)	
        console.log('preferentialType')
        console.log(e)
        console.log(index)
        // console.log(preferentialType)
        that.setData({
            actIndex: e.detail.value
        })
        //使用用户优惠活动接口
        var actdata = {};
        actdata.openid = app.globalData.openId;     //用户openid
        actdata.shopId = that.data.shopid;          //商铺id
        actdata.total = that.data.submitshop.price; //订单总价
        actdata.discount_money_Type = preferentialType; //优惠活动当前选中项
        actdata.couponId= that.data.tachcouId;  //默认代金券id
        // that.upActivity(actdata);
    },
    //选择代金券
    bindCouponsChange:function(e){
        var that = this;
        var index = e.detail.value;
        var couponId = this.data.discount[index].id;
        // console.log(couponId)
        this.setData({
            couIndex: e.detail.value
        }) 
        //使用用户优惠活动接口
        var actdata = {};
        actdata.openid = app.globalData.openId;     //用户openid
        actdata.shopId = that.data.shopid;          //商铺id
        actdata.total = that.data.submitshop.price  //订单总价
        actdata.couponId = couponId         //代金券当前选中项
        actdata.discount_money_Type = that.data.tachdisId //默认优惠活动id
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
                var tachdisId = upActivity.discount_moneyoff_seled  //优惠活动默认id
                var tachcouId = upActivity.coupons_seled  //代金券默认id
                if (data.discount_money_Type == undefined && data.couponId == undefined){  
                    // 初次调取优惠信息接口
                    //找接口返回的匹配id的下标
                    console.log('找到默认最优优惠选项')
                    
                    var d = discount.findIndex(function (v) {                       
                        return v.preferentialType == tachdisId;
                    })
                    var actIndex = d;
                    
                    var c = coupons.findIndex(function (v) {
                        return v.id == tachcouId;
                    })
                    var couIndex = c;
                    that.setData({
                        actIndex: actIndex,
                        couIndex: couIndex,
                    })
                }                
                var preferentials = [];     //声明要上传接口所用数组
                preferentials.push(discount[actIndex])      //所选优惠数组
                preferentials.push(coupons[couIndex])       //所选代金券数组
                console.log(preferentials)
                that.setData({
                    tachdisId: tachdisId,   //优惠活动默认id
                    tachcouId: tachcouId,   //代金券默认id
                    upActivity: upActivity,     //所有优惠数组 
                    discount: discount,         //优惠数组
                    coupons: coupons,           //代金券数组
                    tsprice: tsprice,           //堂食总金额
                    wmprice: wmprice,           //外带总金额
                    preferentials: preferentials, //声明要上传接口所用数组
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
        // console.log(e)
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

        var goods = [];     //声明需要上传的数组
        var submitshop = that.data.submitshop   //声明已购菜品总数组
        for (var i = 0; i < submitshop.list.length; i++) {  //循环列表累加
            
            // 判断是否是有规格菜品              
            if (submitshop.list[i].standard == undefined) {     //无规格的菜品    
                var upgoods = {}; //声明上传数组的对象                                                                    
                //无规格菜品压入接口数组
                upgoods.boxPrice = submitshop.list[i].boxPrice;       //餐盒费
                upgoods.goodsName = submitshop.list[i].name;       //菜品名称
                upgoods.goodsId = submitshop.list[i].id;     //菜品Id
                upgoods.num = submitshop.list[i].count;  //菜品数量
                upgoods.price = submitshop.list[i].price;    //菜品单价
                goods.push(upgoods) 
            } else {                                        //   有规格的菜品
                for (var j = 0; j < submitshop.list[i].standard.length; j++) {              
                    console.log(j)    
                    var upgoods = {}; //声明上传数组的对象
                    upgoods.boxPrice = submitshop.list[i].boxPrice; //餐盒费  
                    upgoods.goodsName = submitshop.list[i].name;       //菜品名称                    
                    upgoods.goodsFlavorId = submitshop.list[i].standard[j].flavors.id;   //菜品口味id
                    upgoods.goodsFlavorName = submitshop.list[i].standard[j].flavors.name;   //菜品口味名称
                    upgoods.goodsId = submitshop.list[i].id;    //菜品Id
                    upgoods.goodsSpecificationId = submitshop.list[i].standard[j].specifications.id; //菜品规格Id
                    upgoods.goodsSpecificationName = submitshop.list[i].standard[j].specifications.name; //菜品规格名称
                    upgoods.num = submitshop.list[i].standard[j].count;  //菜品数量
                    upgoods.price = submitshop.list[i].standard[j].specifications.price //菜品单价.
                    goods.push(upgoods) 
                }
                                                                                            

            }
            
            that.setData({
                goods:goods,
            })

        }




        var submitData = {}; //声明上传接口数组
        submitData.comments = note;   //订单备注
        submitData.contactNumber = telphone;   //联系电话
        submitData.openid = app.globalData.openId; //用户openid
        submitData.payAmount = that.data.upActivity.payMoney;  //支付金额
        submitData.preferMoney = that.data.upActivity.preferential; //优惠金额
        submitData.shopId = that.data.shopid;  //商铺Id
        submitData.shopName = that.data.shopName; //店铺名称
        submitData.tableNum = cirnum;   //餐桌号
        submitData.takeFoodtime = that.data.takeFoodtime;    //取餐时间
        submitData.total = that.data.submitshop.price;    //订单总额
        submitData.preferentials = that.data.preferentials;   //订单优惠列表
        submitData.type = that.data.waytachType;     //就餐方式
        submitData.goods = that.data.goods;
        console.log(submitData)
        that.upLoadMenu(submitData)
    },
    upLoadMenu:function(data){
      var that = this;
      wx.request({
        url: app.globalData.adminAddress + '/applet_customer/submitOrder',
        data: data,
        method: "POST",
        // header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          console.log('提交成功')
        },
        fail: function () {
          wx.showLoading('请求数据失败');
        }
      })
    }
})