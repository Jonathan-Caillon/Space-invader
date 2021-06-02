
function Sprite( filename, left, top ){             // Met fichier en image et definit sa position
    this._node = document.createElement("img");
    this._node.src = filename;
    this._node.style.position = "absolute";
    document.body.appendChild(this._node);

    Object.defineProperty(this, "left", {           // Position X
        get: function() {
            return this._left;
        },
        set: function(value) {
            this._left = value;
            this._node.style.left = value + "px"
        }
    })

    Object.defineProperty(this, "top", {            // Position Y
        get: function() {
            return this._top;
        },
        set: function(value) {
            this._top = value;
            this._node.style.top = value + "px"
        }
    })

    Object.defineProperty(this, "display", {        // Visible ou Non
        get: function() {
            return this._node.style.display;
        },
        set: function(value) {
            this._top = value;
            this._node.style.display = value
        }
    })

    this.left = left;
    this.top = top;
}

Sprite.prototype.startAnimation = function (fct, interval) {
    if (this._clock) window.clearInterval(this._clock);
    let _this = this;
    this._clock = window.setInterval (function() {
        fct(_this);
    }, interval);
}

Sprite.prototype.stopAnimation = function() {
    window.clearInterval(this._clock);
}

Sprite.prototype.checkCollision = function(other) {
        return ! ((this.top + this._node.height < other.top) ||
                    this.top > (other.top + other._node.height) ||
                (this.left + this._node.width < other.left) ||
                    this.left > (other.left + other._node.width));
}

let beam = new Sprite("./images/vaisseau/beam.png", 0, 0)
beam.display = "none"
let vaisseau = new Sprite("./images/vaisseau/spaceship.png", 700, 700)
let explosion = []
explosion.display = "none"

document.onkeydown = function(KeyboardEvent) {
    console.log(KeyboardEvent.code); // permet de recuperer le code correspondant a la touche appuyer
    if (KeyboardEvent.code == "KeyW") { // Z pour avancer
        vaisseau.top -= 10
    }
    else if (KeyboardEvent.code == "KeyS") { // S pour reculer
        vaisseau.top += 10
    }
    else if (KeyboardEvent.code == "KeyD") { // D pour aller a droite
        vaisseau.left += 10
    }
    else if (KeyboardEvent.code == "KeyA") { // Q pour aller a gauche
        vaisseau.left -= 10
    }

    if (vaisseau.left < 0) {                // Le vaisseau ne peut dépasser la fenetre sur la gauche
        vaisseau.left = 0;
    }
    if (vaisseau.left > document.body.clientWidth - vaisseau._node.width) {     // Le vaisseau ne peut dépasser la fenetre sur la droite
        vaisseau.left = document.body.clientWidth - vaisseau._node.width;
    }
    if (vaisseau.top < 0) {                                                                 // Le vaisseau ne peut dépasser la fenetre sur le haut
        vaisseau.top = 0;
    }
    if (vaisseau.top > document.body.clientHeight - vaisseau._node.height) {                    // Le vaisseau ne peut dépasser la fenetre sur le bas
        vaisseau.top = document.body.clientHeight - vaisseau._node.height;
    }

    if (KeyboardEvent.code == "Space") {                                                    // Le vaisseau tire un laser
        if (beam.display == "none") {                                                       // Ne peut pas tirer si il y a deja un laser visible
            beam.display = "block";
            beam.left = vaisseau.left + (vaisseau._node.width - beam._node.width) / 2;
            beam.top = vaisseau.top;
            beam.startAnimation(moveBeam, 1);
        }
    }
}

let aliens = []    // Tableau des vaisseaux aliens

for(let i=1; i<=15; i++) {      // 15 vaisseaux
    aliens[i] = new Sprite("./images/alien/flash_" + (Math.floor(Math.random()*5) + 1) +".png",+ (Math.floor(Math.random()*1000) + 1), + (Math.floor(Math.random()*200) + 1))
    explosion[i] = new Sprite("./images/explosion/explosion"+ i +".gif", 0, 0)
    explosion[i].display = "none"
    aliens[i].startAnimation(moveAlienToRight, 10);
}


function moveBeam (beam) {
    beam.top -= 10;
    if (beam.top < -40) {
        beam.stopAnimation();
        beam.display = "none" 
    }

    for(let i=1; i<=15; i++) {
        if (aliens[i].display == "none") continue;
        if (beam.checkCollision(aliens[i])) {
            beam.stopAnimation();
            beam.display = "none"
            aliens[i].stopAnimation();
            explosion[i].left = aliens[i].left;
            explosion[i].top = aliens[i].top;
            aliens[i].display = "none"
            explosion[i].display = "block"
            setDelay(i)

        }
    }

}

function setDelay(i) {
    setTimeout(function(){
        explosion[i].display = "none";
    }, 3000);
  }

function moveAlienToRight (alien) {
    alien.left += 2
    if(alien.left > document.body.clientWidth - alien._node.width) {
        alien.top += 100;
        alien.startAnimation(moveAlienToLeft, 10)
    }
}

function moveAlienToLeft (alien) {
    alien.left -= 2
    if(alien.left <= 0) {
        alien.top += 100;
        alien.startAnimation(moveAlienToRight, 10)
    }
}



