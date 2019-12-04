
import { template, gameTemplate, textTemplate, altTemplate, winTemplate, loseTemplate } from './quizTemplates.js'
import { templateCss, gameTemplateCss, winTemplateCss, loseTemplateCss } from './quizCss.js'
/**
 * Represents a QuizApp
 *
 * @class QuizQuestion
 * @extends {window.HTMLElement}
 */
class QuizQuestion extends window.HTMLElement {
  /**
   * Creates an instance of QuizQuestion.
   *
   * @memberof QuizQuestion
   */
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
    this._answerInput = undefined

    this._intervalID = null
    this._maxTime = 20
    this._totalTime = 0
    this._currentTime = this._maxTime
    this._timer = undefined
  }

  /**
   * Runs when the element is appended to a document-connected element
   *
   * @memberof QuizQuestion
   */
  connectedCallback () {
    /* this.changeTemplates(startScreen, startScreenCss)
    this.shadowRoot.querySelector('.playButton').addEventListener('click', event => {
      const nameInput = this.shadowRoot.querySelector('.playerName')
      this._playerName = nameInput.value
      this.cleanForm(this._quizContainer)
      this.changeTemplates(gameTemplate, gameTemplateCss, '.startScreen')
      this._answerForm = this.shadowRoot.querySelector('.quizForm')
      this.startGame()
    }) */
    const name = this._quizContainer.querySelector('enter-name')
    name.addEventListener('nameEntered', event => {
      this._playerName = event.detail
      this.cleanForm(this._quizContainer)
      this.startGame()
    })
  }

  /**
   * Starts a new game
   *
   * @memberof QuizQuestion
   */
  async startGame () {
    this._currentQuestion = await this.getQuestion()
    this.createForm()
    this.startTimer()
    this.shadowRoot.querySelector('.answerButton').addEventListener('click', async event => {
      const answer = this.getAnswer()
      const result = await this.sendAnswer(answer)
      this.checkAnswer(result)
    })
  }

  /**
   * Gets a new objectfrom the server
   *
   * @returns {Object} a new object
   * @memberof QuizQuestion
   */
  async getQuestion () {
    const pro = await window.fetch(this._questionURL)
    const res = await pro.json()
    this.shadowRoot.querySelector('.question').textContent = res.question
    return res
  }

  /**
   * Returns the answer that the user entered
   *
   * @returns {string} An answer
   * @memberof QuizQuestion
   */
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

  /**
   * Sends a answer to the server
   *
   * @param {String} myAnswer An answer
   * @returns {Object} returns an Object from the server
   * @memberof QuizQuestion
   */
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

  /**
   * Controlls the returned Object that was recived from the server
   * and decides how the game should continue
   * @param {Object} answer An Object that was sent from the server
   * @memberof QuizQuestion
   */
  async checkAnswer (answer) {
    if (answer.message === 'Correct answer!') {
      if (answer.nextURL) {
        this._questionURL = answer.nextURL
        this._currentQuestion = await this.getQuestion()
        this.createForm()
        this.restartTimer()
      } else {
        this.createGameOverTemplate(winTemplate, winTemplateCss)
        this.restartTimer()
        this.shadowRoot.querySelector('.timeTotal').textContent = this._totalTime
        this.stopTimer()
      }
      console.log('correct')
    } else {
      this.stopTimer()
      this.createGameOverTemplate(loseTemplate, loseTemplateCss)
    }
  }

  /**
 * Calls a new function depending on the question type.
 *
 * @memberof QuizQuestion
 */
  createForm () {
    if (this._currentQuestion.alternatives) {
      this.createAltForm()
      this._answerInput = this.shadowRoot.querySelectorAll('input')
    } else {
      this.createTextForm()
      this._answerInput = this.shadowRoot.querySelector('input')
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
    console.log('tjoho')
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
      const altDiv = altTemp.querySelector('.alternativDiv')
      const textNode = document.createTextNode(Object.values(alt)[i])
      label.htmlFor = `r${i + 1}`
      radioButton.id = `r${i + 1}`
      radioButton.value = Object.keys(alt)[i]
      label.appendChild(radioButton)
      label.appendChild(textNode)
      altDiv.appendChild(label)
      this._answerForm.appendChild(altDiv)
    }
  }

  /**
   * Adds a game over template in the quizContainer div
   *
   * @param {template} newTemp A HTML template
   * @param {template} newCss A HTML template
   * @memberof QuizQuestion
   */
  createGameOverTemplate (newTemp, newCss) {
    this.cleanForm(this._quizContainer)
    this.changeTemplates(newTemp, newCss, '.gameScreen')

    this.playAgain()

    if (newTemp === winTemplate) {
      const highscore = document.createElement('high-score')
      highscore.setAttribute('player', this._playerName)
      highscore.setAttribute('time', this._totalTime)

      this._quizContainer.appendChild(highscore)
    }
  }

  /**
   * Adds templates to the quizContainer div
   * Also removes the old css if the style tags class name is passed
   *
   * @param {template} newHtmlTemplate A HTML template
   * @param {template} newCssTemplate A HTML template
   * @param {html class} oldCss A HTML class
   * @memberof QuizQuestion
   */
  changeTemplates (newHtmlTemplate, newCssTemplate, oldCss) {
    if (oldCss) {
      this.shadowRoot.querySelector(oldCss).remove()
    }
    this.shadowRoot.insertBefore(newCssTemplate.content.cloneNode(true), this._style)
    this._quizContainer.appendChild(newHtmlTemplate.content.cloneNode(true))
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

  /**
   * Starts a timer counting from 20 to 0
   *
   * @memberof QuizQuestion
   */
  startTimer () {
    this._timer = this.shadowRoot.querySelector('.timer')
    this._timer.textContent = this._maxTime
    this._intervalID = setInterval(() => {
      this.changeTimer()
    }, 1000)
  }

  /**
   * Stops the timer
   *
   * @memberof QuizQuestion
   */
  stopTimer () {
    clearInterval(this._intervalID)
    this._timer.textContent = this._maxTime
    this._currentTime = this._maxTime
  }

  /**
   * Updates the displays timer
   *
   * @memberof QuizQuestion
   */
  changeTimer () {
    this._currentTime -= 1
    this._timer.textContent = this._currentTime
    console.log('hej')
    if (this._currentTime === 0) {
      this.stopTimer()
      this.createGameOverTemplate(loseTemplate, loseTemplateCss)
    }
  }

  /**
   * resets the clock and start it again
   *
   * @memberof QuizQuestion
   */
  restartTimer () {
    this._totalTime += this._maxTime - this._currentTime
    this._currentTime = this._maxTime
    clearInterval(this._intervalID)
    this.startTimer()
  }

  /**
   * adds an event listener to a button with the class name "playAgain"
   *
   * @memberof QuizQuestion
   */
  playAgain () {
    this.shadowRoot.querySelector('.playAgain').addEventListener('click', event => {
      this.cleanForm(this._quizContainer)
      this.changeTemplates(gameTemplate, gameTemplateCss, '.gameOverTemp')
      this._questionURL = this._firstQuestion
      this._answerForm = this.shadowRoot.querySelector('.quizForm')
      this._totalTime = 0
      this.startGame()
      console.log('pelle')
    })
  }
}

window.customElements.define('quiz-question', QuizQuestion)
