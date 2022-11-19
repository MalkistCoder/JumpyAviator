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
        this._vy += this._vy > 10 ? 0 : -1*this._vy+19
    }
    tick(obstacles) {
        if (this._vy > this.y || (this.y+this._vy >= canvas.height && this._vy < 0)) {
            this._dead = true
        } else {
            this.y -= this._vy
        }
        this._vy -= 1.7

        // Collision detection

        // https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
        for (var obstacle of obstacles) {
            if (
                // Box 1 (top part)
                (player.x < obstacle.x &&
                player.x + player._size > obstacle.x-obstacle.width &&
                player.y < obstacle.y-145 &&
                player.y + player._size > 0)
                || // or it collides with...
                // Box 2 (bottom part)
                (player.x < obstacle.x &&
                player.x + player._size > obstacle.x-obstacle.width &&
                player.y < 1000000000 && // Large value because we want the hitbox to be all the way to the bottom anyways
                player.y + player._size > obstacle.y+145)
            ) {
                console.log('collision detected')
                this._dead = true
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
    }
    tick() {
        this.x -= 6.5
    }
    draw() {
        ctx.fillStyle = this._color
        ctx.fillRect(this.x-this.width,0,this.width,this.y-145)
        ctx.fillRect(this.x-this.width,this.y+145,this.width,canvas.height)
    }
}


let obstacles = []
obstacles.unshift(new Obstacle(canvas.width/5*2, Math.floor(Math.random() * ((canvas.height*3)/4 - canvas.height/4 + 1) + canvas.height/4)))
obstacles.unshift(new Obstacle(canvas.width/5*3, Math.floor(Math.random() * ((canvas.height*3)/4 - canvas.height/4 + 1) + canvas.height/4)))
obstacles.unshift(new Obstacle(canvas.width/5*4, Math.floor(Math.random() * ((canvas.height*3)/4 - canvas.height/4 + 1) + canvas.height/4)))
obstacles.unshift(new Obstacle(canvas.width/5*5, Math.floor(Math.random() * ((canvas.height*3)/4 - canvas.height/4 + 1) + canvas.height/4)))
obstacles.unshift(new Obstacle(canvas.width/5*6, Math.floor(Math.random() * ((canvas.height*3)/4 - canvas.height/4 + 1) + canvas.height/4)))

const player = new Player(obstacles[obstacles.length-1].y-110,60,'#ffe135')

let score = 0


canvas.addEventListener('mousedown', function(e) {
    player.jump()
})

document.addEventListener('keydown', function(e) {
    if (e.key === ' ') {
        player.jump()
    }
})

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    player.x = canvas.width/5
})

function animate() {
    ctx.clearRect(0,0,canvas.width, canvas.height)
    player.tick(obstacles)
    player.draw()
    obstacles.forEach((obstacle, i) => {
        obstacle.tick()
        obstacle.draw()
        if (obstacle.x < 0) { // Moved off screen, we can move back to the other side and randomize the y.
            obstacle.x = canvas.width+obstacle.width
            obstacle.y = Math.floor(Math.random() * ((canvas.height*3)/4 - canvas.height/4 + 1) + canvas.height/4)
            score++
        }
    })

    if (document.querySelector('#scoreValue') != score) {
        document.querySelector('#scoreValue').innerText = score
    }

    if (!player._dead) {
        setTimeout(function () {
            requestAnimationFrame(animate)
        }, 1000/48) // Target fps is 48
    }
}
animate()
