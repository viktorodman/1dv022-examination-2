const template = document.createElement('template')
template.innerHTML = `
    <p>hej</p>
`

export default class GameTimer extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }
}

window.customElements.define('game-timer', GameTimer)
