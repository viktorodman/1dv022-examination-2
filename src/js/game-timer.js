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

export default class GameTimer extends window.HTMLElement {
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

  connectedCallback () {
    this.startTime = Date.now()
    this.timerDisplay.textContent = this.maxTime
    this.intervalID = setInterval(() => {
      this.updateTimer()
    }, 1000)
  }

  updateTimer () {
    this.currentTime -= 1
    this.timerDisplay.textContent = this.currentTime
    if (this.currentTime === 0) {
      this.dispatchEvent(new window.CustomEvent('timezero'))
      this.stopTimer()
    }
  }

  stopTimer () {
    clearInterval(this.intervalID)
  }

  getTotalTime () {
    this.stopTime = Date.now()
    const totalTime = (this.stopTime - this.startTime) / 1000
    return totalTime.toFixed(2)
  }

  resetTimer () {
    this.timerDisplay.textContent = 20
    this.currentTime = this.maxTime
  }
}

window.customElements.define('game-timer', GameTimer)
