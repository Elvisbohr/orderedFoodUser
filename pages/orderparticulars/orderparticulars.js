// pages/orderparticulars/orderparticulars.js
var app = getApp();
Page({
  data: {
    upmore:true,    //查看全部已点餐品
  },

  onLoad: function (options) {
    var that = this;
    var orderData = [];
    orderData.id = options.id;
    that.OrderDetail(orderData);
  },
  //获取订单详情接口
  OrderDetail:function(data){
    var that =this;
    wx.request({
      url: app.globalData.adminAddress + '/applet_customer/getOrderDetail',
      data: {id : 9,},
      method: "GET",
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log('订单详情')
        console.log(res)
        var detail = res.data.data;
        //判断type为1,2赋值到data里为堂食外卖
        if (detail.order.type == 1){
          var ordertype = '堂食'
        }else if(detail.order.type == 2){
          var ordertype = '外卖'
        }
        that.setData({
          detail: detail,
          ordertype: ordertype,
        })
      },
      fail: function () {
        wx.showLoading('请求数据失败');
      }
    })
  },
  // 查看全部已点菜品
  upmore: function () {
    var that = this;
    that.setData({
      upmore: (!that.data.upmore)
    })
  },
  // 拨打电话
  call:function(){
    var that = this;
    wx.makePhoneCall({
      phoneNumber: '' //仅为示例，并非真实的电话号码
    })
  },
})