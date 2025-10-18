// Cube Wars Game - Main Game File
class CubeWarsGame {
    constructor() {
        this.config = {
            type: Phaser.AUTO,
            parent: 'game-container',
            width: 800,
            height: 600,
            backgroundColor: '#0a0a0a',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 100 },
                    debug: false
                }
            },
            scene: {
                preload: this.preload.bind(this),
                create: this.create.bind(this),
                update: this.update.bind(this)
            }
        };

        this.game = new Phaser.Game(this.config);
        this.score = 0;
        this.gameOver = false;
        this.powerUpActive = false;
        this.powerUpEndTime = 0;
    }

    preload() {
        // Load assets
        this.load.image('background', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MDAgNjAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMGEwYTBhIi8+PC9zdmc+');
        this.load.image('player', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MCA1MCI+PHBhdGggZD0iTTI1IDVMMTAgNDBINDBsMTUtMzV6bTAgMEw0MCA0MEgyNWwxNS0zNXoiIGZpbGw9IiMwMGM2ZmYiLz48L3N2Zz4=');
        this.load.image('bullet', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMCAxNSI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjE1IiBmaWxsPSIjZmZkNzAwIi8+PC9zdmc+');
        this.load.image('cube1', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMCAzMCI+PHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjZmYxYTFhIi8+PC9zdmc+');
        this.load.image('cube2', 'data:image/sv...');
        this.load.image('powerup', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZDcwMCIgZD0iTTEyLDEyQzcuNTgsMTIgNCwxNS41OCA0LDIwQzQsMjAuNTUgNC40NSwyMSA1LDIxQzUuNTUsMjEgNiwyMC41NSA2LDIwQzYsMTYuNjkgOC42OSwxNCAxMiwxNEMxNS4zMSwxNCAxOCwxNi42OSAxOCwyMEMxOCwyMC41NSAxOC40NSwyMSAxOSwyMUMxOS41NSwyMSAyMCwyMC41NSAyMCwyMEMyMCwxNS41OCAxNi40MiwxMiAxMiwxMk0xMiwyQzE2LjQyLDIgMjAsNS41OCAyMCwxMEMyMCwxMC41NSAxOS41NSwxMSAxOSwxMUMxOC40NSwxMSAxOCwxMC41NSAxOCwxMEMxOCw2LjY5IDE1LjMxLDQgMTIsNEM4LjY5LDQgNiw2LjY5IDYsMTBDNiwxMC41NSA1LjU1LDExIDUsMTFDNC40NSwxMSA0LDEwLjU1IDQsMTBDNCw1LjU4IDcuNTgsMiAxMiwyTTEyLDZDMTMuMSw2IDE0LDYuOSAxNCw4QzE0LDkuMSAxMy4xLDEwIDEyLDEwQzEwLjksMTAgMTAsOS4xIDEwLDhDMTAsNi45IDEwLjksNiAxMiw2WiIgLz48L3N2Zz4=');
    }

    create() {
        // Create background
        this.background = this.add.tileSprite(400, 300, 800, 600, 'background');
        
        // Create player
        this.player = this.physics.add.sprite(400, 500, 'player').setScale(1.5);
        this.player.setCollideWorldBounds(true);

        // Create groups
        this.bullets = this.physics.add.group();
        this.cubes = this.physics.add.group();
        this.powerUps = this.physics.add.group();

        // Score text
        this.scoreText = this.add.text(16, 16, 'Score: 0', { 
            fontSize: '24px', 
            fill: '#fff',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 4
        });

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Spawn cubes
        this.time.addEvent({
            delay: 1000,
            callback: this.spawnCube,
            callbackScope: this,
            loop: true
        });

        // Spawn power-ups
        this.time.addEvent({
            delay: 10000,
            callback: this.spawnPowerUp,
            callbackScope: this,
            loop: true
        });

        // Collision detection
        this.physics.add.collider(this.bullets, this.cubes, this.bulletHitCube, null, this);
        this.physics.add.overlap(this.player, this.powerUps, this.collectPowerUp, null, this);
        this.physics.add.overlap(this.player, this.cubes, this.playerHit, null, this);
    }

    update(time) {
        if (this.gameOver) return;

        // Player movement
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-300);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(300);
        } else {
            this.player.setVelocityX(0);
        }

        // Shooting
        if ((this.spaceKey.isDown || this.cursors.up.isDown) && time > this.lastFired) {
            this.shoot();
            this.lastFired = time + 200;
        }

        // Update power-up status
        if (this.powerUpActive && time > this.powerUpEndTime) {
            this.powerUpActive = false;
            this.player.clearTint();
        }

        // Scroll background
        this.background.tilePositionY -= 1;
    }

    shoot() {
        const bullet = this.bullets.create(this.player.x, this.player.y - 20, 'bullet');
        bullet.setVelocityY(-500);
    }

    spawnCube() {
        if (this.gameOver) return;
        
        const x = Phaser.Math.Between(50, 750);
        const cubeType = Phaser.Math.Between(1, 3);
        const cube = this.cubes.create(x, 0, `cube${cubeType}`);
        
        // Different behaviors based on cube type
        switch(cubeType) {
            case 1: // Red cube - basic
                cube.health = 1;
                break;
            case 2: // Green cube - faster
                cube.health = 1;
                cube.setVelocityY(150);
                break;
            case 3: // Yellow cube - needs multiple hits
                cube.health = 3;
                cube.setTint(0xffff00);
                break;
        }
    }

    spawnPowerUp() {
        if (this.gameOver) return;
        
        const x = Phaser.Math.Between(50, 750);
        const powerUp = this.powerUps.create(x, 0, 'powerup');
        powerUp.setVelocityY(100);
    }

    bulletHitCube(bullet, cube) {
        bullet.destroy();
        
        cube.health--;
        if (cube.health <= 0) {
            // Score points based on cube type
            const points = cube.texture.key === 'cube3' ? 30 : 10;
            this.score += points;
            this.scoreText.setText(`Score: ${this.score}`);
            
            // Create explosion effect
            const explosion = this.add.circle(cube.x, cube.y, 15, 0xff5722);
            this.tweens.add({
                targets: explosion,
                radius: 30,
                alpha: 0,
                duration: 300,
                onComplete: () => explosion.destroy()
            });
            
            cube.destroy();
        } else if (cube.texture.key === 'cube3') {
            // Flash yellow cube when hit
            cube.setTint(0xff0000);
            this.time.delayedCall(100, () => {
                if (cube.active) cube.setTint(0xffff00);
            });
        }
    }

    collectPowerUp(player, powerUp) {
        powerUp.destroy();
        this.powerUpActive = true;
        this.powerUpEndTime = this.time.now + 10000; // 10 seconds
        this.player.setTint(0x00ff00); // Visual feedback
        
        // Enable rapid fire
        this.time.removeAllEvents();
        this.time.addEvent({
            delay: 100,
            callback: () => {
                if (this.spaceKey.isDown || this.cursors.up.isDown) {
                    this.shoot();
                }
            },
            callbackScope: this,
            loop: true
        });
        
        // Reset to normal fire after power-up ends
        this.time.delayedCall(10000, () => {
            this.time.removeAllEvents();
            this.lastFired = this.time.now;
        });
    }

    playerHit(player, cube) {
        if (this.gameOver) return;
        
        cube.destroy();
        
        // Visual feedback
        player.setTint(0xff0000);
        this.time.delayedCall(200, () => {
            if (!this.gameOver) player.clearTint();
        });
        
        // Game over logic
        this.gameOver = true;
        
        // Show game over text
        const gameOverText = this.add.text(400, 200, 'GAME OVER', { 
            fontSize: '64px', 
            fill: '#ff1a1a',
            fontFamily: 'Arial',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        const scoreText = this.add.text(400, 280, `Your Score: ${this.score}`, {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        const restartText = this.add.text(400, 350, 'Click to Play Again', {
            fontSize: '24px',
            fill: '#00c6ff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Make restart text blink
        this.tweens.add({
            targets: restartText,
            alpha: 0.5,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        
        // Restart on click
        this.input.on('pointerdown', () => {
            this.scene.restart();
            this.score = 0;
            this.gameOver = false;
        });
    }
}

// Start the game when the page loads
window.onload = () => {
    const game = new CubeWarsGame();
};
