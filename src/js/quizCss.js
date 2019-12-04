const templateCss = document.createElement('template')

templateCss.innerHTML = `
    <style>
    :host {
        font-family: monospace;
    }
    input:focus {
        outline:none;
    }
    .wrapper {
    width: 100%;
    min-height: 300px;
    background-color: #333;
    margin: 0 auto;
    border-radius: 20px;
    color: white;
    text-align: center;
    }
    .quizContainer {
    margin: 0 auto;
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
        margin: 0 auto;
    }
    input[type="text"]::placeholder {
        color: #f2b83a;
        opacity: 1;
    }
    </style>
`
const startScreenCss = document.createElement('template')
startScreenCss.innerHTML = `
    <style class="startScreen">
    .quizTitle {
        font-size: 60px;
        margin: 0px;
        padding-top: 15px;
        color: #f2b83a;
    }
    .description {
        font-size: 30px;
    }
    
    </style>
`

const gameTemplateCss = document.createElement('template')
gameTemplateCss.innerHTML = `
    
<style class="gameScreen">
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
.quizForm {
    height: 40%;
    display: block;
}
.question {
    margin: 0;
    padding-top: 60px;
    font-size: 40px;
    color: #f2b83a;
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

input[type="radio"] {
    font-size:25px;
    margin-top: -1px;
  vertical-align: middle;
  text-align: initial;
} 
input[type="radio"]{
    vertical-align: baseline;
}

.timer {
  float: left;
}
.alternativDiv {

}
</style>

`
const winTemplateCss = document.createElement('template')
winTemplateCss.innerHTML = `
    <style class="gameOverTemp">
        .winTitle {
            font-size: 30px;
        }
        .winTime {
            font-size: 20px;
        }
    </style>
`

const loseTemplateCss = document.createElement('template')
loseTemplateCss.innerHTML = `
    <style class="gameOverTemp">
        .loseTitle {
            font-size: 50px;
        }
    </style>
`

export {
  templateCss,
  startScreenCss,
  gameTemplateCss,
  winTemplateCss,
  loseTemplateCss
}
