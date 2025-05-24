Page({
    data: {
      userInfo: {
        avatar: '',
        nickname: '',
        email: '',
        phone: ''
      }
    },
  
    onLoad() {
      this.loadUserInfo()
    },
  
    // 加载用户信息
    loadUserInfo() {
      const info = wx.getStorageSync('userProfile') || {}
      this.setData({ userInfo: info })
    },
  
    // 选择头像
    chooseAvatar() {
      wx.chooseImage({
        count: 1,
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0]
          this.setData({
            'userInfo.avatar': tempFilePath
          })
        }
      })
    },
  
    // 保存信息
    saveProfile(e) {
      const formData = e.detail.value
      const newInfo = {
        ...this.data.userInfo,
        ...formData
      }
  
      if (!this.validateForm(newInfo)) return
  
      wx.setStorageSync('userProfile', newInfo)
      wx.showToast({ title: '保存成功' })
    },
  
    // 表单验证
    validateForm(data) {
      if (!data.nickname.trim()) {
        wx.showToast({ title: '昵称不能为空', icon: 'none' })
        return false
      }
      
      if (data.phone && !/^1[3-9]\d{9}$/.test(data.phone)) {
        wx.showToast({ title: '手机号格式错误', icon: 'none' })
        return false
      }
  
      if (data.email && !/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(data.email)) {
        wx.showToast({ title: '邮箱格式错误', icon: 'none' })
        return false
      }
  
      return true
    }
  })