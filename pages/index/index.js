//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
  },

  addClickAudio:function(){
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true // 是否自动开始播放，默认为 false
    innerAudioContext.loop = false // 是否循环播放，默认为 false
    wx.setInnerAudioOption({ // ios在静音状态下能够正常播放音效
    obeyMuteSwitch: false, // 是否遵循系统静音开关，默认为 true。当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音。
    success: function (e) {},
        fail: function (e) {}
    })
    innerAudioContext.src = 'icon/2.mp3' // 音频资源的地址
    innerAudioContext.onPlay()
  },

  //事件处理函数
  goGame: function(event){
    this.addClickAudio();
    var gameType = event.target.id;
    wx.redirectTo({
      url: '../'+gameType+'/play'
    })
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
     // 最高分数
     app.getHeighestScore('endlessScore', function(heighestScore){
      app.globalData.endlessScore = heighestScore || 0;
      that.setData({
        heighestScore: heighestScore || 0
      })
    });
    // 最长时间
    app.getHeighestScore('timeScore', function(heighestScore){
      app.globalData.timeScore = heighestScore || 0;
      that.setData({
        longestTime: heighestScore || 0
      })
    });
  }
})
