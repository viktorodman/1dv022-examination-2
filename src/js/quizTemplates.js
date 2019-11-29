const template = document.createElement('template')
template.innerHTML = `

<div class="wrapper">
  <div class="quizContainer"> 
    
  </div>
  <button>Submit</button>
</div>
`

const startScreen = document.createElement('template')

startScreen.innerHTML = `
    <div>
      <h2 class="quizTitle">QUIZ APP</h2>
    </div>
    <div>
      <p class="description">Enter your name and press Play to start the quiz</p>
    </div>
    <div>
      <input class="quizName" type="text" placeholder="Name"  class="enterName">
    </div>
    `

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

const textTemplate = document.createElement('template')

textTemplate.innerHTML = /* HTML */ `
      <input type="text">
    `

const altTemplate = document.createElement('template')

altTemplate.innerHTML = /* HTML */ `
      <label></label>
      <input type="radio" name="Alternatives">
    `
export {
  template,
  gameTemplate,
  textTemplate,
  startScreen,
  altTemplate
}
