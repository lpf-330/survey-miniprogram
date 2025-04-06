Page({  
  data: {  
    title: '问卷调查系统'  
  },  
  
  startQuestionnaire() {  
    wx.navigateTo({  
      url: '/pages/answer/answer'  
    });  
  }  
});  