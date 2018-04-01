/*
* Create a list that hold all posible shapes.
*/
const shapes = ['fa fa-bus' , 'fa fa-truck' , 'fa fa-graduation-cap' , 'fa fa-tree' , 'fa fa-space-shuttle' , 'fa fa-diamond' , 'fa fa-paper-plane-o' , 'fa fa-anchor' , 'fa fa-bolt' , 'fa fa-cube' , 'fa fa-leaf' , 'fa fa-bicycle' , 'fa fa-bomb' , ]
const deck = document.querySelector('.deck');
let cards = document.getElementsByClassName('card');
let restart = document.querySelector('.restart');
let score = 0;
let moves = document.querySelector('.moves');
let cardsOpened = [0];
let clickAble = true;
let s,m,h;
let timeFlag=0;
let maxMatch;
let time;
/*
 * Create a list that holds all of your cards
 */
let gameShapes =[];
//Create temp container that holds the cards before inserting it to the deck
let node;
/*
*Create all the gameShapes in the cards
*/
function createShapes(deckLen){
    let randomExtruct;
    for (deckLen *= deckLen;deckLen>0;deckLen-=2){
        randomExtruct = shapes.splice((Math.floor(Math.random() * shapes.length)),1);
        gameShapes.push(randomExtruct);
        gameShapes.push(randomExtruct);
    }
}
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function deckInit(deckLen){
    hour=min=sec=timeFlag=0;
    maxMatch=deckLen*deckLen/2;
    createShapes(deckLen);
    shuffle(gameShapes);
    for (card of gameShapes){
        node = document.createElement("li");
        node.classList.add('card');
        node.innerHTML = `<i class="${card}"></i>`;
        deck.appendChild(node);
    }
    showCards();
    restartGame();
    
}
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
function showCards(){
    deck.addEventListener('click', function(e)
    { 
        //check if the click is relevant
        if (e.target === e.currentTarget || e.target.classList.contains('match') || e.target.classList.contains('open')|| e.target.classList.contains('fa')) return;
        //if relevant and it's the first click start the timer
        if (!timeFlag) {
            timeFlag=1;
            startTime();
        }
        
        //disable click when two cards played
        if(cardsOpened[0] === 2) clickAble = false;
        if(clickAble){
            //first card open
            if (cardsOpened[0] === 0){
                toggleCards(e,false);
                ++cardsOpened[0];
                cardsOpened.push(e.target);
            }
            //second card opened and it's not match
            else {
                if( e.target.innerHTML!= cardsOpened[1].innerHTML ){
                    ++cardsOpened[0];
                    toggleCards(e,false);
                    // hiding the card with delay
                    setTimeout(function(){
                        toggleCards(e,true);
                        cardsOpened = [0];
                        clickAble= true;
                        score++;
                        starCheck();
                        moves.innerHTML=score;
                    },1000);
                    return;
                }
                //second card opened and match
                else{
                    cardsOpened[1].classList.toggle('match');
                    e.target.classList.toggle('match');
                    cardsOpened= [0];
                    score++;
                    moves.innerHTML=score;
                    maxMatch--;
                    starCheck();
                    isGameOver();
                } 
            }
        }
    ;
    });
}
//function to open the cards
function toggleCards(e , notMatch){
    e.target.classList.toggle('open');
    e.target.classList.toggle('show');
    if(notMatch){
        cardsOpened[1].classList.toggle('open');
        cardsOpened[1].classList.toggle('show'); 
    }
}
//update the stars in the score panel
function starCheck(){
    if (score >=20) document.getElementById('star1').style.display='none';
    if (score >=30) document.getElementById('star2').style.display='none';
}
//function to check if all cards is match and display model of winning
function isGameOver(){
    if(maxMatch===0) {
        clearInterval(time);
        createModel();
    }
}
//function to create and display model of winning
function createModel(){
    //create the model div
    let finalScore = document.createElement('div');
    finalScore.classList.add('finalScore');
    //add the stars status to the div
    finalScore.appendChild(document.querySelector('.stars'));
    //add the moves count and a messege
    node =document.querySelector('.movesCount');
    node.innerHTML = 'Congrats you have finished the game in: ' +node.innerHTML;
    finalScore.appendChild(node);
    //add the time it took and a messege
    node = document.querySelector('.time');
    node.innerHTML = 'and the time it took :'+node.innerHTML;
    finalScore.appendChild(node);
    //create add button to restart the game
    node = document.createElement('button');
    node.classList.add('playAgain');
    node.innerHTML = 'Play Again';
    finalScore.appendChild(node);
    //hide the game board
    setTimeout(function(){},2000);
    let container = document.querySelector('.container');
    container.style.display = 'none';
    //append the model to the site
    document.querySelector('.gameScore').style.background = "lightsteelblue";
    document.querySelector('.gameScore').appendChild(finalScore);
    //create event to restart the game
    node.addEventListener('click',function(){
        location.reload();
    });
}
//function to restart the game
function restartGame(){
    restart.addEventListener('click', function(){
        location.reload();
    });
}
//function to add zero in front of numbers < 10
function checkTime(i) {
    if (i < 10) {i = "0" + i}; 
    return i;
}
//function to start the timer
function startTime(){
    sec++;
    if (sec >= 60) {
        sec = 0;
        min++;
        if (min >= 60) {
            min = 0;
            hour++;
        }
    }
    hour = checkTime(parseInt(hour,10));
    min = checkTime(parseInt(min,10));
    sec = checkTime(sec);
    document.querySelector('.time').innerHTML = hour + ":" + min + ":" + sec;
    timer();
}
function timer(){
    time = setTimeout(startTime, 1000);
}