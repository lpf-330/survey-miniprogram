const INIT_QUESTION = {
    type: 1,
    typeName: '单选题',
    content: '',
    options: [{ oid: Date.now(), text: '' }]
}

Page({
    data: {
        isEdit: false,
        qid: null,
        title: '未命名问卷',
        questions: [JSON.parse(JSON.stringify(INIT_QUESTION))],
        questionTypes: [
            { name: '单选题', value: 1 },
            { name: '多选题', value: 2 },
            { name: '简答题', value: 3 }
        ]
    },

    onLoad(options) {
        if (options.id) {
            const qid = options.id
            const data = wx.getStorageSync('questionnaires') || []
            const target = data.find(item => item.id == qid)
            if (target) {
                this.setData({
                    isEdit: true,
                    qid,
                    title: target.title,
                    questions: target.questions
                })
            }
        }
    },

    updateTitle(e) {
        this.setData({ title: e.detail.value })
    },

    addQuestion() {
        const newQuestion = JSON.parse(JSON.stringify(INIT_QUESTION))
        this.setData({
            questions: [...this.data.questions, newQuestion]
        })
    },

    removeQuestion(e) {
        const index = e.currentTarget.dataset.index
        const newQuestions = this.data.questions.filter((_, i) => i !== index)
        this.setData({ questions: newQuestions })
    },

    updateQuestion(e) {
        const { index } = e.currentTarget.dataset
        const value = e.detail.value
        const key = `questions[${index}].content`
        this.setData({ [key]: value })
    },

    addOption(e) {
        const qIndex = e.currentTarget.dataset.index
        const key = `questions[${qIndex}].options`
        const newOption = { oid: Date.now(), text: '' }
        const options = [...this.data.questions[qIndex].options, newOption]
        this.setData({ [key]: options })
    },

    // 新增选项内容更新方法
    updateOption(e) {
        const qindex = parseInt(e.currentTarget.dataset.qindex)
        console.log('qindex',qindex);
        const oidx = parseInt(e.currentTarget.dataset.oidx)
        console.log('oidx',e.currentTarget.dataset.oidx);
        console.log('e',e.currentTarget);
        const value = e.detail.value
        const key = `questions[${qindex}].options[${oidx}].text`
        this.setData({
          [key]: value
        })
      },
    
      removeOption(e) {
        const qindex = parseInt(e.currentTarget.dataset.qindex)
        const oidx = parseInt(e.currentTarget.dataset.oidx)
        const key = `questions[${qindex}].options`
        const options = this.data.questions[qindex].options.filter((_, i) => i !== oidx)
        this.setData({
          [key]: options
        })
      },

  // 新增问题类型切换方法（配套修复）
  changeType(e) {
    const { index } = e.currentTarget.dataset
    const typeValue = e.detail.value
    const typeMap = {
      0: { type: 1, typeName: '单选题' },
      1: { type: 2, typeName: '多选题' },
      2: { type: 3, typeName: '简答题' }
    }
    
    const key = `questions[${index}]`
    const updated = { 
      ...this.data.questions[index],
      ...typeMap[typeValue]
    }
    
    // 清除选项当切换为简答题
    if (updated.type === 3) {
      updated.options = []
    }

    this.setData({
      [key]: updated
    })
  },

    saveQuestionnaire() {
        if (!this.data.title.trim()) {
            wx.showToast({ title: '请输入标题', icon: 'none' })
            return
        }

        const newData = {
            id: this.data.qid || Date.now(),
            title: this.data.title,
            questions: this.data.questions,
            createTime: new Date().toLocaleString(),
            lastModified: new Date().toLocaleString(),
            status: 'draft'
        }

        const stored = wx.getStorageSync('questionnaires') || []
        const updated = this.data.isEdit
            ? stored.map(item => item.id === this.data.qid ? newData : item)
            : [...stored, newData]

        wx.setStorageSync('questionnaires', updated)
        wx.navigateBack()
    }
})