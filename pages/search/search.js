Page({
    data: {
      searchKeyword: '',
      searchResults: [],
      showEmpty: false,
      autoFocus: true,
      hotKeywords: ['满意度', '调研', '2023', '产品反馈']
    },
  
    handleSearchInput: debounce(function(e) {
      const keyword = e.detail.value.trim()
      this.setData({ searchKeyword: keyword })
      this.executeSearch(keyword)
    }, 300),
  
    executeSearch(keyword) {
      if (!keyword) {
        this.setData({ searchResults: [], showEmpty: false })
        return
      }
  
      const allData = wx.getStorageSync('questionnaires') || []
      const results = allData.map(q => {
        const matchCount = this.calculateMatch(q, keyword)
        return matchCount > 0 ? { ...q, matchCount } : null
      }).filter(Boolean)
  
      this.setData({
        searchResults: results,
        showEmpty: results.length === 0
      })
    },
  
    calculateMatch(questionnaire, keyword) {
      let count = 0
      const kw = keyword.toLowerCase()
      
      count += (questionnaire.title.toLowerCase().split(kw).length - 1)
      
      questionnaire.questions.forEach(q => {
        count += (q.content.toLowerCase().split(kw).length - 1)
        if (q.options) {
          q.options.forEach(opt => {
            count += (opt.text.toLowerCase().split(kw).length - 1)
          })
        }
      })
      
      return count
    },
  
    clearSearch() {
      this.setData({ 
        searchKeyword: '',
        searchResults: [],
        showEmpty: false
      })
    },
  
    quickSearch(e) {
      const keyword = e.currentTarget.dataset.keyword
      this.setData({ searchKeyword: keyword })
      this.executeSearch(keyword)
    },
  
    navigateToDetail(e) {
      wx.navigateTo({
        url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}`
      })
    }
  })
  
  function debounce(fn, delay) {
    let timer = null
    return function(...args) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => fn.apply(this, args), delay)
    }
  }