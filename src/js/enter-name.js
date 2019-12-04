const template = document.createElement('template')
template.innerHTML = `
    <p>tjena</p>
`

export default class EnterName extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }
}

window.customElements.define('enter-name', EnterName)
