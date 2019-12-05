const template = document.createElement('template')
template.innerHTML = `
    <style>
        :host {
            font-size: 110px;
        }
        p {
            margin: 0;
        }
    </style>
    <p class="timer"></p>
`
/**
 * Represents a timer
 *
 * @export
 * @class GameTimer
 * @extends {window.HTMLElement}
 */
class GameTimer extends window.HTMLElement {
  /**
   * Creates an instance of GameTimer.
   * @memberof GameTimer
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.intervalID = null
    this.maxTime = 20
    this.currentTime = this.maxTime
    this.timerDisplay = this.shadowRoot.querySelector('.timer')
    this.totalTime = undefined
    this.startTime = undefined
    this.stopTime = undefined
  }

  /**
   * Runs when the element is appended to a document-connected element
   *
   * @memberof QuizApp
   */
  connectedCallback () {
    this.startTime = Date.now()
    this.timerDisplay.textContent = this.maxTime
    this.intervalID = setInterval(() => {
      this.updateTimer()
    }, 1000)
  }

  /**
   * Removes a second from the timer and display the new time
   *
   * @memberof GameTimer
   */
  updateTimer () {
    this.currentTime -= 1
    this.timerDisplay.textContent = this.currentTime
    if (this.currentTime === 0) {
      this.dispatchEvent(new window.CustomEvent('timezero'))
      this.stopTimer()
    }
  }

  /**
   * Stops the timer
   *
   * @memberof GameTimer
   */
  stopTimer () {
    clearInterval(this.intervalID)
  }

  /**
   * Returns the total time from when the timer was started
   *
   * @returns {number} the total time from when the timer was started
   * @memberof GameTimer
   */
  getTotalTime () {
    this.stopTime = Date.now()
    const totalTime = (this.stopTime - this.startTime) / 1000
    return totalTime.toFixed(2)
  }

  /**
   * Resets the timer
   *
   * @memberof GameTimer
   */
  resetTimer () {
    this.timerDisplay.textContent = 20
    this.currentTime = this.maxTime
  }
}

window.customElements.define('game-timer', GameTimer)
