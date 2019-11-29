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

.timer {
  float: left;
}

</style>
<div class="wrapper">
  <div class="quizContainer"> 
    
  </div>
  <button>Submit</button>
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
const startScreen = document.createElement('template')

startScreen.innerHTML = `
    <div class="quizHeader">
      <p class="question">ENTER NAME</p>
    </div>
    <div class="quizMain">
      <input type="text" placeholder="name"  class="enterName">
    </div>
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
