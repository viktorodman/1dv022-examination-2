class HighScore extends window.HTMLElement {
  constructor () {
    super()
    this.time = undefined
  }

  connectedCallback () {

  }
}

window.customElements.define('high-score', HighScore)
