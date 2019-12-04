const template = document.createElement('template')
template.innerHTML = `
    <p class="timer">hej</p>
`

export default class GameTimer extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.intervalID = null
    this.currentTime = this.maxTime
    this.maxTime = 20
    this.timerDisplay = this.shadowRoot.querySelector('.timer')
    this.totalTime = 0
  }

  connectedCallback () {
    this.timerDisplay.textContent = this.maxTime
    /* this.intervalID = setInterval(() => {
      this.updateTimer()
    }, 1000) */
  }

  updateTimer () {
    this.currentTime -= 1
    this.totalTime++
    this.timerDisplay.textContent = this.currentTime
    if (this.currentTime === 15) {
      this.resetTimer()
    }
    console.log(this.totalTime)
  }

  stopTimer () {
    clearInterval(this.intervalID)
  }

  resetTimer () {
    this.timerDisplay.textContent = 20
    this.currentTime = this.maxTime
  }

  resetTotalTimer () {

  }
}

window.customElements.define('game-timer', GameTimer)
