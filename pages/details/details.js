// pages/details/details.js
Page({
  data: {
    userInfo: {
       userImg: '' ,  //用户头像(如果没有用本地的)
       userName: '' ,   //用户姓名
    },  //获取本地缓存的用户信息
   
  },


  onLoad: function (options) {
    var that = this;
    var userInfo = that.data.userInfo;  //获取
    console.log(userInfo)
    if (userInfo.userImg == ''){   //如果为空的话用默认微信头像
      console.log('用户未修改头像')
      wx.getStorage({
        key: 'userInfo',
        success: function (res) {
          var stotageInfo = res.data;
         
          userInfo.userImg = stotageInfo.avatarUrl;
          userInfo.userName = stotageInfo.nickName;
          console.log(userInfo)
          that.setData({
            userInfo: userInfo,
          })         
        }
      });
    }else{
      console.log('用户修改过头像')  //如果修改过请求接口
    }
  },
  
  UpuserImg: function () {   // 点击上传头像
    var that = this;
    var userInfo = that.data.userInfo;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        
         userInfo.userImg = res.tempFilePaths
        that.setData({
          userInfo: userInfo
        })
      }
    })
  },

  
})