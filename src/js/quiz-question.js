
const template = document.createElement('template')
template.innerHTML = `
<style>
.quizContainer {
    width: 900px;
    height: 700px;
    background-color: #333;
    margin: 0 auto;
}
.quizHeader {
    /* width: 90%; */
    height: 10%;
    background-color: blue;
    font-size: 50px;
    margin: 0 auto;
    text-align: center;
}
.quizMain {
    /* width: 90%; */
    height: 40%;
    background-color: red;
    margin: 0 auto;
    text-align: center;
}
.quizInfo {
    height: 10%;
    background-color: yellow;
    font-size: 30px;
    padding: 10px;
}
.quizAnswer {
    background-color: violet;
    height: 40%;
    text-align: center;
}
.question {
    margin: 0;
    padding: 5px;
    font-size: 40px;
}
.playerName {
    float: right;
}
p {
    padding: 0;
    margin: 0;
}
input {
   
}
</style>

<div class="quizContainer">
    <div class="quizHeader">
        <p>Question: <span id="questionNumber"></span></p>
    </div>
    <div class="quizMain">
        <p class="question"></p>
    </div>
    <div class="quizInfo">
        <span class="timer">TIMER</span>
        <span class="playerName">PLAYER: </span>
    </div>
    <div class="quizAnswer">
        <div class="quizForm">
          
        </div>
        <button>Submit</button>
    </div>
</div>
`

class QuizQuestion extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this._questionURL = 'http://vhost3.lnu.se:20080/question/1'
    this._firstQuestion = 'http://vhost3.lnu.se:20080/question/1'
    this._answerURL = undefined
    this._currentQuestion = undefined
    this._answerForm = this.shadowRoot.querySelector('.quizForm')
    this._button = this.shadowRoot.querySelector('.quizAnswer button')
    this._textBox = undefined
  }

  async connectedCallback () {
    await this.getQuestion()

    this.createTextForm()
    this._button.addEventListener('click', async event => {
      console.log(await this.sendAnswer())
    })
    this.setQuestion()
  }

  async getQuestion () {
    const pro = await window.fetch(this._questionURL)
    const res = await pro.json()

    this._currentQuestion = res
    this._answerURL = res.nextURL
  }

  setQuestion () {
    const q = this.shadowRoot.querySelector('.question')

    q.textContent = this._currentQuestion.question
  }

  async sendAnswer () {
    const data = {
      answer: this._textBox.value
    }

    const res = await window.fetch(this._answerURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    return res.json()
  }

  createTextForm () {
    this._answerForm.innerHTML = ''
    const textBox = document.createElement('input')
    textBox.setAttribute('type', 'text')
    this._answerForm.appendChild(textBox)
    this._textBox = textBox
  }
}

window.customElements.define('quiz-question', QuizQuestion)
