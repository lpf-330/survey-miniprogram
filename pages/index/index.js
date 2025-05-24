Page({
    data: {
      recentQuestionnaires: [] // 最近问卷数据
    },
  
    onShow() {
      // 从本地存储加载最近数据
      const allData = wx.getStorageSync('questionnaires') || []
      this.setData({
        recentQuestionnaires: allData.slice(0, 5) // 显示最近5条
      })
    },
  
    // 跳转创建页面
    gotoCreate() {
      wx.navigateTo({
        url: '/pages/create/create'
      })
    },
  
    gotoProfile() {
        wx.switchTab({
          url: '/pages/my/my'
        })
      },
  
    // 查看问卷详情
    viewDetail(e) {
      const id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: `/pages/detail/detail?id=${id}`
      })
    },

    // 新增删除方法
  showDeleteConfirm(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除',
      content: '将永久删除该问卷',
      success: (res) => {
        if (res.confirm) {
          this.deleteQuestionnaire(id)
        }
      }
    })
  },

  deleteQuestionnaire(id) {
    const allData = wx.getStorageSync('questionnaires') || []
    const updatedData = allData.filter(item => item.id !== id)
    
    wx.setStorageSync('questionnaires', updatedData)
    
    this.setData({
      recentQuestionnaires: updatedData.slice(0, 5)
    })
    
    wx.showToast({
      title: '删除成功',
      icon: 'none'
    })
  },

  // 新增跳转详情方法
  navigateToDetail(e) {
    const questionnaireId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${questionnaireId}`
    })
  }
  })