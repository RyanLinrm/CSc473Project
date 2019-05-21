import Phaser from 'phaser';
import {PlayScene} from './PlayScene.js';
import {Player} from "../gameObjects/Player";
import {Rider} from "../gameObjects/Rider";
import { CST } from "../CST";
import * as firebase from 'firebase';
import {HUD} from "../gameObjects/HUD";
import {Enemy} from "../gameObjects/Enemy";


/**
 * PlaySceneMultiplayer - extends Phaser.Scene
 * The main scene where the multiplayer game plays out. Has connetions to the firebase where the multiplayer data synchronizes. 
 */
export class PlaySceneMultiplayer extends PlayScene{ //The difference here is that everything is going to be rendered based on the database 
    
    /**
     * creates the class memebers needed for the multiplayer scene calls the constructor of the playscene
     */
    constructor() {
        super(CST.SCENES.PLAYMULTIPLAYER);

    /**
     * The key is the path in the database and the value is what that path should be in the database.
     * anything inside updates will be updates in the update function and then deleted
     * Updates to the database 60 times a second
     *
     * @name PlaySceneMultiplayer#updates
     * @type object
     */
        this.updates = {};

    /**
     * Object that contains all the player objects for the players
     * key is the ID of the player and the value is the actual player sprite in phaser
     * 
     * @name PlaySceneMultiplayer#otherPlayers
     * @type object
     */
        this.otherPlayers = {};

    /**
     * Scene type. 
     * 
     * @name PlaySceneMultiplayer#sceneType
     * @type string
     */
        this.sceneType = "Multiplayer";

    /**
     * varible which tells if the current user is the creator of the multiplayer game.
     * 
     * @name PlaySceneMultiplayer#isCreator
     * @type boolean
     */
        this.isCreator = false;

    /**
     * if the game is currently going for the actual player
     * 
     * @name PlaySceneMultiplayer#GameIsGoing
     * @type boolean
     */
        this.GameIsGoing = false; 

    /**
     * the seatnumber which corresponds to the position in the game and id associated with the leaderboard
     * 
     * @name PlaySceneMultiplayer#seatNumber
     * @type number
     */
        this.seatNumber = -1;

    /**
     * the number of bots this current user should create in their game
     * 
     * @name PlaySceneMultiplayer#bots
     * @type number
     */
        this.bots = 0;

    /**
     * the array should contain only strings which correspond to paths in the database where a listener is currently active
     * any database listener created should also have the path added to this array
     * when the game ends all the listeners in the array are turned off
     * 
     * @name PlaySceneMultiplayer#databaseListners
     * @type array
     */
        this.databaseListners = [];
        //Checking who is the HostID   

    /**
     * The object that contains all the enemies summons by other players
     * @name PlaySceneMultiplayer#otherenemies
     * @type Object
     */
        this.otherenemies = {};
    
    /**
     * The object that contains all the enemies summons by youself
     * @name PlaySceneMultiplayer#mybuddies
     * @type Object
     */
        this.mybuddies = {};
    
    /**
     * the score in number of the player
     * @name PlaySceneMultiplayer#score
     * @type Number
     */
        this.score = 0;

        this.startingPlayerHealth = 250;
    }

    init(data){
    /**
     * The id of the player
     *
     * @name Player#playerID
     * @type number
     */
        this.playerID = data.playerID;

    /**
     * The id of the game room
     *
     * @name Player#gameRoom
     * @type String
     */
        this.gameRoom = data.roomkey;

    /**
     * The seatnumber of the player in the game
     *
     * @name Player#seatNumber
     * @type number
     */
        this.seatNumber = data.seatNumber;

    /**
     * The spritekey of the player
     *
     * @name Player#spritekey
     * @type String
     */
        this.spritekey = data.chartype;



    /**
     * The amount of players in the game
     *
     * @name Player#players
     * @type number
     */
        this.players = data.numOfPlayers;


    /**
     * The current player that is drawn onto the scene
     *
     * @name Player#currentplayerCount
     * @type number
     */
        this.currentplayerCount = 1;
   
    }

    setTemp = (snapShot)=>{
        this.temp = snapShot.val();
    }

    enemyMovementDataChanged = (id,snapShot)=>{
        let dataChanged = snapShot.val();
        let changedKey = snapShot.key;

        if(changedKey === 'pos'){
            this.otherPlayers[id].setPosition(dataChanged.x,dataChanged.y); 
        }else{
            this.otherPlayers[id].setVelocity(dataChanged.x,dataChanged.y); 
        }
    }

    enemyAttackDataChanged = (id,snapShot) => {      
        let dataChanged = snapShot.val();  
        let changedKey = snapShot.key;

        if(changedKey === 'pos'){
            this.otherPlayers[id].setPosition(dataChanged.x,dataChanged.y); 
        }else if(changedKey === 'velocity'){
            this.otherPlayers[id].setVelocity(dataChanged.x,dataChanged.y); 
        }
        else{
            this.otherPlayers[id].attack();
        }

    }

    enemyCheckIfInGame = (id,snapShot) => { 
        if(snapShot.val() === false){
        this.removePlayer(id);
        }
    }

    enemeyHealthChanged = (id,snapShot)=>{
        let health = snapShot.val();
        let player = this.otherPlayers[id];
        player.setHealth(health);
        //console.log(this);
        this.hUD.setPlayerHealth(player.towerPosition,health);
        
    }

    createPlayer = (id,position,velocity) =>{
        
        firebase.database().ref(`Games/${this.gameRoom}/Players/${id}/playerType`).once('value', this.setTemp)
        
        if(this.temp === "bomber"){
        this.otherPlayers[id] = new Player(this,position.x,position.y, "p1", "p1_0.png",0,this.startingPlayerHealth,64,id);
        }
        else if (this.temp === "rider"){
        this.otherPlayers[id] = new Rider(this,position.x,position.y, "rider", "rider_0.png",1,this.startingPlayerHealth,200,id).setScale(0.6);
        }
        this.otherPlayers[id].user = false;
        this.otherPlayers[id].setVelocity(velocity.x,velocity.y);
        if(position.x === 300 && position.y === 300){
            this.pyramid.assignID(id);
            this.otherPlayers[id].towerPosition = 1;
        }
        else if(position.x === 1000 && position.y === 300){
            this.university.assignID(id);
            this.otherPlayers[id].towerPosition = 2;
   
        }
        else if(position.x === 300 && position.y === 1000){
            this.magicstone.assignID(id);
            this.otherPlayers[id].towerPosition = 3;

        }
        else {
            this.building.assignID(id);
            this.otherPlayers[id].towerPosition = 4;
        };
         
 
        this.enemyPlayers.add(this.otherPlayers[id]);
   
        //this.otherPlayers[id].immovable=true;
        //assign collider to this new player
        this.physics.add.overlap(this.damageItems, this.otherPlayers[id],this.bothCollisions);
        this.physics.add.collider(this.otherPlayers[id], this.CollisionLayer);
        this.physics.add.collider(this.otherPlayers[id], this.waterLayer);
        this.physics.add.collider(this.otherPlayers[id], this.enemies);
        this.physics.add.collider(this.enemies, this.waterLayer);
        this.physics.add.collider(this.enemies, this.CollisionLayer);
        this.otherPlayers[id].setCollideWorldBounds(true);
        

        
        //this.player1.setCollideWorldBounds(true);
        let movementDataDB = `Games/${this.gameRoom}/Players/${id}/movementData`;
        firebase.database().ref(movementDataDB).on("child_changed", this.enemyMovementDataChanged.bind(this,id));

        let attackDB = `Games/${this.gameRoom}/Players/${id}/attack`;
        firebase.database().ref(attackDB).on("child_changed", this.enemyAttackDataChanged.bind(this,id));

        let inGameDB = `Games/${this.gameRoom}/Players/${id}/inGame`;
        firebase.database().ref(inGameDB).on("value", this.enemyCheckIfInGame.bind(this,id));

        let playerHealthPath = `Games/${this.gameRoom}/Players/${id}/health`;
        firebase.database().ref(playerHealthPath).on('value',this.enemeyHealthChanged.bind(this,id));

        this.databaseListners.push(movementDataDB,attackDB,inGameDB,playerHealthPath);
    }

    removePlayer = (id)=>{
        console.log("REMOVING");
        this.otherPlayers[id].kill();
        delete this.otherPlayers[id];
        firebase.database().ref(`Games/${this.gameRoom}/Players/${id}/movementData`).off();
        firebase.database().ref(`Games/${this.gameRoom}/Players/${id}/attack`).off();
        firebase.database().ref(`Games/${this.gameRoom}/Players/${id}/inGame`).off();
    }

    createBotAt = (towerNumber)=>{
        let playerPos = this.startingPosFromTowerNum(towerNumber);
        let bot =  new Player(this,playerPos.x,playerPos.y, "p1", "p1_0.png",0,500,64,"bot" + towerNumber);
        bot.becomeBot();
        this.updateSprite(bot);
    }

    addNewEnemy = (x, y, type, playerid, enemyid) => {

        if(type==='wolf'){              
            this.newenemy =new Enemy(this, x, y, "wolf", "wolf_01.png",this.player1,0,220,0.1,5,50,99,200,playerid);
        }

        else if(type==='ninjabot'){              
            this.newenemy=new Enemy(this, x, y, "ninjabot", "ninjabot_01.png",this.player1,1,180,0.8,5,180,60,700,playerid)
        }
        
        else if(type==='skull'){              
            this.newenemy=new Enemy(this, x, y, "skull","skull_01.png",this.player1,3,200,0.8,5,180,60,650,playerid).setScale(0.9);
        }
        else if(type==='demon1'){              
            this.newenemy=new Enemy(this, x, y, "demon1","demon1_01.png",this.player1,2,300,0.7,2,200,70,600, playerid).setScale(1.5);
        }
        else if(type==='wall'){              
            this.newenemy=new Enemy(this, x, y, "wall","wall.png",this.player1,null,100,0,0,0,0,0,playerid).setScale(0.5);
            this.newenemy.body.immovable=true;
            this.newenemy.body.moves=false;
        }

        this.newenemy.assignSelfID(enemyid, this.gameRoom);
        this.otherenemies[enemyid] = this.newenemy;

        this.enemies.add(this.newenemy);

        this.attackableGroup.add(this.newenemy);

        this.physics.add.overlap(this.enemiesAttacks,this.enemyPlayers,this.bothCollisions);

    }

    create() {
        //this.spritekey = "bomber";
        super.create(this.playerID, 'multi');
        this.pyramid.assignSelfID(1,this.gameRoom);
        this.university.assignSelfID(2,this.gameRoom);
        this.magicstone.assignSelfID(3,this.gameRoom);
        this.building.assignSelfID(4,this.gameRoom);
        this.sword_in_the_stone.assignSelfID(5,this.gameRoom);
        this.useUltimate=false;
        this.showUltText=false;
        //this.showUltTexttime=0;
        
        this.lastVelocity = {x:0, y:0}; //Save last velocity to keep track of what we sent to the database
        let database = firebase.database();
        let startingPlayerPosition = this.startingPosFromTowerNum(this.seatNumber);

        this.player.setPosition(startingPlayerPosition.x,startingPlayerPosition.y);
        if(this.spritekey === "bomber"){
        this.player1 = new Player(this,startingPlayerPosition.x,startingPlayerPosition.y, "p1", "p1_0.png",0
                                    ,this.startingPlayerHealth,64,this.playerID);
        }
        else if(this.spritekey === "rider"){
        this.player1 = new Rider(this,startingPlayerPosition.x,startingPlayerPosition.y, "rider", "rider_0.png",1
                                    ,this.startingPlayerHealth,200,this.playerID).setScale(0.6);
        }
        this.player1.setSize(29, 29);
        //this.player1.setVisible(false);
        //this.player.setVisible(true);
        this.player1.setVisible(true);
        this.player.setVisible(false);
        this.player1.setCollideWorldBounds(true);




        if(this.seatNumber === 1) this.pyramid.assignID(this.playerID);
   
        else if(this.seatNumber === 2) this.university.assignID(this.playerID);
     
        else if(this.seatNumber === 3) this.building.assignID(this.playerID);
   
        else this.magicstone.assignID(this.playerID);
     
       let countDownText= this.add.text(this.player.x, this.player.y, 5, { fontFamily: 'Arial', fontSize: 700, color: '#ffffff' });
       countDownText.setOrigin(0.5,0.5); 

       this.cameras.main.startFollow(this.player1);
       this.player.destroy();
       this.hUD = new HUD(this, this.player1, this.playerID, "multi", this.gameRoom);
       this.manabar=this.hUD.manabar;
       //this.player1.immovable=true;
        this.physics.add.collider(this.player1, this.CollisionLayer);
        this.physics.add.collider(this.player1, this.waterLayer);
        this.physics.add.collider(this.player1, this.enemies);

       this.enemyPlayers.add(this.player1);
       //player collide handler with damage item
       this.physics.add.overlap(this.damageItems, this.player1, this.bothCollisions);



       let creatorDB = `Games/${this.gameRoom}/creator`;
       database.ref(creatorDB).once("value", (snapShot) => {
            let value = snapShot.val();
            let uID = value.uid;

            if(uID === this.playerID){ //check if playerCreated the room
                this.isCreator = true;
                this.updates[`Games/${this.gameRoom}/HostID`] = this.playerID;
                let count = 5;
                let updateCountDown = ()=>{
                    
                    if(count > -2){
                        this.updates[`Games/${this.gameRoom}/countDown`] = count;
                        setTimeout(updateCountDown, 1000);
                    }
                    count--;
                };
                updateCountDown();
            }
        });
        
        let countDownDB = `Games/${this.gameRoom}/countDown`;
        database.ref(countDownDB).on('value',(snapShot)=>{
            let countDown = snapShot.val();
            if(countDown > 0){
                countDownText.setText(countDown);
            }
            if(countDown === 0){
                countDownText.setText("Go");
                
                this.tweens.add({
                    targets: countDownText,
                    alpha: 0,
                    ease: 'Power1',
                    duration: 2000
                });
                this.GameIsGoing = true;
            }


        });
        
        let playerIDDB = `Games/${this.gameRoom}/Players/${this.playerID}`;
        //SETTING the player datatype
        database.ref(playerIDDB).set({
            movementData: {
                pos: this.startingPosFromTowerNum(this.seatNumber),
                velocity: {x:0,y:0}
            },
            attack: {
                time:0,
                pos: this.startingPosFromTowerNum(this.seatNumber),
                velocity: {x: 0, y:0}
            },
            health: this.startingPlayerHealth,
            inGame: true,     
            playerType: this.spritekey
        });

        let seatNumberDB = `Games/${this.gameRoom}/Towers/${this.seatNumber}`;
        database.ref(seatNumberDB).set({ //CreateTowerInDatabase
            HP: 100,
            alive: true,
            owner: this.playerID ,
            killerid: ''
        });

        let sword_in_stoneDB =`Games/${this.gameRoom}/Towers/5`;
        database.ref(sword_in_stoneDB).set({
            HP:100,
            alive: true,
            killerid: ''
        });
        
        let playerDB = `Games/${this.gameRoom}/Players`;
        database.ref(playerDB).on('child_added',(snapShot)=>{
            let id = snapShot.key;

            if(id === this.playerID)
                return;

            let playerData = snapShot.val();
            this.createPlayer(id,playerData.movementData.pos,playerData.movementData.velocity);

        });
       
        let movementDataDB = `Games/${this.gameRoom}/Players/${this.playerID}/movementData`
        database.ref(movementDataDB).on('child_changed', (snapShot) => {        
            let dataChanged = snapShot.val(); //The new data
            let changedKey = snapShot.key; //The key for the data that was changed

            if(changedKey === 'pos'){
                this.player1.setPosition(dataChanged.x,dataChanged.y); 
            }else{
                this.player1.setVelocity(dataChanged.x,dataChanged.y); 
            }
        });
        
        let timeDB = `Games/${this.gameRoom}/Players/${this.playerID}/attack/time`;
        database.ref(timeDB).on("value", (snapShot) => { 
            if (snapShot.val() !== 0)       
                this.player1.attack();

        });

        let playerHealthPath = `Games/${this.gameRoom}/Players/${this.playerID}/health`;
        firebase.database().ref(playerHealthPath).on('value',(snapShot)=>{
            let health = snapShot.val();
            this.hUD.setPlayerHealth(this.seatNumber,health);
            
        });

        /*let ScoreDB = `Games/${this.gameRoom}/playerScore`;
        firebase.database().ref(ScoreDB).child(this.playerID).set({
            score: 0,
            killid: ''
        })*/


        firebase.database().ref(playerDB).on("child_removed", (snapShot) => {
            this.removePlayer(snapShot.key);
        });


        window.addEventListener('beforeunload', (event) => {

            database.ref(`Games/${this.gameRoom}/Players/${this.playerID}`).remove();

        });
        
        //check if otherplayer has placed a new enemy on the map
        let dragdataDB = `Games/${this.gameRoom}/dragdata`;
        firebase.database().ref(dragdataDB).on('child_changed', snapShot=>{
            let newenemyinfo = snapShot.val();

            if( newenemyinfo.x >= 0 && newenemyinfo.y >= 0 && newenemyinfo.ownerid !== this.playerID ){
                this.addNewEnemy( newenemyinfo.x, newenemyinfo.y, newenemyinfo.type, newenemyinfo.ownerid, newenemyinfo.enemyid );
            }
        })

        //check if the enemy dies, if so async to all players and meanwhile getting score
        let enemyDB = `Games/${this.gameRoom}/enemies`;
        firebase.database().ref(enemyDB).on('child_changed', snapShot=>{
            let enemyinfo = snapShot.val();
            let enemyid = snapShot.key;
            
            if( enemyinfo.killerid === this.playerID ){
                this.score += 50;
                this.hUD.setScore(this.score);
            }

            if(!enemyinfo.alive){
                if(this.mybuddies[enemyid]){
                    this.mybuddies[enemyid].kill(false);
                }
                else if(this.otherenemies[enemyid]){
                    this.otherenemies[enemyid].kill(false);
                }
            }
            
            firebase.database().ref(enemyDB).child(enemyid).remove();
            
        });
        let towerDB = `Games/${this.gameRoom}/Towers`;
        firebase.database().ref(towerDB).on('child_changed', snapShot=>{
            let towerinfo = snapShot.val();
            let towerid = snapShot.key;
    
            
            if( towerinfo.killerid === this.playerID){
                this.score += 1000;
            
            }
           
            if(towerid==='5' && towerinfo.killerid === this.playerID){
                this.score+=500;
                this.useUltimate=true;
                this.showUltText = true;
            }
            

        
            
            
            
        })

        //getting score by killing ohter players
        /*firebase.database().ref(ScoreDB).on('child_changed', snapShot=>{
            let playerdata = snapShot.val();
            if(playerdata.killid === this.playerID){
                this.score += 100;
            }
        })*/

        this.databaseListners.push(creatorDB,countDownDB,playerIDDB,seatNumberDB,sword_in_stoneDB,playerDB,movementDataDB,
            timeDB,dragdataDB,enemyDB,playerHealthPath,towerDB);

    }

    update(time,delta){
      //  console.log(this.player1.mana)
        this.hUD.update(time,this.player1,this);
        if(this.showUltText){
            this.add.text(500, 615, "You have won the ultimate ability!", { fontFamily: 'Arial', fontSize: 22, color: '#ffffff' });
            this.add.text(500, 645, "Press E to destroy nearby enemies.", { fontFamily: 'Arial', fontSize: 22, color: '#ffffff' });
            this.showUltText = false;

        }
        if(this.player1.mana<=1000){
            this.player1.mana+=delta/1000;
            this.manabar.regenManaBar((delta/1000)*2);}
        this.changeEnemyColor(this.player1,time);
        let inputVelocity = {x:0,y:0}; //Velocity based on player input
        let speed = 64;

        if (this.GameIsGoing && this.player1.active) {


            if (this.keyboard.SHIFT.isDown) {
                speed = 192;
            }

            if (this.keyboard.W.isDown) {
                inputVelocity.y = -speed;
            }
            if (this.keyboard.S.isDown) {
                inputVelocity.y = speed;
            }
            if (this.keyboard.A.isDown) {
                inputVelocity.x = -speed;
            }
            if (this.keyboard.D.isDown) {
                inputVelocity.x = speed;
            }

            if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
                let newAttack = {
                    time: Date.now(),
                    pos: { x: Math.round(this.player1.x), y: Math.round(this.player1.y) },
                    velocity: inputVelocity
                };

                this.updates[`Games/${this.gameRoom}/Players/${this.playerID}/attack/`] = newAttack;

            }
            

            if (this.keyboard.W.isUp && this.keyboard.S.isUp) {
                inputVelocity.y = 0;
            }
            if (this.keyboard.A.isUp && this.keyboard.D.isUp) {
                inputVelocity.x = 0;
            }

            if (inputVelocity.x !== this.lastVelocity.x || inputVelocity.y !== this.lastVelocity.y) { //Don't want to update database if we don't have to 
                this.lastVelocity = { ...inputVelocity };
                this.player1.setVelocity(inputVelocity.x, inputVelocity.y);

                this.updates[`Games/${this.gameRoom}/Players/${this.playerID}/movementData/velocity`] = inputVelocity;
                this.updates[`Games/${this.gameRoom}/Players/${this.playerID}/movementData/pos`] = { x: Math.round(this.player1.x), y: Math.round(this.player1.y) };

            }
        
        if(this.useUltimate===true){
        if (Phaser.Input.Keyboard.JustDown(this.Ebar) && this.cooldowntime< time)
        {  
            this.Ultimate(time);
        
        }
        if(this.destroytime < time){
            this.demonskill.destroy();
        }


        }
    }




        if(Object.keys(this.updates).length !== 0){ //If updates contains something then send it to the database. This is for future updates
            firebase.database().ref().update(this.updates);
        }



    }

    wonGame = () => {
        this.GameIsGoing = false;
        let countDownText = this.add.text(this.player1.x, this.player1.y, "You Won", { fontFamily: 'Arial', fontSize: 150, color: '#ffffff' });
        countDownText.setOrigin(0.5, 0.5);
    }
    Ultimate = (time) =>{
        //player ability to destory enemies near the range
            this.manabar.cutManaBar(200);
            this.player1.mana-=200;
            this.demonskill=this.add.sprite(this.player1.x, this.player1.y, 'a2_01').setScale(1.8)
            this.demonskill.play('ab2');
            this.enemylist=[];
            this.destroytime = time + 1000;
            this.cooldowntime = time + 10000;
            this.enemies.getChildren().map(child => this.enemylist.push(child));  
            for (let i = 0; i < this.enemylist.length; i++) {
                if (this.enemylist[i].uid!==this.player1.uid){
                    if (Math.abs(this.enemylist[i].x - this.player1.x) < 200 && Math.abs(this.enemylist[i].y - this.player1.y) < 200){ 
                    this.enemylist[i].kill(true,this.playerUid);       
                    }
                }
            }
    }


    towerDestroyed = (TowerID)=>{
        this.GameIsGoing = false;
        this.scene.remove(CST.SCENES.PLAYMULTIPLAYER);
        this.updates[`Games/${this.gameRoom}/Players/${this.playerID}/inGame/`] = false;
        this.scene.start(CST.SCENES.GAMEOVER, {
            playerID : this.playerID,
            roomkey : this.gameRoom,
            chartype: this.spritekey,
            score: this.score
        });
        this.databaseListners.forEach((path)=>{
            console.log(path);
            firebase.database().ref(path).off();
        });
    }

    setHealthInDB = (health)=>{
        this.updates[`Games/${this.gameRoom}/Players/${this.playerID}/health`] = health;
    }

    /*handlePlayerKill( playerid, killerid ){
        this.updates[`Games/${this.gameRoom}/playerScore/${playerid}/killid`] = killerid;
    }*/
}