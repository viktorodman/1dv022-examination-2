const template = document.createElement('template')
template.innerHTML = `

<div class="wrapper">
<quiz-questions></quiz-questions>
  <div class="quizContainer">
  
    <enter-name></enter-name>
  </div>
</div>
`

const gameTemplate = document.createElement('template')

gameTemplate.innerHTML = `
    <div class="quizHeader">
      <p>Question: <span id="questionNumber"></span></p>
      </div>
      <div class="quizInfo">
          <!-- <span class="timer"></span> -->
          <game-timer></game-timer>
      </div>
      <div class="quizMain">
          <p class="question"></p>
      </div>
      <div class="quizForm">
      </div>
      <div class ="buttonDiv">
        <button type="submit" class="answerButton">Answer</button>
      </div>
`

const textTemplate = document.createElement('template')

textTemplate.innerHTML = /* HTML */ `
      <input type="text" placeholder="Your Answer">
    `

const altTemplate = document.createElement('template')

altTemplate.innerHTML = /* HTML */ `
      <div class="alternativDiv"></div>
      <label></label>
      <input type="radio" name="Alternatives">
    `

const winTemplate = document.createElement('template')

winTemplate.innerHTML = `

  <div class="winContainer">
    <div class="winTitle">
      <h3>YOU WIN!</h3>
    </div>
    <div class="winTime">
      <p>Total time: <span class="timeTotal"></span></p>
    </div>
    <div class="winButtons">
      <button class="playAgain">Play Again</button>
    </div>
  </div>
  
`

const loseTemplate = document.createElement('template')

loseTemplate.innerHTML = `
  <div class="loseContainer">
    <div class="loseTitle">
      <h3>YOU LOSE :( Try Again</h3>
    </div>
    <div class="loseButtons">
      <button class="playAgain">Play Again</button>
    </div>
  </div>
`

export {
  template,
  gameTemplate,
  textTemplate,
  altTemplate,
  winTemplate,
  loseTemplate
}
