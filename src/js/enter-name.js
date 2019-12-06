/**
 * Module for EnterName
 *
 * @module src/js/enter-name
 * @author Viktor Ödman
 * @version 1.1.0
*/

const template = document.createElement('template')
template.innerHTML = `
<style>
    :host {
        text-align: center;
        font-size: 30px;
    }
  button {
        font-size: 30px;
        margin-bottom: 20px;
        background-color: #f2b83a;
        transition-duration: 0.4s;
        padding-left: 30px;
        padding-right: 30px;
        margin-top: 20px;
    }
    button:hover {
        background-color: #cfcfcf;
    }
    input[type="text"] {
        font-size: 30px;
        text-align: center;
        margin-bottom: 20px;
        border: none;
        border-bottom: 2px solid #f2b83a;
        background-color: #333;
        color: #f2b83a;
        width: 30%;
    }
    input[type="text"]::placeholder {
        color: #f2b83a;
        opacity: 1;
    }
    .quizTitle {
        font-size: 60px;
        margin: 0px;
        padding-top: 15px;
        color: #f2b83a;
    }
</style>

    <div>
      <h2 class="quizTitle">QUIZ APP</h2>
    </div>
    <div>
      <p class="description">Enter your name and press Play to start the quiz</p>
    </div>
    <div>
      <input class="playerName" type="text" placeholder="Name">
    </div>
    <div>
    <button class="nameButton">Play</button>
    </div>
    <div>
        <p class="errorMessage"></p>
    </div>
`
/**
 * Represents a name form
 *
 * @class EnterName
 * @extends {window.HTMLElement}
 */
class EnterName extends window.HTMLElement {
  /**
   * Creates an instance of EnterName.
   * @memberof EnterName
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this.button = this.shadowRoot.querySelector('.nameButton')
    this._input = this.shadowRoot.querySelector('.playerName')
    this._error = this.shadowRoot.querySelector('.errorMessage')
    this.name = undefined
  }

  /**
   * Runs when the element is appended to a document-connected element
   *
   * @memberof QuizApp
   */
  connectedCallback () {
    this.button.addEventListener('click', () => this.addName())
  }

  /**
   * Adds the entered name
   *
   * @memberof EnterName
   */
  addName () {
    if (this._input.value.length > 0) {
      this.name = this._input.value
      this.dispatchEvent(new window.CustomEvent('nameEntered', { detail: this.name }))
    } else {
      this._error.textContent = 'Fyll i ett namn'
    }
  }
}

window.customElements.define('enter-name', EnterName)
