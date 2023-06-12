async function getGameInfo() {
    let result = await requestPlayerGame();
    if (!result.successful) {
        alert("Something is wrong with the game please login again!");
        window.location.pathname = "index.html";
    } else {
        GameInfo.game = result.game;
        if (GameInfo.scoreBoard) GameInfo.scoreBoard.update(GameInfo.game); 
        else GameInfo.scoreBoard = new ScoreBoard(GameInfo.game);
        // if game ended we get the scores and prepare the ScoreWindow
        if (GameInfo.game.state == "Finished") {
            let result = await requestScore();
            GameInfo.scoreWindow = new ScoreWindow(50,50,GameInfo.width-100,GameInfo.height-100,result.score,closeScore);
        }
    }
}

async function getDecksInfo() {
    let result = await requestDecks();
    if (!result.successful) {
        alert("Something is wrong with the game please login again!");
        window.location.pathname = "index.html";
    } else {
        GameInfo.matchDecks = result.decks;
        if (GameInfo.playerDeck) GameInfo.playerDeck.update(GameInfo.matchDecks.mycards); 
        else GameInfo.playerDeck = new Deck(
                game.player.name,               //title
                GameInfo.matchDecks.mycards,    //cardsInfo
                GameInfo.width/16,              //coord x
                224,                            //coord y
                playCard,                       //clickAction
                GameInfo.images.cards,          //images
                Card.width,                     //xOffset
                Card.height);                   //yOffset

        if (GameInfo.oppDeck) GameInfo.oppDeck.update(GameInfo.matchDecks.oppcards); 
        else GameInfo.oppDeck = new Deck(   
                game.opponents[0].name,
                GameInfo.matchDecks.oppcards,
                GameInfo.width-Card.width-GameInfo.width/16,
                224,
                null,
                GameInfo.images.cards,
                Card.width,
                Card.height);
    }
}

async function getTowersInfo() {
    if (!result.successful) {
        alert("Something is wrong with the game please login again!");
        window.location.pathname = "index.html";
    } else {
        let playerTower = GameInfo.game.player.tower;
        let oppTower    = GameInfo.game.opponents[0].tower;
    
        if (GameInfo.playerTower) GameInfo.playerTower.update(playerTower); 
        else GameInfo.playerTower = new Tower(
                "Your tower",           //title
                playerTower,            //user_game
                GameInfo.width/2,       //coord x
                GameInfo.height*1/32,   //coord y
                GameInfo.height/32,     //height
                GameInfo.images.tower,  //image
                false);                 //flipped
        if (GameInfo.oppTower) GameInfo.oppTower.update(oppTower); 
        else GameInfo.oppTower = new Tower(
                "Opponent",
                oppTower, 
                GameInfo.width/2 , 
                GameInfo.height*1/32, 
                GameInfo.height/32, //height
                GameInfo.images.tower,
                true);
    }
}

async function playCard(card) {
    if (!card.active) {
        alert("That card was already played");
    } else if (confirm(`Do you want to play the "${card.name}" card?`)) {
        let result = await requestPlayCard(card.deckId);
        if (result.successful) {
            await getGameInfo();
            await getDecksInfo();
            await getTowersInfo();
        }
        alert(result.msg);
        // if game ended we get the scores and prepare the ScoreWindow
        if (GameInfo.game.state == "Finished") {
            let result = await requestScore();
            GameInfo.scoreWindow = new ScoreWindow(50,50,GameInfo.width-100,GameInfo.height-100,result.score,closeScore);
        }
    }
}

async function endturnAction() {
    let result = await requestEndTurn();
    if (result.successful) {
        await  getGameInfo();
        GameInfo.prepareUI();
    } else alert("Something went wrong when ending the turn.")
}

async function closeScore() {
    let result = await requestCloseScore();
    if (result.successful) {
        await checkGame(true); // This should send the player back to matches
    } else alert("Something went wrong when ending the turn.")
}