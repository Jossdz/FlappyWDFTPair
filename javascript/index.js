let bg = "https://github.com/ironhack-labs/lab-canvas-flappybirds/blob/master/starter_code/images/bg.png?raw=true"
let interval, frames = 0
let fp = "https://github.com/ironhack-labs/lab-canvas-flappybirds/blob/master/starter_code/images/flappy.png?raw=true"

let Bo =  'https://github.com/ironhack-labs/lab-canvas-flappybirds/blob/master/starter_code/images/obstacle_bottom.png?raw=true'

let To =  'https://github.com/ironhack-labs/lab-canvas-flappybirds/blob/master/starter_code/images/obstacle_top.png?raw=true'

let gameOverImg = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqPADCIhVuwl3ZRRxCvCIYaix_VD38FgcoZDulLcHcv024W79CEQ'

let obstacles = []


window.onload = () => {
  const canvas = document.querySelector('canvas')
  const ctx = canvas.getContext('2d')

  //Clases
  class Board {
    constructor(img){
      this.x = 0
      this.y = 0
      this.img = new Image()
      this.img.src = img
      this.img.onload = () => {
        this.draw()
      }
    }
    draw(){
      if (this.x < -canvas.width) this.x = 0
      ctx.drawImage(this.img, this.x, this.y, canvas.width, canvas.height)
      ctx.drawImage(this.img, this.x + canvas.width, this.y, canvas.width, canvas.height)
      this.x--
    }
  }

  class Flappy{
    constructor(img, x, y){
      this.x = x
      this.y = y
      this.img = new Image()
      this.img.src = img
      this.img.onload = () => {
        this.draw()
      }
    }
    draw(){
      this.y++
      ctx.drawImage(this.img, this.x, this.y, 15, 15)
    }
    fly(){
      this.y -= 25
    }
    isTouching(obstacle){
      return  (this.x < obstacle.x + obstacle.width) &&
              (this.x + 15  > obstacle.x) &&
              (this.y < obstacle.y + obstacle.height) &&
              (this.y + 15 > obstacle.y)
    }
  }

   
  class Pipe {
    constructor(y = 0, height = 270, type) {
      this.x = canvas.width
      this.y = y
      this.width = 20
      this.height = height
      this.type = type
      this.img1 = new Image()
      this.img2 = new Image()
      this.img1.src = Bo
      this.img2.src = To
    }
    draw() {
      if (this.type) {
        ctx.drawImage(this.img1, this.x, this.y, this.width, this.height)
      } else {
        ctx.drawImage(this.img2, this.x, this.y, this.width, this.height)
      }
      this.x--
    }
  }

  class GameOverImg {
    constructor(img){
      this.x = 0
      this.y = 0
      this.img = new Image()
      this.img.src = img
      this.img.onload = () => {
        this.draw()
      }
    }
    draw(){
      ctx.drawImage(this.img, this.x, this.y, canvas.width, canvas.height)
    }
  }


  // Definiciones
  const board = new Board(bg)
  const flappy = new Flappy(fp, 100, 100)
  const gameoverimg = new GameOverImg(gameOverImg)

  // flujo principal
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    board.draw()
    flappy.draw()
    generatePipes()
    drawPipes()
    checkCollition()
    ctx.fillText(Math.round((frames/1000)* 10), 100, 30)
    frames++
  }

  function startGame() {
    if (interval) return
    interval = setInterval(update, 1000/60) 
  }

  function gameOver() {
    clearInterval(interval)
    //ctx.clearRect(0, 0, canvas.width, canvas.height)
    //ctx.fillText('Perdiste broooo', 50, 50)
    gameoverimg.draw()
  }

  //listeners
  document.addEventListener('keydown', (e) => {
    
    switch (e.keyCode) {
      case 13:
        startGame()
        break;
      case 32: 
        flappy.fly()
      default:
        break;
    }
  })

  //helpers

  function generatePipes(){
    let ventanita = 50
    let randomHeight = Math.floor(Math.random() * ventanita) + 15
    if (frames % 120 === 0) {
      let obs1 = new Pipe(0, randomHeight, false)
      let obs2 = new Pipe(randomHeight + ventanita, canvas.height - (randomHeight - ventanita), true)
      obstacles.push(obs1)
      obstacles.push(obs2)
    }
  }

  function drawPipes() {
    obstacles.forEach(obstacle => {
      obstacle.draw()
    })
  }

  function checkCollition() {
    obstacles.forEach(obstacle => {
      if (flappy.isTouching(obstacle)) gameOver()
    })
  }
}