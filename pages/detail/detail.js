Page({
    data: {
        loading: true,
        notFound: false,
        questionnaire: null
    },

    onLoad(options) {
        this.loadData(options.id)
    },

    // 加载问卷数据
    loadData(id) {
        const questionnaires = wx.getStorageSync('questionnaires') || []
        const target = questionnaires.find(q => q.id == id)

        if (target) {
            this.setData({
                questionnaire: this.processData(target),
                loading: false
            })
        } else {
            this.setData({
                loading: false,
                notFound: true
            })
        }
    },

    // 数据预处理
    processData(data) {
        console.log('处理后的问卷数据：', data) // 调试数据流

        // 添加类型映射关系
        const typeMap = {
            1: { typeName: '单选题', component: 'radio' },
            2: { typeName: '多选题', component: 'checkbox' },
            3: { typeName: '简答题', component: 'text' }
        }

        return {
            ...data,
            questions: data.questions.map(q => ({
                ...q,
                typeName: typeMap[q.type].typeName,
                type: q.type
            }))
        }
    }
})

// 状态文本过滤器（在JS中注册）
// wx.addFilter('statusTextFilter', value => {
//     const map = { draft: '草稿', published: '已发布', closed: '已关闭' }
//     return map[value] || '未知状态'
// })