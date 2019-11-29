const templateCss = document.createElement('template')

templateCss.innerHTML = `
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
    </style>
`
const startScreenCss = document.createElement('template')
startScreenCss.innerHTML = `
    .quizTitle {
        font-size: 60px;
        margin: 0px;
        padding-top: 15px;
        color: #f2b83a;
    }
    .description {
        font-size: 30px;
    }
    .quizName {
        font-size: 30px;
        text-align: center;
        margin-bottom: 15px;
        border: none;
        border-bottom: 2px solid #f2b83a;
        background-color: #333;
        color: #f2b83a;
    }
    .quizName::placeholder {
        color: #f2b83a;
        opacity: 1;
    }
`

export {
  templateCss,
  startScreenCss
}

/*
<style>

.quizHeader {
    height: 10%;
    font-size: 50px;
    margin: 0 auto;
    text-align: center;
}
.quizMain {
    height: 40%;
    margin: 0 auto;
    text-align: center;

}
.quizInfo {
    height: 10%;
    font-size: 30px;
    padding: 10px;
}
.quizAnswer {
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
*/
