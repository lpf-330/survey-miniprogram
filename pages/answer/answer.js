Page({
  data: {
    questions: [
      {
        id: 1,
        text: "微信小程序的主要开发语言是什么？",
        options: [
          { id: "A", text: "Java" },
          { id: "B", text: "JavaScript" },
          { id: "C", text: "Python" }
        ],
        correctAnswer: "B"
      },
      {
        id: 2,
        text: "以下哪项是微信小程序的主要配置文件？",
        options: [
          { id: "A", text: "app.js" },
          { id: "B", text: "app.json" },
          { id: "C", text: "index.wxml" }
        ],
        correctAnswer: "B"
      },
      {
        id: 3,
        text: "微信小程序的页面文件扩展名是什么？",
        options: [
          { id: "A", text: ".html" },
          { id: "B", text: ".wxml" },
          { id: "C", text: ".xml" }
        ],
        correctAnswer: "B"
      }
    ],
    currentQuestion: null,
    selectedAnswer: null,
    progress: 0,
    score: 0,
    currentIndex: 0
  },

  onLoad() {
    this.initializeQuestion();
  },

  initializeQuestion() {
    if (this.data.questions.length === 0) {
      wx.showToast({
        title: '暂无题目',
        icon: 'none'
      });
      return;
    }
    this.setData({
      currentQuestion: this.data.questions[this.data.currentIndex]
    });
    this.updateProgress();
  },

  selectAnswer(e) {
    const selectedId = e.currentTarget.dataset.id;
    if (this.data.selectedAnswer === selectedId) {
      this.setData({ selectedAnswer: null });
    } else {
      this.setData({ selectedAnswer: selectedId });
    }
  },

  submitAnswer() {
    const { currentQuestion, selectedAnswer, score, currentIndex, questions } = this.data;
    
    if (!currentQuestion) {
      wx.showToast({
        title: '当前无题目',
        icon: 'none'
      });
      return;
    }
    
    if (!selectedAnswer) {
      wx.showToast({
        title: '请先选择答案',
        icon: 'none'
      });
      return;
    }
    
    let newScore = score;
    if (selectedAnswer === currentQuestion.correctAnswer) {
      newScore += 10;
      wx.showToast({
        title: '回答正确！',
        icon: 'success',
        duration: 1000
      });
    } else {
      wx.showToast({
        title: '回答错误！',
        icon: 'error',
        duration: 1000
      });
    }
    
    this.setData({ score: newScore });

    if (currentIndex < questions.length - 1) {
      this.setData({
        currentIndex: currentIndex + 1,
        selectedAnswer: null
      });
      this.initializeQuestion();
    } else {
      wx.navigateTo({
        url: '/pages/result/result?score=' + this.data.score
      });
    }
  },

  prevQuestion() {
    if (this.data.currentIndex > 0) {
      this.setData({
        currentIndex: this.data.currentIndex - 1,
        selectedAnswer: null
      });
      this.initializeQuestion();
    }
  },

  nextQuestion() {
    if (this.data.currentIndex < this.data.questions.length - 1) {
      this.setData({
        currentIndex: this.data.currentIndex + 1,
        selectedAnswer: null
      });
      this.initializeQuestion();
    }
  },

  updateProgress() {
    const { currentIndex, questions } = this.data;
    const progress = Math.round(((currentIndex + 1) / questions.length) * 100);
    this.setData({ progress });
  }
});