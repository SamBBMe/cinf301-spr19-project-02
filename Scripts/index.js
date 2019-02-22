let userHand = [];
let aiHand = [];
let start = document.getElementById("buttons").children[0];
let discard = document.getElementById("buttons").children[1];
let discardPile = [];
let turn = 0;
let winC = 0;

class Card {
    constructor(element, suite, num) {
        this.suite = suite;
        this.num = num;
        this.selected = false;
        this.img = element;
        img.src = num + suit + '.png';
        
    }

    select() {
        if(selected) {
            img.border.style.border = 'none';
            selected = !selected;
        } else {
            img.border.style.border = '3px solid yellow';
            selected = !selected;
        }
    }

    draw() {
        num = Math.floor((Math.random() * 13) + 2);

        let rand = Math.floor((Math.random() * 4) + 1);
        if(rand === 1) {
            suite = 'c';
        } else if (rand === 2) {
            suite = 'd';
        } else if (rand === 3) {
            suite = 's';
        } else if (rand === 4) {
            suite = 'h';
        }

        if(discardPile.includes("" + num + suite)) {
            draw();
        } else {
            img.src = num + suit + '.png';
        }        
    }

    discard() {
        if(selected) {
            discardPile.push("" + num + suite);
            draw();
            return true;
        }

        return false;
    }
}

start.onclick = () => {
    if(start.innerHTML === "restart") {
        window.reload();
    } else {
        start.innerHTML = "restart";

        for(let user of document.getElementById("user").children){
        
            let suite = "";
            let rand = Math.floor((Math.random() * 4) + 1);
            if(rand === 1) {
                suite = 'c';
            } else if (rand === 2) {
                suite = 'd';
            } else if (rand === 3) {
                suite = 's';
            } else if (rand === 4) {
                suite = 'h';
            }
    
            userHand.push(new Card(user, suite, Math.floor((Math.random() * 13) + 2)));
        }
    
        for(let ai of document.getElementById("ai").children){
            
            let suite = "";
            let rand = Math.floor((Math.random() * 4) + 1);
            if(rand === 1) {
                suite = 'c';
            } else if (rand === 2) {
                suite = 'd';
            } else if (rand === 3) {
                suite = 's';
            } else if (rand === 4) {
                suite = 'h';
            }
    
            aiHand.push(new Card(ai, suite, Math.floor((Math.random() * 13) + 2)));
        }
    }
}

discard.onclick = () => {
    let discarded = false;
    if( turn % 2 === 0)
    {
        for(let card of userHand) {
            if (card.discard()) {
                discarded = true;
            }
        }
        turn++;
    } else if (turn % 2 === 1) {
        for(let card of aiHand) {
            if(card.discard()) {
                discarded = true;
            }
        }
        turn++;
    }

    if(discarded){
        winC++;
        if(turn === 2){
            document.getElementById("title").innerHTML = "You Won!";
            document.getElementById("title").style.color = 'green';
        }
    } else {
        winC = 0;
    }
}