// All the variables for the game UI
// we only have one game info so everything is static
class GameInfo  {
    // settings variables
    static width    = window.innerWidth;    
    static height   = window.innerHeight;    

    static loading = true;

    // data
    static game;
    static matchDecks;
    static images = {};
    static sounds = {};

    // rendererers
    static scoreBoard;
    static scoreWindow;
    static playerDeck;
    static oppDeck;
    static playerTower;
    static oppTower;    

    // buttons
    static endturnButton;

    // Write your UI settings for each game state here
    // Call the method every time there is a game state change
    static prepareUI() {
        if (GameInfo.game.player.state == "Playing") { 
            GameInfo.endturnButton.show();
        } else if (GameInfo.game.player.state == "Waiting") {
            GameInfo.endturnButton.hide();
        }  else if (GameInfo.game.player.state == "Score") {
            GameInfo.endturnButton.hide();
            GameInfo.scoreWindow.open();
        }
    }
}