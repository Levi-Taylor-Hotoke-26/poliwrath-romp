//poliwrath guessing game

import confetti from 'https://cdn.jsdelivr.net/npm/canvas-confetti/+esm'

//get random number
function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// grab <table> and <td> cells
const table = document.getElementById('poliwrath-whomp-table')
const cells = Array.from(table.getElementsByTagName('td'))
const startButton = document.getElementById('start-game-btn')
const heading = document.querySelector('h2')
const moveCounter = document.getElementById('move-counter')

// declare currentPoliwrath and currentCell
let currentPoliwrath = null
let currentCell = null
let gameStarted = false
let isShinyRound = false
let wrongAttempts = 0
let gameOver = false
const maxAttempts = 5

const audioContext = new (window.AudioContext || window.webkitAudioContext)()
let audioStarted = false

function ensureAudioContext() {
  if (!audioStarted && audioContext.state === 'suspended') {
    audioContext.resume()
  }
  audioStarted = true
}

function playThudSound() {
  ensureAudioContext()
  const now = audioContext.currentTime
  const osc = audioContext.createOscillator()
  const gain = audioContext.createGain()

  osc.type = 'triangle'
  osc.frequency.setValueAtTime(120, now)
  osc.frequency.exponentialRampToValueAtTime(50, now + 0.14)

  gain.gain.setValueAtTime(0.25, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)

  osc.connect(gain)
  gain.connect(audioContext.destination)

  osc.start(now)
  osc.stop(now + 0.18)
}

function playCelebrationSound() {
  ensureAudioContext()
  const notes = [440, 554.37, 659.25, 880]
  const duration = 0.12
  const now = audioContext.currentTime

  notes.forEach((freq, index) => {
    const start = now + index * duration
    const osc = audioContext.createOscillator()
    const gain = audioContext.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(freq, start)
    osc.frequency.exponentialRampToValueAtTime(freq * 1.1, start + duration)

    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(0.22, start + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration)

    osc.connect(gain)
    gain.connect(audioContext.destination)

    osc.start(start)
    osc.stop(start + duration)
  })
}

const shinyCheerAudio = new Audio('./sound-effects/mykelu-crowd-cheering-383111.mp3')
shinyCheerAudio.preload = 'auto'

function playShinyCheerSound() {
  if (shinyCheerAudio && shinyCheerAudio.paused) {
    shinyCheerAudio.currentTime = 0
    shinyCheerAudio.play().catch(() => {
      // ignore autoplay restrictions; sound will play after first user interaction
    })
  }
}

function playSplashSound() {
  ensureAudioContext()
  const now = audioContext.currentTime
  const osc = audioContext.createOscillator()
  const gain = audioContext.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(320, now)
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.4)

  gain.gain.setValueAtTime(0.18, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45)

  osc.connect(gain)
  gain.connect(audioContext.destination)

  osc.start(now)
  osc.stop(now + 0.45)
}

const normalPoliwrathImage = 'https://img.pokemondb.net/sprites/black-white/anim/normal/poliwrath.gif'
const shinyPoliwrathImage = 'https://img.pokemondb.net/sprites/black-white/anim/shiny/poliwrath.gif'

// create Poliwrath image
function createPoliwrath() {
  const poliwrath = document.createElement('img')
  poliwrath.className = 'poliwrath-image'
  poliwrath.id = 'poliwrath'
  poliwrath.src = isShinyRound ? shinyPoliwrathImage : normalPoliwrathImage
  poliwrath.alt = 'poliwrath'
  poliwrath.width = 100
  poliwrath.style.display = 'none'
  return poliwrath
}

// generate next cell placement for Poliwrath image
function getRandomCell() {
  let nextCell = null

  while (!nextCell || nextCell === currentCell) {
    const randomIndex = getRandomNumber(0, cells.length - 1)
    nextCell = cells[randomIndex]
  }

  return nextCell
}

function resetCell(cell) {
  const poliwrathImage = cell.querySelector('.poliwrath-image')
  if (poliwrathImage) {
    poliwrathImage.remove()
  }

  cell.style.backgroundColor = 'transparent'
  cell.style.color = '#000000'
  cell.style.fontSize = '20px'
  cell.style.fontWeight = 'bold'
  cell.dataset.checked = 'false'

  const grassImage = cell.querySelector('.grass-image')
  if (grassImage) {
    grassImage.style.display = 'block'
  }
}

function updateMoveCounter() {
  if (!moveCounter) {
    return
  }

  const remaining = maxAttempts - wrongAttempts
  moveCounter.textContent = `${remaining} ${remaining === 1 ? 'move' : 'moves'} left`
}

function placeHiddenPoliwrath() {
  if (currentPoliwrath && currentPoliwrath.parentElement) {
    currentPoliwrath.parentElement.removeChild(currentPoliwrath)
  }

  isShinyRound = Math.random() < 0.1
  const nextCell = getRandomCell()
  currentPoliwrath = createPoliwrath()
  nextCell.appendChild(currentPoliwrath)
  currentCell = nextCell
}

function startGame() {
  gameStarted = true
  gameOver = false
  wrongAttempts = 0
  startButton.textContent = 'Start Game Again'
  if (heading) {
    heading.textContent = 'Try to find a wild Poliwrath!'
  }
  if (moveCounter) {
    moveCounter.style.display = 'block'
  }
  updateMoveCounter()
  cells.forEach(resetCell)
  placeHiddenPoliwrath()
}

function revealPoliwrath() {
  if (currentPoliwrath) {
    currentPoliwrath.style.display = 'block'
  }

  if (heading) {
    heading.textContent = isShinyRound ? 'You caught a shiny Poliwrath!' : 'You caught a Poliwrath!'
  }

  if (isShinyRound) {
    playShinyCheerSound()
  } else {
    playCelebrationSound()
  }

  const pokeball = confetti.shapeFromPath({
    path: 'M9.04793 48H39.2725C40.414 42.8508 45.0073 39 50.5 39C55.9927 39 60.586 42.8508 61.7275 48H90.9521C89.9091 26.2852 71.9731 9 50 9C28.0269 9 10.0909 26.2852 9.04793 48ZM90.9521 52H61.9031C61.168 57.6425 56.3429 62 50.5 62C44.6571 62 39.832 57.6425 39.0969 52H9.04793C10.0909 73.7148 28.0269 91 50 91C71.9731 91 89.9091 73.7148 90.9521 52ZM5 50C5 25.1472 25.1472 5 50 5C74.8528 5 95 25.1472 95 50C95 74.8528 74.8528 95 50 95C25.1472 95 5 74.8528 5 50ZM50.5 43C46.3579 43 43 46.3579 43 50.5C43 54.6421 46.3579 58 50.5 58C54.6421 58 58 54.6421 58 50.5C58 46.3579 54.6421 43 50.5 43z'
  })

  if (isShinyRound) {
    confetti({
      particleCount: 5,
      spread: 20,
      origin: { y: 0.5 },
      colors: ['#FFD700', '#FF69B4', '#00BFFF', '#FFFFFF'],
      scalar: 3,
      shapes: ['square'],
      emoji: 'SHINY'
    })

    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        shapes: [pokeball],
        colors: ['#FF1C1C', '#000000', '#FFFFFF'],
        scalar: 3
      })
    }, 250)
  } else {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      shapes: [pokeball],
      colors: ['#FF1C1C', '#000000', '#FFFFFF'],
      scalar: 3
    })
  }

  gameStarted = false
}

cells.forEach((cell) => {
  cell.addEventListener('click', () => {
    if (!gameStarted || gameOver || !currentPoliwrath) {
      return
    }

    if (cell.dataset.checked === 'true') {
      return
    }

    if (cell === currentCell) {
      revealPoliwrath()
      return
    }

    wrongAttempts += 1
    cell.dataset.checked = 'true'
    cell.style.backgroundColor = '#d3d3d3'
    cell.style.color = '#555555'

    const grassImage = cell.querySelector('.grass-image')
    if (grassImage) {
      grassImage.style.display = 'block'
    }

    if (wrongAttempts < maxAttempts) {
      updateMoveCounter()
      playThudSound()
    } else {
      wrongAttempts = maxAttempts
      updateMoveCounter()
      gameStarted = false
      gameOver = true
      if (heading) {
        heading.textContent = 'The wild Poliwrath fled!'
      }
      playSplashSound()
    }
  })
})

startButton.addEventListener('click', startGame)
