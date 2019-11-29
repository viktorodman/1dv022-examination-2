
import { template, gameTemplate, startScreen, textTemplate, altTemplate } from './quizTemplate.js'

class QuizQuestion extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this._questionURL = 'http://vhost3.lnu.se:20080/question/1'
    this._firstQuestion = 'http://vhost3.lnu.se:20080/question/1'
    this._currentQuestion = undefined
    this._answerForm = undefined
    this._quizContainer = this.shadowRoot.querySelector('.quizContainer')
    this._button = this.shadowRoot.querySelector('.wrapper button')
    this._textBox = undefined
    this._isAltQuestion = false
    this._nameEnter = this._enterUserName.bind(this)
    this._playerName = undefined
    this._win = false
  }

  connectedCallback () {
    this.createStartScreen()

    this._button.addEventListener('click', this._nameEnter, true)

    /* this.startGame() */
  }

  _enterUserName () {
    const input = this.shadowRoot.querySelector('.quizContainer input')
    this._playerName = input.value
    this._button.removeEventListener('click', this._nameEnter, true)
    this.createGameTemplate()
    this._answerForm = this.shadowRoot.querySelector('.quizForm')
    this.startGame()
  }

  async startGame () {
    const question = await this.getQuestion()
    this.setQuestion(question)
    this._button.addEventListener('click', async event => {
      // Get the answer
      const answer = this.getAnswer()
      // Send Answer
      const result = await this.sendAnswer(answer)
      console.log(result)
      // Check if the answer is correct
      if (this.checkAnswer(result)) {
        if (this._win) {
          this.createWinTemplate()
        } else {
          const newQuestion = await this.getQuestion()
          this.setQuestion(newQuestion)
        }
      } else {
        this.createLoseTemplate()
      }
    })
  }

  async getQuestion () {
    const pro = await window.fetch(this._questionURL)
    const res = await pro.json()
    this._currentQuestion = res

    if (res.alternatives) {
      this.createAltForm()
      this._isAltQuestion = true
    } else {
      this.createTextForm()
      this._textBox = this.shadowRoot.querySelector('quizForm input')
      this._isAltQuestion = false
    }
    console.log(res)
    return res.question
  }

  getAnswer () {
    let answer

    if (this._isAltQuestion) {
      const radioButtons = this._answerForm.querySelectorAll('input')

      radioButtons.forEach(button => {
        if (button.checked) {
          answer = button.value
        }
      })
      console.log(answer)
    } else {
      const textForm = this._answerForm.querySelector('input')

      answer = textForm.value
    }

    return answer
  }

  async sendAnswer (myAnswer) {
    const data = {
      answer: myAnswer
    }

    const res = await window.fetch(this._currentQuestion.nextURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    return res.json()
  }

  checkAnswer (answer) {
    let result = false
    if (answer.message === 'Correct answer!') {
      if (answer.nextURL) {
        this._questionURL = answer.nextURL
        result = true
      } else {
        this._win = true
      }
      console.log('correct')
    } else {
      this._questionURL = this._firstQuestion
    }
    return result
  }

  /**
   *
   *
   * @param {string} question A new question
   * @memberof QuizQuestion
   */
  setQuestion (question) {
    const q = this.shadowRoot.querySelector('.question')
    q.textContent = question
  }

  createGameTemplate () {
    this.cleanForm(this._quizContainer)
    this._quizContainer.appendChild(gameTemplate.content.cloneNode(true))
  }

  createStartScreen () {
    this._quizContainer.appendChild(startScreen.content.cloneNode(true))
  }

  /**
   * Add a input text field in the quizForm div
   *
   * @memberof QuizQuestion
   */
  createTextForm () {
    console.log(this._answerForm)
    if (this._answerForm.childElementCount > 0) {
      this.cleanForm(this._answerForm)
    }
    this._quizContainer.appendChild(textTemplate.content.cloneNode(true))
  }

  /**
   * Adds radio buttons to the quizForm div
   *
   * @memberof QuizQuestion
   */
  createAltForm () {
    if (this._answerForm.childElementCount > 0) {
      console.log('clean')
      this.cleanForm(this._answerForm)
    }

    const alt = this._currentQuestion.alternatives
    let altTemp
    for (let i = 0; i < Object.keys(alt).length; i++) {
      altTemp = document.importNode(altTemplate.content, true)
      const label = altTemp.querySelector('label')
      const radioButton = altTemp.querySelector('input')
      label.htmlFor = `r${i + 1}`
      label.textContent = Object.values(alt)[i]
      radioButton.id = `r${i + 1}`
      radioButton.value = Object.keys(alt)[i]
      this._answerForm.appendChild(label)
      this._answerForm.appendChild(radioButton)
    }
  }

  createWinTemplate () {
    this.cleanForm(this._quizContainer)

    const winTemplate = document.createElement('template')

    winTemplate.innerHTML = /* HTML */ `
      <h1>YOU WON ! GZ</h1>
    `
    this._quizContainer.appendChild(winTemplate.content.cloneNode(true))
  }

  createLoseTemplate () {
    this.cleanForm(this._quizContainer)

    const loseTemplate = document.createElement('template')

    loseTemplate.innerHTML = /* HTML */ `
      <h1>YOU LOSE ! :(</h1>
    `
    this._quizContainer.appendChild(loseTemplate.content.cloneNode(true))
  }

  /**
   * Removes all child elements of the passed element
   *
   * @param {HTMLElement} element A HTML element
   * @memberof QuizQuestion
   */
  cleanForm (element) {
    while (element.hasChildNodes()) {
      element.removeChild(element.firstChild)
    }
  }
}

window.customElements.define('quiz-question', QuizQuestion)
