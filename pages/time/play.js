// play 
var app = getApp()
Page({
  data: {
    typeName: '计时模式',
    score: 0,
    time: 60,
    shouldStop: false,
    blockData:[],
    flag: 0
  },
  onReady: function(){
      var array = [];
      // 先生成一个10个长度的数组
      for(var i = 0; i < 10; i++){
          // 生成一个随机位数为1的数组
          var orderArray = [0,0,0,0];
          var randomNum = Math.floor(Math.random() * 4);
          orderArray[randomNum] = 1;
          array.push({id: i, block: orderArray});
      }
      this.setData({
          blockData: array.reverse()
      });
  },

  addClickAudio:function(modle){
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true // 是否自动开始播放，默认为 false
    innerAudioContext.loop = false // 是否循环播放，默认为 false
    wx.setInnerAudioOption({ // ios在静音状态下能够正常播放音效
    obeyMuteSwitch: false, // 是否遵循系统静音开关，默认为 true。当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音。
    success: function (e) {},
        fail: function (e) {}
    })
    if(modle == 1){
      innerAudioContext.src = 'icon/3.mp3' // 音频资源的地址
    }else{
      innerAudioContext.src = 'icon/1.mp3'
    }
    innerAudioContext.onPlay()
  },

  handleClick: function(events){
      var id = events.currentTarget.id;
      var line = id.split("-")[1];
      var column = id.split("-")[2];
      var isBlack = id.split("-")[3];
      var blockData = this.data.blockData.reverse();
      var score = this.data.score;
      var orderArray = [0,0,0,0];
     
      // 判断是否正确
      if(isBlack != 1 || line != blockData[0].id){
        this.addClickAudio(1);
        this.handleWrong(0, score);
        return;
      }else{
        this.addClickAudio(2);
      }

      // 正确下一个
      // 分数++
      // 最后一个小块的id为分数+10
      score++;
      orderArray[Math.floor(Math.random() * 4)] = 1;
      blockData.push({id: score+10, block: orderArray});
      blockData.shift();
      this.setData({
          silding: true,
          score: score,
          blockData: blockData.reverse()
      });
  },

  //计时器
  timeInterval: function(){
    var that = this;
    var timer = setInterval(function(){
        // 判断是否小于0
        var nowTime = that.data.time;
        
        if(that.data.shouldStop){
          clearInterval(timer);
        }

        if(nowTime > 1){
          that.setData({
            time: nowTime-1
          });
          return;
        }

        that.setData({
          time: nowTime-1
        });
        that.handleWrong(1, that.data.score);
        clearInterval(timer);
      }, 1000);
  },

  //显示
  onLoad: function(){
      var that = this;
      wx.setNavigationBarTitle({
        title: that.data.typeName
      });
        this.timeInterval();
  },

  handleWrong: function( type , score){
      const titleArr = ["游戏结束","时间到！"];
      var _this = this;
      wx.showToast({
            title: titleArr[type],
            icon: 'cancel', 
            duration: 2000,
            complete: function(){
                // 将此分数存入全局变量
                app.globalData.currentScore = score;
                // 停止计数器
                _this.setData({
                  shouldStop: true
                });
                // 若此分数比最高分数还高 将其存入本地
                if(score > app.globalData.timeScore){
                    app.globalData.timeScore = score;
                    wx.setStorageSync('timeScore',score);
                }
                var timer = setTimeout(function(){
                        wx.redirectTo({
                            url: '../end/end?type=time&score=' + score
                        })
                        clearTimeout(timer);
                    }, 2000);
            }
        })
  },
  
})