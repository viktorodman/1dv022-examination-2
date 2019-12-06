class QuizQuestions extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })

    this._firstQuestion = 'http://vhost3.lnu.se:20080/question/1'
    this._questionURL = this._firstQuestion
    this.question = undefined
    this.nextURL = undefined
  }

  connectedCallback () {
    /* this.dispatchEvent(new window.CustomEvent('newquestion'), { detail: 'hej' }) */
    this.getQuestion()
  }

  async getQuestion () {
    let res = await window.fetch(this._questionURL)
    res = await res.json()
    this.question = res
    this.nextURL = res.nextURL
  }

  setQuestion () {
    return this.question
  }

  setAnswer () {
    console.log('då')
  }

  async sendAnswer (myAnswer) {
    const data = {
      answer: myAnswer
    }

    let res = await window.fetch(this.nextURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    res = await res.json()

    if (res.nextURL) {
      this._questionURL = await res.nextURL
      await this.getQuestion()
      this.dispatchEvent(new window.CustomEvent('newQuestion', { detail: res }))
    }
    if (res.message === 'Correct answer!' && !res.nextURL) {
      this._questionURL = this._firstQuestion
      await this.getQuestion()
      this.dispatchEvent(new window.CustomEvent('win'))
      console.log('2')
    }
    if (res.message === 'Wrong answer! :(') {
      this._questionURL = this._firstQuestion
      await this.getQuestion()
      this.dispatchEvent(new window.CustomEvent('lose'))
      console.log('3')
    }
  }
}

window.customElements.define('quiz-questions', QuizQuestions)
