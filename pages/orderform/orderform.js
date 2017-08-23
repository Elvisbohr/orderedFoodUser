// pages/orderform/orderform.js
var app = getApp();
Page({
    data: {
        ordertype: 'jd',  // "jd":待接单;wc:已完成;qc:已取餐;tkz:退款中;ytk:已退款;
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this,
        data = {};
        data.openid = app.globalData.openId;
        that.orderList(data);
    },
    orderList: function (data) {
        var that = this;
        wx.request({
            url: app.globalData.adminAddress + '/applet_customer/myOrders',
            data: data,
            method: "GET",
            // header: { 'content-type': 'application/x-www-form-urlencoded' },
            success: function (res) {
                wx.hideLoading();
                console.log(res.data.data)
               
                var orderList = res.data.data; 

                for(var i = 0; i<orderList.length; i++){
                    // "jd":待接单; wc: 已完成; qc: 已取餐; tkz: 退款中; ytk: 已退款;
                    if (orderList[i].status == 1){
                        orderList[i].ordertype = 'qc';
                        orderList[i].msg = '未付款'
                    } else if (orderList[i].status == 2){
                        orderList[i].ordertype = 'jd';
                        orderList[i].msg = '待接单'
                    } else if (orderList[i].status == 3) {
                        orderList[i].ordertype = 'jd';
                        orderList[i].msg = '待取餐'
                    } else if (orderList[i].status == 4) {
                        orderList[i].ordertype = 'tkz';
                        orderList[i].msg = '退款中'
                    } else if (orderList[i].status == 5) {
                        orderList[i].ordertype = 'ytk';
                        orderList[i].msg = '已退款'
                    } else if (orderList[i].status == 6) {
                        orderList[i].ordertype = 'wc';
                        orderList[i].msg = '已完成'
                    } else if (orderList[i].status == 7) {
                        orderList[i].ordertype = 'wc';
                        orderList[i].msg = '未接单完成'
                    } else if (orderList[i].status == 8) {
                        orderList[i].ordertype = 'wc';
                        orderList[i].msg = '拒绝完成'
                    }
                    console.log(orderList[i].status)
                }
                that.setData({
                    orderList: orderList,
                })
                console.log(orderList)
            },
            fail: function () {
                wx.showLoading('请求数据失败');
            }
        })
    }
})