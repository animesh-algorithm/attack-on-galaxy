class Ship {
    constructor() {
        this.ship_div = null
    }
}

class Player extends Ship {
    constructor(ship_div) {
        super()
        this.ship_div = ship_div
        this.speed = 10
        this.score = 0
        this.kills = 0
        this.highscore = 0
        this.lives = 10
    }

    draw() {
        this.ship_div.style.left = `${window.innerWidth/2}px`
        this.ship_div.style.bottom = '20px'
    }
}

class Enemy extends Ship {
    constructor(ship_div) {
        super()
        this.ship_div = ship_div
        this.speed = Math.random() * 2
    }
    
    draw() {
        document.body.appendChild(this.ship_div)
        this.ship_div.style.left = `${Math.random() * window.innerWidth - 50}px`
        this.ship_div.style.top = `${-Math.random() * 400}px`
    }
}

class Laser {
    constructor(laser_div) {
        this.speed = 30
        this.laser_div = laser_div
    }
    draw() {
        document.body.appendChild(this.laser_div)
        this.laser_div.style.bottom = `${parseFloat(player.ship_div.style.bottom.split('px')[0])+70}px`
        this.laser_div.style.left = `${parseFloat(player.ship_div.style.left.split('px')[0])-50}px`
    }
}

const playerShip = document.getElementById('player-ship')
const playBtn = document.getElementById('play')
const menu = document.getElementById('menu')
const gameOverMenu = document.getElementById('game-over')
const restartBtn = document.getElementById('restart')
const score = document.getElementById('score').lastElementChild
const lives = document.getElementById('lives').lastElementChild
const kills = document.getElementById('kills').lastElementChild
let enemyShipsImages = ['./images/pixel_ship_blue_small.png', './images/pixel_ship_red_small.png', './images/pixel_ship_green_small.png']
let enemyLasersImages = ['./images/pixel_laser_red.png', './images/pixel_laser_blue.png', './images/pixel_laser_green.png']
let enemies = []
let playerLasers = []

function main() {
    function generateEnemies(n) {
        for (let i=0; i<n; i++) {
            let ship_div = document.createElement('div')
            ship_div.setAttribute('class', 'ship enemy-ship')
            // ship_div.setAttribute('width', '100px')
            let enemy_ship_image = enemyShipsImages[Math.round(Math.random()*2)]
            let child_node = document.createElement('img')
            child_node.setAttribute('src', `${enemy_ship_image}`)
            ship_div.appendChild(child_node)
            let enemy = new Enemy(ship_div)
            enemy.draw()
            enemies.push(enemy)
        }
    }
    
    function getPosition(div) {
        let width = parseFloat(getComputedStyle(div, null).width.replace("px", ""))
        let height = parseFloat(getComputedStyle(div, null).height.replace("px", ""))
        return [ [ div.offsetLeft, div.offsetLeft + width ], [ div.offsetTop, div.offsetTop + height ] ]
    }
    
    function comparePositions(p1, p2) {
        let r1 = p1[0] < p2[0] ? p1 : p2
        let r2 = p1[0] < p2[0] ? p2 : p1
        return r1[1] > r2[0] || r1[0] === r2[0]
    }
    
    function collision(div1, div2) {
        let pos1 = getPosition(div1)
        let pos2 = getPosition(div2)
        return comparePositions(pos1[0], pos2[0]) && comparePositions(pos1[1], pos2[1])
    }
    
    function shootLaser(who, laser) {
        if (who === 'player') {
            setInterval(() => {
                let pos = parseFloat(laser.laser_div.style.bottom.split('px')[0])+laser.speed
                laser.laser_div.style.bottom = `${pos}px`
                if (pos >= 600) {
                    laser.laser_div.style.display = 'none'
                    playerLasers = playerLasers.filter(playerLaser => playerLaser != laser)
                    // console.log(playerLasers)
                }
            }, 100)
        }
    }
    
    function createLaser() {
        let playerLaser = document.createElement('div')
        let playerLaserImg = document.createElement('img')
        playerLaser.setAttribute('class', 'laser-img')
        playerLaserImg.setAttribute('src', './images/pixel_laser_yellow.png')
        playerLaser.appendChild(playerLaserImg)
        let laser = new Laser(playerLaser)
        laser.draw()
        playerLasers.push(laser)
        return laser
    }

    function moveLeft() {
        let pos_left = parseFloat(player.ship_div.style.left.split('px')[0]-player.speed)
        if (pos_left >= 10)  {
            player.ship_div.style.left = `${pos_left}px`
        }
    }

    function moveDown() {
        let pos_bottom = parseFloat(player.ship_div.style.bottom.split('px')[0]-player.speed)
            if (pos_bottom >= -60) {
                player.ship_div.style.bottom = `${pos_bottom}px`
            }
    }

    function moveUp() {
        let pos_bottom = parseFloat(player.ship_div.style.bottom.split('px')[0])+player.speed
        if (pos_bottom <= 440) {
            player.ship_div.style.bottom = `${pos_bottom}px`
        }
    }

    function moveRight() {
        let pos_left = parseFloat(player.ship_div.style.left.split('px')[0])+player.speed
        if(pos_left <= 1300) {
            player.ship_div.style.left = `${pos_left}px`
        }
    }
    generateEnemies(5)
    document.addEventListener('keydown', function(e) {
        // console.log(e.keyCode)
        if (e.keyCode == 13 || e.keyCode == 32) {
            let laser = createLaser()
            shootLaser('player', laser)
        }
        if (e.keyCode == 37 || e.keyCode == 65) moveLeft()
        if (e.keyCode == 40 || e.keyCode == 83) moveDown()
        if (e.keyCode == 38 || e.keyCode == 87) moveUp()
        if (e.keyCode == 39 || e.keyCode == 68) moveRight()        
        if (e.keyCode == 36) {
            player.ship_div.style.left = '10px'
        }
        if (e.keyCode == 35) {
            player.ship_div.style.left = '1300px'
        }
        if (e.keyCode == 33) {
            player.ship_div.style.bottom = '440px'
        }
        if (e.keyCode == 34) {
            player.ship_div.style.bottom = '-50px'
        }
    })
    let fn = setInterval(() => {
        let i=0
        enemies.forEach(enemy => {
            let laserCollide = false
            playerLasers.forEach(laser => {
                if (collision(enemy.ship_div, laser.laser_div)) {
                    // console.log("collision")
                    laser.laser_div.style.display = 'none'
                    playerLasers = playerLasers.filter(playerLaser => playerLaser != laser)
                    laserCollide = true
                    return
                }
            })
            let shipCollide = collision(enemy.ship_div, player.ship_div)
            let pos_top = parseFloat(enemy.ship_div.style.top.split('px')[0]) + enemy.speed
            if (pos_top <= 550) {
                enemy.ship_div.style.top = `${pos_top}px`
            } 
            if (shipCollide || laserCollide || pos_top > 550) {
                if (shipCollide) {
                    player.lives -= 1
                    lives.innerHTML = player.lives
                    if (player.lives == 0) {
                        gameOverMenu.style.display = 'initial'
                        clearInterval(fn)
                        enemies.forEach(enemy => enemy.ship_div.style.display='none')
                        enemies = []
                        mainMenu()
                    }
                }
                enemy.ship_div.style.display = 'none'
                enemies.splice(i, 1)
                player.kills += 1
                player.score += 10
                score.innerHTML = player.score
                kills.innerHTML = player.kills
                generateEnemies(Math.round(Math.random() * 5))
            }
            i++
        })
    }, 100)
}

function mainMenu() {
    player = new Player(playerShip)
    player.draw()
    score.innerHTML = player.score
    lives.innerHTML = player.lives
    kills.innerHTML = player.kills
    play = false
    playBtn.onclick = () => {
        play=true
        menu.style.display = 'none'
        main()
    }
    restartBtn.onclick = () => {
        play=true
        gameOverMenu.style.display = 'none'
        main()
    }
    if (play) main()
}

mainMenu()