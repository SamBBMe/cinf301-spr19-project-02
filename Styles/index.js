let user = document.getElementById("user").children;
let ai = document.getElementById("ai").children;
let start = document.getElementById("buttons").children[0];
let discard = document.getElementById("buttons").children[1];

class Card {
    constructor(suit, num) {
        this.suit = suit;
        this.num = num;
        selected = false;
    }

    select() {
        if(selected) {
            
            selected = !selected;
        } else {
            
            selected = !selected;
        }
    }
}

