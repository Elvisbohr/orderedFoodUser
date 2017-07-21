// pages/settle/settle.js
Page({
   data: {
     upmore: true,    //查看全部已点餐品
     xl:false,      //下拉箭头
     shopname:'天一阁',  //店铺名
     circle: false,   //就餐方式
     cirImg: true,    //就餐方式
     time:'',   //取餐时间
  },

  onLoad: function (options) {
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
    console.log("当前时间：" +h+":"+m);  
    that.setData({
      time : h + ":" + m,
    })
  },
  // 查看全部已点菜品
  upmore: function () {
    var that = this;
    that.setData({
      upmore: (!that.data.upmore),
    })
  },
  // 就餐方式
  waytach: function (e) {
    var that = this;
    var types = e.currentTarget.dataset.types;
    if (types === 'DiningWay') {
      that.setData({
        circle: (!that.data.circle),
        cirImg: (!that.data.cirImg)
      });
    } else if (types === 'invoice') {
      that.setData({
        invoice: (!that.data.invoice)
      });
    }
  },
  // 就餐时间
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  }
})