class QuizQuestions extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })

    this.currentQuestion = undefined
  }

  connectedCallback () {

  }

  getQuestion () {

  }

  setQuestion () {

  }

  setAnswer () {

  }
}

window.customElements.define('quiz', QuizQuestions)
