
/**
 * Module for QuizQuestions
 *
 * @module src/js/quiz-questions
 * @author Viktor Ödman
 * @version 1.1.0
*/

/**
 * Represent a quiz games server requests
 *
 * @class QuizQuestions
 * @extends {window.HTMLElement}
 */
class QuizQuestions extends window.HTMLElement {
  /**
   * Creates an instance of QuizQuestions.
   * @memberof QuizQuestions
   */
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

  /**
   * Resives a question from the server
   *
   * @memberof QuizQuestions
   */
  async getQuestion () {
    let res = await window.fetch(this._questionURL)
    res = await res.json()
    this.question = res
    this.nextURL = res.nextURL
  }

  /**
   * Gets the current question Object
   *
   * @returns {object} A question object
   * @memberof QuizQuestions
   */
  setQuestion () {
    return this.question
  }

  setFirstQuestion () {
    this._questionURL = this._firstQuestion
  }

  /**
   * Sends a answer to the the server and recives a message
   *
   * @param {string} myAnswer The answer to send to the server
   * @returns {object} returns an Object with a answer
   * @memberof QuizQuestions
   */
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
    } else {
      this.setFirstQuestion()
      await this.getQuestion()
    }
    return res
  }
}

window.customElements.define('quiz-questions', QuizQuestions)
