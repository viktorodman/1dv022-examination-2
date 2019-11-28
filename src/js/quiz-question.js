
const template = document.createElement('template')
template.innerHTML = `
<style>
.quizContainer {
    width: 900px;
    height: 500px;
    background-color: #333;
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
   margin-top: 50px;
   width: 150px;
   height: 50px;
   font-size: 30px;
}
button {
  margin-top: 10px;
  border: 2px solid white;
  font-size: 45px;
  color: white;
  background-color: black;
}

</style>

<div class="quizContainer">
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
    this._answer = undefined
    this._isAltQuestion = false
    this._nameEnter = this._enterUserName.bind(this)
    this._name = undefined
  }

  connectedCallback () {
    this.createStartScreen()

    this._button.addEventListener('click', this._nameEnter, true)

    /* this.startGame() */
  }

  _enterUserName () {
    const input = this.shadowRoot.querySelector('.quizForm input')
    const playerName = this.shadowRoot.querySelector('.playerName')
    playerName.textContent = input.value
    this.startGame()
    this._button.removeEventListener('click', this._nameEnter, true)
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

  createStartScreen () {
    const enterName = this.shadowRoot.querySelector('.question')

    enterName.textContent = 'ENTER NAME'

    const nameField = document.createElement('input')
    nameField.type = 'text'
    nameField.placeholder = 'Name'

    this._answerForm.appendChild(nameField)
  }

  /**
   * Add a input text field in the quizForm div
   *
   * @memberof QuizQuestion
   */
  createTextForm () {
    if (this._answerForm.childElementCount > 0) {
      this.cleanForm()
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
      this.cleanForm()
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
  cleanForm () {
    while (this._answerForm.hasChildNodes()) {
      this._answerForm.removeChild(this._answerForm.firstChild)
    }
  }
}

window.customElements.define('quiz-question', QuizQuestion)
