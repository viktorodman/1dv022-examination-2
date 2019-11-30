
import { template, gameTemplate, startScreen, textTemplate, altTemplate } from './quizTemplates.js'
import { templateCss, startScreenCss, gameTemplateCss } from './quizCss.js'

class QuizQuestion extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(templateCss.content.cloneNode(true))
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this._style = this.shadowRoot.querySelector('.wrapper')
    this._firstQuestion = 'http://vhost3.lnu.se:20080/question/1'
    this._questionURL = this._firstQuestion

    this._currentQuestion = undefined
    this._answerForm = undefined
    this._quizContainer = this.shadowRoot.querySelector('.quizContainer')
    this._playerName = undefined
    this._win = false
    this._answerInput = undefined
  }

  connectedCallback () {
    this._quizContainer.appendChild(startScreen.content.cloneNode(true))
    this.shadowRoot.insertBefore(startScreenCss.content.cloneNode(true), this._style)
    this._enterUserName()
    /* this.startGame() */
  }

  _enterUserName () {
    this.shadowRoot.querySelector('.playButton').addEventListener('click', event => {
      const nameInput = this.shadowRoot.querySelector('.playerName')
      this._playerName = nameInput.value
      this.cleanForm(this._quizContainer)
      this.shadowRoot.querySelector('.startScreen').remove()
      this._quizContainer.appendChild(gameTemplate.content.cloneNode(true))
      this.shadowRoot.insertBefore(gameTemplateCss.content.cloneNode(true), this._style)
      this._answerForm = this.shadowRoot.querySelector('.quizForm')
      this.startGame()
    })
  }

  async startGame () {
    this._currentQuestion = await this.getQuestion()

    this.shadowRoot.querySelector('.answerButton').addEventListener('click', async event => {
      const answer = this.getAnswer()
      const result = await this.sendAnswer(answer)
      this.checkAnswer(result)
    })
  }

  async getQuestion () {
    const pro = await window.fetch(this._questionURL)
    const res = await pro.json()
    this._currentQuestion = res
    this.shadowRoot.querySelector('.question').textContent = res.question

    if (res.alternatives) {
      this.createAltForm()
      this._answerInput = this.shadowRoot.querySelectorAll('input')
    } else {
      this.createTextForm()
      this._answerInput = this.shadowRoot.querySelector('input')
    }
    return res
  }

  getAnswer () {
    let answer
    if (this._currentQuestion.alternatives) {
      this._answerInput.forEach(alt => {
        if (alt.checked) {
          answer = alt.value
        }
      })
    } else {
      answer = this._answerInput.value
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
    if (answer.message === 'Correct answer!') {
      if (answer.nextURL) {
        this._questionURL = answer.nextURL
        this.getQuestion()
      } else {
        console.log('you win')
      }
      console.log('correct')
    } else {
      console.log('you lose')
    }
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
    this._answerForm.appendChild(textTemplate.content.cloneNode(true))
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
      const textNode = document.createTextNode(Object.values(alt)[i])
      label.htmlFor = `r${i + 1}`
      radioButton.id = `r${i + 1}`
      radioButton.value = Object.keys(alt)[i]
      label.appendChild(radioButton)
      label.appendChild(textNode)
      this._answerForm.appendChild(label)
    }
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
