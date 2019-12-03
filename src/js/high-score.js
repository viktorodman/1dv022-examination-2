const template = document.createElement('template')
template.innerHTML = `
    <style>
        :host {
            color: #f2b83a;
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

            text-align: center;
        }
    </style>
    <div class="highscoreContainer">
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
`

class HighScore extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this.time = undefined
    this.playerName = undefined
    this.currentList = []
    this._storage = window.localStorage
  }

  static get observedAttributes () {
    return ['time', 'player']
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'time') {
      this.time = Number(newValue)
    }
    if (name === 'player') {
      this.playerName = newValue
    }
  }

  connectedCallback () {
    /* this.updateRendering()
    this.getCurrentList()
    this.addToList()
    this.setNewList() */
    this.getCurrentList()
    if (this.playerName && this.time) {
      this.addToList()
    }
    this.setNewList()
    /* this._storage.removeItem(this.playerName) */
  }

  updateRendering () {
    /* const player = this.shadowRoot.querySelectorAll('tr td')[0]
    player.textContent = this.playerName
    window.localStorage.setItem(this.playerName, this.time) */

  }

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

  addToList () {
    const lastPlace = this.currentList[this.currentList.length - 1]
    if (this.currentList.length >= 5 && this.time < lastPlace.time) {
      if (this.checkName()) {
        console.log('checknameses')
        this._storage.setItem(this.playerName, String(this.time))
      } else {
        console.log('removing item')
        console.log(lastPlace.name)
        this._storage.removeItem(lastPlace.name)
        this._storage.setItem(this.playerName, String(this.time))
      }
    } else if (this.currentList.length < 5) {
      console.log('adding item')
      this._storage.setItem(this.playerName, String(this.time))
    }
    this.getCurrentList()
    /* this._storage.removeItem(lastPlace.name) */
  }

  setNewList () {
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

  sortList () {
    this.currentList.sort((a, b) => {
      return a.time - b.time
    })
  }

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
