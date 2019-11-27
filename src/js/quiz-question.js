
const template = document.createElement('template')
template.innerHTML = `
<p>Hello World</p>
`

class QuizQuestion extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }
}

window.customElements.define('quiz-question', QuizQuestion)
