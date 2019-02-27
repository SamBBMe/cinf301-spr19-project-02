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
            } else if(less3Selected()) {
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
    if(start.innerHTML === "Restart") {
        window.location.reload(true);
    } else {
        document.getElementById("centerText").style.color = 'black';
        document.getElementById("centerText").innerHTML = "Player 1 choose cards to discard or hold";
        for(let user of document.getElementById("user").children){
            userHand.push(new Card(user, 0));
            userHand.sort(function(a, b){return a.num - b.num});
        }


        for(let opp of document.getElementById("opp").children){
            oppHand.push(new Card(opp, 1));
            oppHand.sort(function(a, b){return a.num - b.num});

        }
        start.innerHTML = "Restart";
    }
};


/*
* Adds click functionality to the discard button.
* Checks to see whose turn it is, and will discard their selected cards.
* If the player chooses not to discard any cards, it will count as a hold
* If both players hold sequentially, it will end the game and declare a winner.
*/

discard.onclick = () => {
    if(start.innerHTML==="Restart"){
        let discarded = false;
        if(turn % 2 === 0) {
            document.getElementById("centerText").innerHTML = "Player 2 choose cards to discard or hold";
            userHand.sort(function(a, b){return a.num - b.num});
            for(let card of userHand) {
                if (card.discard()) discarded = true;
            }
            turn++;
        } else {
            document.getElementById("centerText").innerHTML = "Player 1 choose cards to discard or hold";
            oppHand.sort(function(a, b){return a.num - b.num});
            for(let card of oppHand) {
                if(card.discard()) discarded = true;
            }
            turn++;
        }

        if(!discarded){
            winC++;
            if(winC % 2 === 0 || drawnPile.length === 53){
                let winner = "";
                checkWinner() ? winner = "Player 1" : winner = "Player 2"
                if(winner === "Player 1") {
                    document.getElementById("centerText").innerHTML = winner + " won with " + userHand.rank;
                }
                if(winner === "Player 2") {
                    document.getElementById("centerText").innerHTML = winner + " won with " + oppHand.rank;
                }
                document.getElementById("centerText").style.color = 'red';

                for(user of userHand){
                    user.img.onclick = () => {};
                }

                for(opp of oppHand){
                    opp.img.onclick = () => {};
                }

                discard.remove();
            }
        } else {
            winC = 0;
        }
    }  
};

function less3Selected() {
    let numClicked = 0;
    if(turn % 2 === 0){
        for(card of userHand){
            if(card.selected){
                numClicked++
            }
        }
        if(numClicked < 3) {
            return true;
        } else {
            return false;
        }
    } else if (turn % 2 === 1) {
        for(card of oppHand){
            if(card.selected){
                numClicked++
            }
        }
        if(numClicked < 3) {
            return true;
        } else {
            return false;
        }
    }
}

/*
* Determines rank for each player when called
* Returns true if player 1 wins, false if player 2 wins
*/
function checkWinner () {
    let userHandRank = 10;
    let userStraightCount = 0;
    let userFlushCount = 0;
    let userMatchCount = 0;
    let userPairCount = 0;
    let userFlush = false;
    let userStraight = false;
    let userHighCard = 0;
    userHand.rank = "the highest card";

    let oppHandRank = 10;
    let oppHighCard = 0;
    let oppMatchCount = 0;
    let oppStraightCount = 0;
    let oppFlushCount = 0;
    let oppStraight = false;
    let oppFlush = false;
    let oppPairCount = 0;
    oppHand.rank = "the highest card";

    for(let i = 0; i < userHand.length - 1; i++) {
        if (userHand[i].num === (userHand[i + 1].num - 1)) userStraightCount++;
        if (userHand[i].suit === (userHand[i + 1].suit)) userFlushCount++;
        if (userHand[i].num === (userHand[i+1].num)) userMatchCount++;
        if (userMatchCount === 1 && ((userHand[i].num !== userHand[i+1].num) || (i === 3 && userMatchCount === 1))) {
            userPairCount++;
            userMatchCount = 0;
        }
        if(userMatchCount === 2 && userPairCount === 1) userHandRank = 4;
    }
    if(userPairCount === 1) {
        userHand.rank = "one pair";
        userHandRank = 9;
    }
    if(userPairCount === 2) {
        userHand.rank = "two pairs";
        userHandRank = 8;
    }
    if(userMatchCount === 2) {
        userHand.rank = "three of a kind";
        userHandRank = 7;
    }

    if (userStraightCount >= 4){
        userStraight = true;
        userHandRank = 6;
        userHand.rank = "a straight";
    }
    if (userFlushCount >= 4){
        userFlush = true;
        userHandRank = 5;
        userHand.rank = "a flush";
    }

    if(userPairCount === 1 && userMatchCount === 2) {
        userHandRank = 4;
        userHand.rank = "a full house";
    }

    if(userMatchCount === 3) {
        userHandRank = 3;
        userHand.rank = "four of a kind";
    }

    if(userFlush === true && userStraight === true){
        userHandRank = 2;
        userHand.rank = "a straight flush";
        if(userHand[4].num === 14){
            userHandRank = 1;
            userHand.rank = "a royal flush";
        }
    }

    for(let i = 0; i < oppHand.length - 1; i++) {
        if (oppHand[i].num === (oppHand[i + 1].num - 1)) oppStraightCount++;
        if (oppHand[i].suit === (oppHand[i + 1].suit)) oppFlushCount++;
        if (oppHand[i].num === (oppHand[i+1].num)) oppMatchCount++;
        if (oppMatchCount === 1 && (oppHand[i].num !== oppHand[i+1].num) || (i === 3 && oppMatchCount === 1)) {
            oppPairCount++;
            oppMatchCount = 0;
        }
        if(oppMatchCount === 2 && oppPairCount === 1) oppHandRank = 4;
    }
    if(oppPairCount === 1){
        oppHandRank = 9;
        oppHand.rank = "one pair";
    }
    if(oppPairCount === 2) {
        oppHandRank = 8;
        oppHand.rank = "two pairs";
    }
    if(oppMatchCount === 2) {
        oppHandRank = 7;
        oppHand.rank = "three of a kind";
    }

    if (oppStraightCount >= 4){
        oppStraight = true;
        oppHandRank = 6;
        oppHand.rank = "a straight";
    }
    if (oppFlushCount >= 4){
        oppFlush = true;
        oppHandRank = 5;
        oppHand.Rank = "a flush";
    }

    if(oppPairCount === 1 && oppMatchCount === 2) {
        oppHandRank = 4;
        oppHand.rank = "a full house"
    }

    if(oppMatchCount === 3) {
        oppHandRank = 3;
        oppHand.rank = "four of a kind";
    }

    if(oppFlush === true && oppStraight === true){
        oppHandRank = 2;
        oppHand.rank = "a straight flush"
        if(oppHand[4].num === 14){
            oppHandRank = 1;
            oppHand.rank = "a royal flush"
        }
    }

    if (userHandRank < oppHandRank) return true;
    else if (userHandRank === oppHandRank) {
        if (userHandRank === 10 && oppHandRank === 10) {
            for (let card of userHand) {
                if (userHighCard < card.num) {
                    userHighCard = card.num;
                }
            }
            for (let card of oppHand) {
                if (oppHighCard < card.num) {
                    oppHighCard = card.num;
                }
            }
        }
        else if (userHandRank <= 9) {
            for(let i = 0; i < userHand.length - 1; i++) {
                if (userHand[i].num === userHand[i+1].num) {
                    userHighCard = userHand[i].num;
                }
            }
            for(let i = 0; i < oppHand.length - 1; i++) {
                if (oppHand[i].num === oppHand[i+1].num) {
                    oppHighCard = oppHand[i].num;
                }
            }
        }
        if(userHighCard > oppHighCard) return true;
        else return false;
    }
    else return false;

}