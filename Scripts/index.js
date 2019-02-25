let userHand = [];
let oppHand = [];
let start = document.getElementById("buttons").children[0];
let discard = document.getElementById("buttons").children[1];
let drawnPile = [];
let turn = 0;
let winC = 0;

/*
* Represents the carsd in the poker game.
* Adds click functionality to the images and manages the card state
* img: the card image within the array.
* opp: 0 if it is not opp, 1 if it is
*/

class Card {
    constructor(img, opp) {
        this.opp = opp; // 0 for user, 1 for opp
        this.suit = "";
        this.num = 0;
        this.selected = false;
        this.img = img;
        this.img.onclick = () => this.select();
        this.draw();
    }


    /*
    * The opp recieves a number 1 and the user recieves a number 0.
    * Since the opp will always be on odd turns and the user on even turns,
    * (turn + opp) % 2 will prevent the opp from choosing user cards on their turn and vice-versa
    */

    select() {
        if((turn + this.opp) % 2 === 0) {
            if(this.selected) {
                this.img.style.border = 'none';
                this.selected = !this.selected;
            } else {
                this.img.style.border = '3px solid yellow';
                this.selected = !this.selected;
            }
        }
    }

    /*
    * Generates a random card number and suit.
    * If the card with the corisponding number and suit has been drawn,
    * it will re-draw, preventing duplicate cards from being in play.
    * Once a new card has been drawn, it will be added to the drawn pile
    */

    draw() {
        this.num = Math.floor((Math.random() * 13) + 2);
        switch(Math.floor((Math.random() * 4) + 1)) {
            case 1: this.suit = 'C'; break;
            case 2: this.suit = 'D'; break;
            case 3: this.suit = 'S'; break;
            case 4: this.suit = 'H'; break;
        }

        drawnPile.includes(this.num + this.suit) ? this.draw() : this.img.src = "./Images/" + this.num + this.suit + '.png'; drawnPile.push(this.num + this.suit);
    }

    /*
    * Checks to see if a card has been selected.
    * If it has, it will deselect it and draw a new card to replace it and return true;
    * If not, it will do nothing and return false;
    */

    discard() {
        if(this.selected) {
            this.select();
            this.draw();
            return true;
        }

        return false;
    }
}

/*
* Adds click functionality to the start button.
* When clicked upon, it will initialize the cards for both the user and opponent,
* and changes the innerHTML to restart. If clicked again, it will reload the game.
*/

start.onclick = () => {
    if(start.innerHTML === "restart") {
        window.location.reload();
    } else {
        for(let user of document.getElementById("user").children){;
            userHand.push(new Card(user, 0));
        }
    
        for(let opp of document.getElementById("opp").children){
            oppHand.push(new Card(opp, 1));
        }

        start.innerHTML = "restart";
    }

    

}

/*
* Adds click functionality to the discard button.
* Checks to see whose turn it is, and will discard their selected cards.
* If the player chooses not to discard any cards, it will count as a hold
* If both players hold sequentially, it will end the game and declare a winner.
*/

discard.onclick = () => {
    let discarded = false;
    if(turn % 2 === 0) {
        for(let card of userHand) {
            if (card.discard()) discarded = true;
        }
        turn++;
    } else {
        for(let card of oppHand) {
            if(card.discard()) discarded = true;
        }
        turn++;
    }

    if(!discarded){
        winC++;
        if(winC === 2){
            document.getElementById("title").innerHTML = "You Won!";
            document.getElementById("title").style.color = 'red';

            for(user of userHand){
                user.img.onclick = () => {};
            }

            for(opp of oppHand){
                opp.img.onclick = () => {};
            }
        }
    } else {
        winC = 0;
    }
}