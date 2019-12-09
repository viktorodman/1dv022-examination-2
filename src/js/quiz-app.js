/**
 * Module for QuizApp
 *
 * @module src/js/quiz-app
 * @author Viktor Ödman
 * @version 1.1.0
*/

import { template, gameTemplate, textTemplate, altTemplate, winTemplate, loseTemplate } from './quizTemplates.js'
import { templateCss, gameTemplateCss, winTemplateCss, loseTemplateCss } from './quizCss.js'

/**
 * Represents a QuizApp
 *
 * @class QuizApp
 * @extends {window.HTMLElement}
 */
class QuizApp extends window.HTMLElement {
  /**
   * Creates an instance of QuizApp.
   *
   * @memberof QuizApp
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

    this._timer = undefined

    this._quizQuestion = this.shadowRoot.querySelector('quiz-questions')
  }

  /**
   * Runs when the element is appended to a document-connected element
   *
   * @memberof QuizApp
   */
  connectedCallback () {
    const name = this._quizContainer.querySelector('enter-name')
    name.addEventListener('nameEntered', event => {
      this._playerName = event.detail
      this.cleanForm(this._quizContainer)
      this.changeTemplates(gameTemplate, gameTemplateCss)
      this.startGame()
    })
  }

  /**
   * Starts a new game
   *
   * @memberof QuizApp
   */
  async startGame () {
    this._timer = this.shadowRoot.querySelector('game-timer')

    this._timer.addEventListener('timezero', async event => {
      this.createGameOverTemplate(loseTemplate, loseTemplateCss)
      this._quizQuestion.setFirstQuestion()
      await this._quizQuestion.getQuestion()
    })

    this._currentQuestion = this._quizQuestion.setQuestion()
    this.shadowRoot.querySelector('.question').textContent = this._currentQuestion.question
    this.createForm()
    this.shadowRoot.querySelector('.answerButton').addEventListener('click', async event => {
      event.preventDefault()
      const answer = this.getAnswer()
      const res = await this._quizQuestion.sendAnswer(answer)
      if (res.nextURL) {
        this._currentQuestion = this._quizQuestion.setQuestion()
        this.shadowRoot.querySelector('.question').textContent = this._currentQuestion.question
        this.createForm()
        this._timer.resetTimer()
      }
      if (res.message === 'Correct answer!' && !res.nextURL) {
        this._timer.stopTimer()

        this.createGameOverTemplate(winTemplate, winTemplateCss)
        this.shadowRoot.querySelector('.timeTotal').textContent = this._timer.getTotalTime()
      }
      if (res.message === 'Wrong answer! :(') {
        this._timer.stopTimer()
        this.createGameOverTemplate(loseTemplate, loseTemplateCss)
      }
    })
  }

  /**
   * Returns the answer that the user entered
   *
   * @returns {string} An answer
   * @memberof QuizApp
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
 * Calls a new function depending on the question type.
 *
 * @memberof QuizApp
 */
  createForm () {
    this._answerForm = this.shadowRoot.querySelector('.quizForm')

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
   * @memberof QuizApp
   */
  createTextForm () {
    if (this._answerForm.childElementCount > 0) {
      this.cleanForm(this._answerForm)
    }
    this._answerForm.appendChild(textTemplate.content.cloneNode(true))
  }

  /**
   * Adds radio buttons to the quizForm div
   *
   * @memberof QuizApp
   */
  createAltForm () {
    if (this._answerForm.childElementCount > 0) {
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
   * @memberof QuizApp
   */
  createGameOverTemplate (newTemp, newCss) {
    this.cleanForm(this._quizContainer)
    this.changeTemplates(newTemp, newCss, '.gameScreen')

    this.playAgain()

    if (newTemp === winTemplate) {
      const highscore = document.createElement('high-score')
      highscore.setAttribute('player', this._playerName)
      highscore.setAttribute('time', this._timer.getTotalTime())

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
   * @memberof QuizApp
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
   * @memberof QuizApp
   */
  cleanForm (element) {
    while (element.hasChildNodes()) {
      element.removeChild(element.firstChild)
    }
  }

  /**
   * adds an event listener to a button with the class name "playAgain"
   *
   * @memberof QuizApp
   */
  playAgain () {
    this.shadowRoot.querySelector('.playAgain').addEventListener('click', event => {
      this.cleanForm(this._quizContainer)
      this.changeTemplates(gameTemplate, gameTemplateCss, '.gameOverTemp')
      this.startGame()
    })
  }
}

window.customElements.define('quiz-app', QuizApp)
