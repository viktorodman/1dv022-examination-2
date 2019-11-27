
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
        <p>hej</p>
    </div>
</div>
`

class QuizQuestion extends window.HTMLElement {
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))

    this._currentQuestion = undefined
    this.answerDiv = this.shadowRoot.querySelector('.quizAnswer')
  }

  async connectedCallback () {
    await this.getQuestion()

    this.createTextForm()
    this.setQuestion()
  }

  async getQuestion () {
    const pro = await window.fetch('http://vhost3.lnu.se:20080/question/1')
    const res = await pro.json()

    this._currentQuestion = res
  }

  setQuestion () {
    const q = this.shadowRoot.querySelector('.question')

    q.textContent = this._currentQuestion.question
  }

  createTextForm () {
    this.answerDiv.innerHTML = ''
  }
}

window.customElements.define('quiz-question', QuizQuestion)
