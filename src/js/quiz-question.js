
const template = document.createElement('template')
template.innerHTML = `
<style>
.wrapper {
  width: 900px;
  /* height: 500px; */
  background-color: #333;
  margin: 0 auto;
  border-radius: 20px;
  color: white;
  text-align: center;
}
.quizContainer {
   margin: 0 auto;
}
.quizHeader {
    /* width: 90%; */
    height: 10%;
    /* background-color: blue; */
    font-size: 50px;
    margin: 0 auto;
    text-align: center;
}
.quizMain {
    /* width: 90%; */
    height: 40%;
    /* background-color: red; */
    margin: 0 auto;
    text-align: center;
    
}
.quizInfo {
    height: 10%;
    /* background-color: yellow; */
    font-size: 30px;
    padding: 10px;
}
.quizAnswer {
    /* background-color: violet; */
    height: 40%;
    text-align: center;
}
.question {
    margin: 0;
    padding-top: 60px;
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
  /*  width: 150px;
   height: 50px;
   font-size: 30px; */
}
label {
  font-size: 30px;
}
button {
  margin-top: 10px;
  margin-bottom: 10px;
  border: 2px solid white;
  font-size: 45px;
  color: white;
  background-color: black;
}

input[type="text"] {
    font-size:25px;
}

</style>
<div class="wrapper">
  <div class="quizContainer"> 
    
  </div>
  <button>Submit</button>
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
    this._quizContainer = this.shadowRoot.querySelector('.quizContainer')
    this._button = this.shadowRoot.querySelector('.wrapper button')
    this._textBox = undefined
    this._answer = undefined
    this._isAltQuestion = false
    this._nameEnter = this._enterUserName.bind(this)
    this._playerName = undefined
  }

  connectedCallback () {
    this.createStartScreen()

    this._button.addEventListener('click', this._nameEnter, true)

    /* this.startGame() */
  }

  _enterUserName () {
    const input = this.shadowRoot.querySelector('.quizContainer input')
    this._playerName = input.value
    this._button.removeEventListener('click', this._nameEnter, true)
    this.createGameTemplate()
    this.startGame()
  }

  async startGame () {
    const question = await this.getQuestion()
    this.setQuestion(question)
    this._button.addEventListener('click', async event => {
      // Get the answer
      const answer = this.getAnswer()
      // Send Answer
      const result = await this.sendAnswer(answer)
      console.log(result)
      // Check if the answer is correct
      this.checkAnswer(result)
      const newQuestion = await this.getQuestion()
      this.setQuestion(newQuestion)
    })
  }

  async getQuestion () {
    const pro = await window.fetch(this._questionURL)
    const res = await pro.json()
    this._currentQuestion = res
    this._answerURL = res.nextURL

    if (res.alternatives) {
      this.createAltForm()
      this._isAltQuestion = true
    } else {
      this.createTextForm()
      this._isAltQuestion = false
    }
    console.log(res)
    return res.question
  }

  getAnswer () {
    let answer

    if (this._isAltQuestion) {
      const radioButtons = this._answerForm.querySelectorAll('input')

      radioButtons.forEach(button => {
        if (button.checked) {
          answer = button.value
        }
      })
      console.log(answer)
    } else {
      const textForm = this._answerForm.querySelector('input')

      answer = textForm.value
    }

    return answer
  }

  async sendAnswer (myAnswer) {
    const data = {
      answer: myAnswer
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

  checkAnswer (answer) {
    let result = false
    if (answer.message === 'Correct answer!') {
      if (answer.nextURL) {
        this._questionURL = answer.nextURL
        result = true
      } else {
        console.log('You won')
      }
      console.log('correct')
    } else {
      this._questionURL = this._firstQuestion
    }
    return result
  }

  /**
   *
   *
   * @param {string} question A new question
   * @memberof QuizQuestion
   */
  setQuestion (question) {
    const q = this.shadowRoot.querySelector('.question')
    q.textContent = question
  }

  createGameTemplate () {
    this.cleanForm(this._quizContainer)
    const gameTemplate = document.createElement('template')

    gameTemplate.innerHTML = `
    <div class="quizHeader">
      <p>Question: <span id="questionNumber"></span></p>
      </div>
      <div class="quizInfo">
          <span class="timer">TIMER</span>
          <span class="playerName">PLAYER: </span>
      </div>
      <div class="quizMain">
          <p class="question"></p>
      </div>
      <div class="quizAnswer">
          <div class="quizForm">
          </div>
      </div>
`
    this._quizContainer.appendChild(gameTemplate.content.cloneNode(true))
  }

  createStartScreen () {
    /*  const enterName = this.shadowRoot.querySelector('.question')

    enterName.textContent = 'ENTER NAME'

    const nameField = document.createElement('input')
    nameField.type = 'text'
    nameField.placeholder = 'Name'

    this._answerForm.appendChild(nameField)
    nameField.focus() */

    const startScreen = document.createElement('template')

    startScreen.innerHTML = `
    <div class="quizHeader">
      <p class="question">ENTER NAME</p>
    </div>
    <div class="quizMain">
      <input type="text" placeholder="name"  class="enterName">
    </div>
    `
    this._quizContainer.appendChild(startScreen.content.cloneNode(true))
  }

  /**
   * Add a input text field in the quizForm div
   *
   * @memberof QuizQuestion
   */
  createTextForm () {
    if (this._answerForm.childElementCount > 0) {
      this.cleanForm(this._answerForm)
    }
    const textBox = document.createElement('input')
    textBox.type = 'text'
    this._answerForm.appendChild(textBox)
    this._textBox = textBox
    console.log('hej')
  }

  /**
   * Adds radio buttons to the quizForm div
   *
   * @memberof QuizQuestion
   */
  createAltForm () {
    const alt = this._currentQuestion.alternatives
    console.log(Object.keys(alt))
    if (this._answerForm.childElementCount > 0) {
      console.log('clean')
      this.cleanForm(this._answerForm)
    }

    for (let i = 0; i < Object.keys(alt).length; i++) {
      const radioButton = document.createElement('input')
      const label = document.createElement('label')

      label.textContent = Object.values(alt)[i]
      label.htmlFor = `r${i + 1}`
      radioButton.type = 'radio'
      radioButton.name = 'Alternatives'
      radioButton.value = Object.keys(alt)[i]
      radioButton.id = `r${i + 1}`
      console.log('loop')
      this._answerForm.appendChild(label)
      this._answerForm.appendChild(radioButton)
    }
  }

  /**
   * Removes all children of the quizForm div
   *
   * @memberof QuizQuestion
   */
  cleanForm (element) {
    while (element.hasChildNodes()) {
      element.removeChild(element.firstChild)
    }
  }
}

window.customElements.define('quiz-question', QuizQuestion)
