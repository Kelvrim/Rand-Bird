const API_KEY = "your_api_key_here"; // get it at https://nuthatch.lastelm.software/getKey.html
const API_REQ_ADDRESS ="https://nuthatch.lastelm.software/v2/birds?hasImg=true&pageSize=100"

let birdDeckMother = new Array(100); //all cards we're working with will be stored here and shuffled
let birdDeck = new Array(52); //52 cards taken from mother deck. this is what's immediately available to the user

//fill the deck when the page loads
window.onload = function() {
    console.log("Page has fully loaded!");
    fillBirdDeck(); 
};

/*
called on page load and if the user runs out of birds to draw.
pulls 100 cards from the API, shuffles them, and takes the first 52 to put into birdDeck
*/
async function fillBirdDeck() {
    try {
        let response = await fetch(API_REQ_ADDRESS, { 
            headers: { 'api-key': API_KEY }
        });

        if (!response.ok) {
            throw new Error('Network response was not OK');
        }

        //we take a large amount of cards from API and shuffle them. then take the first 52 cards and put into birdDeck
        let data = await response.json();
        birdDeckMother = data["entities"].slice(0, birdDeckMother.length); //store all birds in deck
        shuffleArray(birdDeckMother);
        birdDeck = birdDeckMother.slice(0, birdDeck.length); //copy 52 birds to deck

    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

/*
called when the user presses the "Give me a Bird!" button. 
pulls a card from the deck and calls displayBirdCard to show it on the page
*/
function pullOneCardFromDeck() {
    //refill the deck if empty
    if (birdDeck.length === 0) {
        console.warn("No birds available. Fetching new birds...");
        fillBirdDeck(); 
        return;
    }

    //take the first item from array then remove it
    let bird = birdDeck.shift(); 

    displayBirdCard(bird);
}

/*
called by pullOneCardFromDeck. displays bird image, name, scientific name, and conservation status in 
an inner html string that is inserted into the birdCard div
*/
function displayBirdCard(bird) {
    let birdCard = document.getElementById("birdCard");
    birdCard.innerHTML = `
        <img src="${bird["images"].length ? bird["images"][0] : "defaultBird.png"}"  height="275" width="250">
        <h2>${bird["name"]}</h2>
        <p><strong>Scientific Name:</strong> ${bird["sciName"]}</p>
        <p><strong>Conservation Status:</strong> ${bird["status"]}</p>
    `;
}

/*
fisher-yates shuffle algorithm
source: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
*/
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; //swap elements
    }
    return array;
}
