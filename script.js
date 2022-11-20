const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

// Code taken from my other project
// For window resize
canvas.width = window.innerWidth
canvas.height = window.innerHeight

// How to make right click menu not pop up, https://stackoverflow.com/questions/737022/how-do-i-disable-right-click-on-my-web-page
canvas.addEventListener('contextmenu', event => event.preventDefault());

let mouse = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', function(e) {
    mouse.x = e.x
    mouse.y = e.y
})
// Take a look at my other project! https://cool-background-malkist.netlify.com/

// k actual code starts now

class Player {
    constructor(y,size,color) {
        this.x = canvas.width/5
        this.y = y
        this._vy = 0
        this._size = size
        this._color = color
        this._dead = false
    }
    jump() {
        if (this._vy <= 10) {
            this._vy = 19;
        }
    }
    tick(obstacles) {
        if (this._vy > this.y || (this.y+this._vy >= canvas.height && this._vy < 0)) {
            this._dead = true
        } else {
            this.y -= this._vy
        }
        if (this._vy > -22) {
            this._vy -= 1.7
        }


        // Collision detection
        // https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
        for (var obstacle of obstacles) {
            if (
                // Box 1 (top part)
                (player.x < obstacle.x &&
                player.x + player._size > obstacle.x-obstacle.width &&
                player.y < obstacle.y-117 &&
                player.y + player._size > 0)
                || // or it collides with...
                // Box 2 (bottom part)
                (player.x < obstacle.x &&
                player.x + player._size > obstacle.x-obstacle.width &&
                player.y < canvas.height &&
                player.y + player._size > obstacle.y+117)
            ) {
                obstacle._color = '#545454'
                this._color = '#a29f92'
                this._dead = true
                break
            }
        }

    }
    draw() {
        ctx.fillStyle = this._color
        ctx.fillRect(this.x,this.y,this._size,this._size)
    }
}

class Obstacle {
    constructor(x,y) {
        this.x = x
        this.y = y
        this.width = 60
        this._color = 'green'
        this._scoreElegible = true
    }
    tick() {
        this.x -= 8.6
    }
    draw() {
        ctx.fillStyle = this._color
        ctx.fillRect(this.x-this.width,0,this.width,this.y-115)
        ctx.fillRect(this.x-this.width,this.y+115,this.width,canvas.height)
    }
}

function resetScene() {
    obstacles = []
    for (var i = 2; i <= 5; i++) {
        obstacles.unshift(new Obstacle(canvas.width/4*i, Math.floor(Math.random() * ((canvas.height*3)/4 - canvas.height/4 + 1) + canvas.height/4)))
    }

    player = new Player(obstacles[obstacles.length-1].y-80,60,'#ffe135')

    score = 0
    document.querySelector('#scoreValue').innerText = score
}

let obstacles
let player
let score
let highscore = 0

resetScene()


canvas.addEventListener('mousedown', function(e) {
    if (!player._dead) {
        player.jump()
    } else {
        resetScene()
    }
})

document.addEventListener('keydown', function(e) {
    if ((e.key == ' ' || e.key == 'w' || e.code == "Enter" || e.keyCode == 38) && !player._dead) {
        player.jump()
    } else if (player._dead) {
        resetScene()
    }
})

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    player.x = canvas.width/5
})


function animate() {
    ctx.clearRect(0,0,canvas.width, canvas.height)
    if (!player._dead) {
        player.tick(obstacles)
        if (document.querySelector('#deathMessage').style.display != 'none') {
            document.querySelector('#deathMessage').style.display = 'none'
        }
    } else if (player._dead && document.querySelector('#deathMessage').style.display != 'inline-block') {
        document.querySelector('#deathMessage').style.display = 'inline-block'
    }
    player.draw()
    obstacles.forEach((obstacle, i) => {
        if (!player._dead) {
            obstacle.tick()
        }
        obstacle.draw()
        if (obstacle.x < 0) { // Moved off screen, we can move back to the other side and randomize the y.
            obstacle.x = canvas.width+obstacle.width
            obstacle.y = Math.floor(Math.random() * ((canvas.height*3)/4 - canvas.height/4 + 1) + canvas.height/4)
            obstacle._scoreElegible = true
        }
        if (obstacle.x-obstacle.width/2 < player.x && obstacle._scoreElegible) {
            score++
            obstacle._scoreElegible = false
            if (document.querySelector('#scoreValue') != score) {
                document.querySelector('#scoreValue').innerText = score
                if (score > highscore) {
                    highscore = score
                    document.querySelector('#highscoreValue').innerText = highscore
                }
            }
        }
    })



    setTimeout(function () {
        requestAnimationFrame(animate)
    }, 1000/48) // Target fps is 48
}

document.querySelector('#highscoreValue').innerText = highscore
animate()
