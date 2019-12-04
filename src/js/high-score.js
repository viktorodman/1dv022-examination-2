const template = document.createElement('template')
template.innerHTML = `
    <style>
        :host {
            color: #f2b83a;
            text-align: center;
        }
        .show {
          display: block;
        }
        .hidden {
          display: none;
        }
        .highscoreTitle {
            font-size: 30px;
        }
        table {
            margin: auto;
            font-size: 30px;
            border-collapse: collapse;
        }
        tr {
            border-bottom: 2px solid #f2b83a;
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
    </style>
    <div class="hidden">
    <div class="highscoreTitle">
      <h3>HIGH-SCORE</h3>
    </div>
    <div>
      <table class="highscoreTable">
        <tr>
          <th>Name</th>
          <th>Time</th>
        </tr>
      </table>
    </div>
  </div>
  <div class="buttonDiv">
      <button class="showHighScore">Show High Score</button>
  </div>
`
/**
 * Represents a high-score list
 *
 * @class HighScore
 * @extends {window.HTMLElement}
 */
class HighScore extends window.HTMLElement {
  /**
   * Creates an instance of HighScore.
   * @memberof HighScore
   */
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.time = undefined
    this.playerName = undefined
    this.currentList = []
    this._storage = window.localStorage
  }

  /**
   * Get what attributes attributeChangedCallback should look for
   *
   * @readonly
   * @static
   * @memberof HighScore
   */
  static get observedAttributes () {
    return ['time', 'player']
  }

  /**
   * Is called when some of the observed attributes is called
   *
   * @param {String} name the attribute name
   * @param {String} oldValue old attribute value
   * @param {String} newValue new attribute value
   * @memberof HighScore
   */
  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'time') {
      this.time = Number(newValue)
    }
    if (name === 'player') {
      this.playerName = newValue
    }
  }

  /**
  * Runs when the element is appended to a document-connected element
  *
  * @memberof HighScore
  */
  connectedCallback () {
    this.getCurrentList()
    console.log('2score')
    if (this.playerName && this.time) {
      console.log('highscore')
      this.addToList()
    }
    this.updateRendering()
    this.shadowRoot.querySelector('.showHighScore').addEventListener('click', event => {
      this.shadowRoot.querySelectorAll('div')[0].classList.replace('hidden', 'show')
      this.shadowRoot.querySelector('.buttonDiv').remove()
    })
  }

  /**
   * Displays a list of the highscore
   *
   * @memberof HighScore
   */
  updateRendering () {
    this.sortList()
    this.currentList.forEach((player, index) => {
      const tr = document.createElement('tr')
      const name = document.createElement('td')
      const time = document.createElement('td')
      name.textContent = player.name
      time.textContent = player.time
      tr.appendChild(name)
      tr.appendChild(time)
      this.shadowRoot.querySelector('.highscoreTable').appendChild(tr)
    })
  }

  /**
   * Gets the current list from local storage and sorts the list
   *
   * @memberof HighScore
   */
  getCurrentList () {
    this.currentList = []
    for (let i = 0; i < this._storage.length; i++) {
      this.currentList.push({
        name: this._storage.key(i),
        time: Number(this._storage.getItem(this._storage.key(i)))
      })
    }
    this.sortList()
  }

  /**
   * adds a new player to the local storage if the
   * players time is better than the worst time
   *
   * @memberof HighScore
   */
  addToList () {
    const lastPlace = this.currentList[this.currentList.length - 1]
    if (this.currentList.length >= 5 && this.time < lastPlace.time) {
      if (this.checkName()) {
        this._storage.setItem(this.playerName, String(this.time))
      } else {
        this._storage.removeItem(lastPlace.name)
        this._storage.setItem(this.playerName, String(this.time))
      }
    } else if (this.currentList.length < 5) {
      this._storage.setItem(this.playerName, String(this.time))
    }
    this.getCurrentList()
    /* this._storage.removeItem(lastPlace.name) */
  }

  /**
   * Sorts the current list
   *
   * @memberof HighScore
   */
  sortList () {
    this.currentList.sort((a, b) => {
      return a.time - b.time
    })
  }

  /**
   * checks if this.playername already exists in the
   * highscore list
   *
   * @returns
   * @memberof HighScore
   */
  checkName () {
    let nameExist = false
    this.currentList.forEach(player => {
      if (player.name === this.playerName && player.time > this.time) {
        nameExist = true
        console.log('name exists')
      }
    })
    return nameExist
  }
}

window.customElements.define('high-score', HighScore)
