//Play scene for our basic playground
//All the functions and character added in this file will be temporary
//just for demo
//Use scene list to generate keyword
import Phaser from 'phaser';

import { CST } from "../CST";
import { Bullet } from "../gameObjects/Projectiles";
import { Units } from "../gameObjects/Units";
import {Player} from "../gameObjects/Player";
import {Bomber} from "../gameObjects/Bomber";
import {Enemy} from "../gameObjects/Enemy";
import {Rider} from "../gameObjects/Rider";
import {Melee} from "../gameObjects/Melee";
import {HUD} from "../gameObjects/HUD";
import spriteAnimations from '../gameObjects/Animations';


export class PlayScene extends Phaser.Scene{

    constructor(sceneKey = CST.SCENES.PLAY){
        super({key:sceneKey});
        this.sceneType = "Single";
        this.seatNumber = 1;
        this.single = true;
        this.mode = 'single';
    }

    preload(){ 
        spriteAnimations(this);
        this.load.image("tiles1", `${process.env.PUBLIC_URL}/assets/tiles/map_atlas.png`);
        this.load.image("tiles2", `${process.env.PUBLIC_URL}/assets/tiles/map_atlas2.png`);

        this.load.tilemapTiledJSON("Mymap",`${process.env.PUBLIC_URL}/assets/map/map.json`);
    }

    init(data){
        this.spritekey = data
    }

    create(uid, multi){
        this.playerUid = uid;
        if(multi !== undefined) this.mode = multi;
        //Create an enemygroup with runChildUpdate set to true. Every enem y added to this group will have its update function then called. 
        //Without this groupt the update funciton would not be called for the enemies
       
        this.updatingSpriteGroup = this.add.group({runChildUpdate: true}); //Sprites that should run their own update function
        this.updateSprite = (sprite) => this.updatingSpriteGroup.add(sprite); //adds sprite to updating group

        this.attackableGroup = this.add.group({runChildUpdate: true}); 
        //Create Groups for updating andn collision detection;  
        this.enemies = this.add.group(); 
        this.enemyPlayers = this.add.group();
        this.enemyTowers = this.add.group();
        this.damageItems = this.add.group(); 
        this.enemiesAttacks = this.add.group();
        this.towerShooting =this.add.group();
        //Collision Functions
        //Funciton to run collision funciton of both objects
        this.bothCollisions = (objectA,objectB)=>{
            
            if(objectA.active && objectB.active){
                if(objectA.uid !== objectB.uid){
                objectA.collision();
                objectB.collision();
                }
                 
            }
        };
        this.physics.add.overlap(this.damageItems, this.enemyTowers,this.bothCollisions);
        this.physics.add.overlap(this.damageItems, this.enemies,this.bothCollisions);
        this.physics.add.overlap(this.enemiesAttacks,this.enemyPlayers,this.bothCollisions);
        this.physics.add.overlap(this.towerShooting,this.enemyPlayers,this.bothCollisions);
        this.physics.add.overlap(this.enemiesAttacks,this.enemyTowers,this.bothCollisions);
        this.physics.add.overlap(this.towerShooting,this.enemies,this.bothCollisions);
        //this.physics.add.overlap(this.damageItems,this.enemyPlayers,bothCollisions);
        const randNumber = Math.floor((Math.random() * 4) + 1);
        let playerStartingPos = this.startingPosFromTowerNum(randNumber);
      //  this.player = new Bomber(this,playerStartingPos.x,playerStartingPos.y, "p1", "p1_01.png",0,500,150);
        switch(this.spritekey){
            case "bomber":
            this.player = new Bomber(this,playerStartingPos.x,playerStartingPos.y, "p1", "p1_01.png",0,500,150,'123');
            break;
            case "rider":
            this.player = new Rider(this,playerStartingPos.x,playerStartingPos.y, "rider", "rider_01.png",1,500,200,'123').setScale(0.8);
            break;
        }
        this.enemyPlayers.add(this.player);

        
        this.towers = this.add.group(); 
        this.towers.removeCallback = (tower)=>{
            
            if(tower.uid === this.playerUid){
                this.towerDestroyed(tower.uid);
            }
            else{
                console.log(this.towers.getLength());
                if(this.towers.getLength() === 1 && this.GameIsGoing === true){
                    this.wonGame();
                }
            }
           
        };
    
       
        //warning when manabar is too low for a special attack
        this.manawarning = this.add.text(150,73,'low mana').setDepth(3);
        this.manawarning.setScrollFactor(0);
        this.manawarning.setVisible(false)

      /*
        //Mini Map

        //create a sample minimap ---needs to change to dynamic

        this.minimap = this.cameras.add(this.game.renderer.width - 255, 0, 240, 300).setZoom(0.2).setName('mini');
        this.minimap.setBackgroundColor(0x002244);
        this.minimap.scrollX = 600;  
        this.minimap.scrollY = 600; */


        //adding buildings for each player

        //adding resrouces to the middle 
  
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.enemies, this.enemies);
        this.physics.add.collider(this.player, this.enemies);
        //adjust player hit box
        this.player.setSize(30, 30);
        if(this.mode === 'single'){
            this.hud = new HUD(this, this.player, this.playerUid, this.mode)
            this.sword_in_the_stone=new Units(this,645,645,645,595,"sword_in_the_stone");
            this.sword_in_the_stone.setScale(0.5);
            this.sword_in_the_stone.uid=this.player.uid;
            this.towers.add(this.sword_in_the_stone);
            this.building=new Units(this,1200,1200,1150,1099,"building1",1,1000,4,180,200).setScale(0.15);
            this.university=new Units(this,1200,0,1150,-1,"university",1,1000).setScale(1.5);
            this.pyramid=new Units(this,0,0,100,-1,"pyramid",1,1000,4,180,200).setScale(1.5);
            this.magicstone=new Units(this,0,1200,100,1089,"magicstone",1,1000,4,180,200).setScale(1.5);

            //The enemies are in four different towers.
            this.wolf0=new Enemy(this, 1100,1200, "wolf", "Wolf_01.png",this.player,0,200,0.1,5,50,99,200);
            this.wolf1=new Enemy(this, 1050,1200, "wolf", "Wolf_01.png",this.player,0,200,0.1,5,50,99,200);
            this.wolf2=new Enemy(this, 1000,1200, "wolf", "Wolf_01.png",this.player,0,200,0.1,5,50,99,200);
            this.wolf3=new Enemy(this, 950,1200, "wolf", "Wolf_01.png",this.player,0,200,0.1,5,50,99,200);
            this.wolf4=new Enemy(this, 900,1200, "wolf", "Wolf_01.png",this.player,0,200,0.1,5,50,99,200);

            
            this.ninjabot0=new Enemy(this, 1000,200, "ninjabot", "ninjabot_1.png",this.player,1,100,0.8,5,180,60,700);
            this.ninjabot1=new Enemy(this, 950,200, "ninjabot", "ninjabot_1.png",this.player,1,100,0.8,5,180,60,700);
            this.ninjabot2=new Enemy(this, 900,200, "ninjabot", "ninjabot_1.png",this.player,1,100,0.8,5,180,60,700);
            this.ninjabot3=new Enemy(this, 850,200, "ninjabot", "ninjabot_1.png",this.player,1,100,0.8,5,180,60,700);
            this.ninjabot4=new Enemy(this, 800,200, "ninjabot", "ninjabot_1.png",this.player,1,100,0.8,5,180,60,700);

            this.skull0=new Enemy(this,50,300,"skull","skull_01",this.player,3,200,0.8,5,180,60,650).setScale(0.9);
            this.skull1=new Enemy(this,100,300,"skull","skull_01",this.player,3,200,0.8,5,180,60,650).setScale(0.9);
            this.skull2=new Enemy(this,150,300,"skull","skull_01",this.player,3,200,0.8,5,180,60,650).setScale(0.9);
            this.skull3=new Enemy(this,200,300,"skull","skull_01",this.player,3,200,0.8,5,180,60,650).setScale(0.9);
            this.skull4=new Enemy(this,250,300,"skull","skull_01",this.player,3,200,0.8,5,180,60,650).setScale(0.9);

            this.demon0=new Enemy(this,50,1200,"demon1","demon1_01",this.player,2,200,0.7,2,200,70,500).setScale(1.5);
            this.demon1=new Enemy(this,100,1200,"demon1","demon1_01",this.player,2,200,0.7,2,200,70,500).setScale(1.5);
            this.demon2=new Enemy(this,150,1200,"demon1","demon1_01",this.player,2,200,0.7,2,200,70,500).setScale(1.5);
            this.demon3=new Enemy(this,200,1200,"demon1","demon1_01",this.player,2,200,0.7,2,200,70,500).setScale(1.5);
            this.demon4=new Enemy(this,250,1200,"demon1","demon1_01",this.player,2,200,0.7,2,200,70,500).setScale(1.5);

            this.enemies.add(this.demon0);
            this.enemies.add(this.demon1);
            this.enemies.add(this.demon2);
            this.enemies.add(this.demon3);
            this.enemies.add(this.demon4);

            this.enemies.add(this.skull0);
            this.enemies.add(this.skull1);
            this.enemies.add(this.skull2);
            this.enemies.add(this.skull3);
            this.enemies.add(this.skull4);

            this.enemies.add(this.wolf0);
            this.enemies.add(this.wolf1);
            this.enemies.add(this.wolf2);
            this.enemies.add(this.wolf3);
            this.enemies.add(this.wolf4);

            this.enemies.add(this.ninjabot0);
            this.enemies.add(this.ninjabot1);
            this.enemies.add(this.ninjabot2);
            this.enemies.add(this.ninjabot3);
            this.enemies.add(this.ninjabot4);
            // if all the enemy towers are destoryed, you win the game
            // if sword_in_the_stone is destoryed or the player's hp is below 0
            // you lsoe the game
            if(this.sword_in_the_stone.healthPoints<0 || this.player.healthPoints<0){
                
                this.scene.start(CST.SCENES.GAMEOVER);
            }
            
        }
        if(this.mode === 'multi'){
            this.pyramid=new Units(this,0,0,100,-1,"pyramid",1,1000,4,180,200).setScale(1.5);
            this.university=new Units(this,1200,0,1150,-1,"university",1,1000).setScale(1.5);
            this.building=new Units(this,1200,1200,1150,1099,"building1",1,1000,3,180,200).setScale(0.15);
            this.magicstone=new Units(this,0,1200,100,1089,"magicstone",1,1000).setScale(1.5);
            this.sword_in_the_stone=new Units(this,645,645,645,595,"sword_in_the_stone").setScale(0.5);
            this.physics.add.collider(this.enemies, this.waterLayer);

      
        }
        this.towers.add(this.building); 
        this.towers.add(this.university);
        this.towers.add(this.pyramid);
        this.towers.add(this.magicstone);
 
        //input and phyics
        this.keyboard = this.input.keyboard.addKeys("W, A, S, D, SHIFT");     
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.Rbar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.Tbar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
        this.Qbar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        //Map

        //add in our map
        let Mymap = this.add.tilemap("Mymap");

        let tiles1 = Mymap.addTilesetImage("map_atlas", "tiles1");
        let tiles2 = Mymap.addTilesetImage("map_atlas2", "tiles2");

       // display layers
        let groundLayer = Mymap.createStaticLayer("GroundLayer", [tiles1], 0 , 0).setDepth(-3);
        let centerLayer = Mymap.createStaticLayer("Center", [tiles2], 0 , 0).setDepth(-1);
        this.waterLayer = Mymap.createStaticLayer("Water", [tiles1], 0 , 0).setDepth(-2);
        let objectLayer = Mymap.createStaticLayer("Objects", [tiles1], 0 , 0).setDepth(-1);
        let addonLayer = Mymap.createStaticLayer("AddOn", [tiles1], 0 , 0).setDepth(-1);
        this.CollisionLayer = Mymap.createStaticLayer("Collision",[tiles1], 0, 0);

        //Collision layer handler
        this.CollisionLayer.setCollisionByProperty({collides:true});
        this.waterLayer.setCollisionByProperty({collides:true});

        //Assign collider objects
        this.physics.add.collider(this.player, this.CollisionLayer);
        this.physics.add.collider(this.player, this.waterLayer);
        this.physics.add.collider(this.enemies, this.CollisionLayer);
        //Map collision debug mode
        this.debugGraphics = this.add.graphics();
 
        Mymap.renderDebug(this.debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 128), 
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) 
          });



        //Camera

        // set bounds to avoid camera goes outside the map
        this.physics.world.setBounds(0, 0, Mymap.widthInPixels, Mymap.heightInPixels);

        //camera follows the player
        this.cameras.main.startFollow(this.player);


        // Useful states to manage handlers in update function

        this.canBeAttacked = 0; //If our character can be attacked
        this.canAttack = 0; //If the enemy can be attacked

        this.player_scale = 2;
    }

    startingPosFromTowerNum(towerNumber){
        if(towerNumber === 1){
            return {x:300,y:300};
        }
        else if(towerNumber === 2){
            return {x:1000,y:300};
        }
        else if(towerNumber === 3){
            return {x:300,y:1000};
        }
        else if(towerNumber === 4){
            return {x:1000,y:1000};
        }
    }



    update(time,delta) {
        if(this.GameIsGoing === false){
            return;
        }
        console.log(this.sword_in_the_stone.healthPoints);
        this.hud.update(time,this.player,this);
      
        //console.log(this.player.mana);
     
        //Handler character getting attacked by enemy, cooldown 3s

    /*    this.physics.world.collide(this.enemies, this.player, (enemy,player)=>{
            if(this.canBeAttacked < time){
               // console.log('got hit!');
                if (enemy.active && player.active ){
                    player.takeDamage(enemy.ATK);
                    console.log(player.healthPoints);
                    this.hpbar.cutHPBar(enemy.ATK);
                }
                this.canBeAttacked = time + 3000;
            }
        },null,this);*/


        //key control
        //movement note: we should only be able to move our character when it is alive

        if(this.player.active){
            if(this.keyboard.W.isDown){
                this.player.setVelocityY(-this.player.movementSpeed);
            }
            if(this.keyboard.S.isDown){
                this.player.setVelocityY(this.player.movementSpeed);
     
            }
            if(this.keyboard.A.isDown){
                this.player.setVelocityX(-this.player.movementSpeed);

            }
            if(this.keyboard.D.isDown){
                this.player.setVelocityX(this.player.movementSpeed);
 
            }
            if (Phaser.Input.Keyboard.JustDown(this.spacebar) && this.player.mana >= 5)
            {
                this.player.attack();

                //Testing: everytime we attack, decreases some mana
                /*this.player.mana -= 2;
                this.manabar.cutManaBar(2);*/
            }

            if(this.keyboard.W.isUp && this.keyboard.S.isUp){
                this.player.setVelocityY(0);

            }
            if(this.keyboard.A.isUp && this.keyboard.D.isUp){
                this.player.setVelocityX(0);

            }

            if(this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0){
                this.player.nonZeroVelocity = {x:this.player.body.velocity.x,y:this.player.body.velocity.y}; 
                //velocity unless the actual velocity is zero then it stores previous nonzero velocity
                //Need this value to keep track of the current direction when player is standing still. Prob will chage this later to direction
            }
            //Generate player ability and skills
            /*if (Phaser.Input.Keyboard.JustDown(this.spacebar))
            {
                this.player.attack();
            }*/
            //speed up the movement 

            if(this.player.mana>= 10 && Phaser.Input.Keyboard.JustDown(this.Qbar)){
                this.player.specialAttack();
                this.manabar.cutManaBar(10);
                
            }
            if(this.player.mana< 10 && Phaser.Input.Keyboard.JustDown(this.Qbar)){
                this.manawarning.setVisible(true);            
            }
            if(this.player.mana > 10){
                this.manawarning.setVisible(false);
            }

            if(this.keyboard.SHIFT.isDown&this.keyboard.W.isDown)
            {
                this.player.setVelocityY(-(3*this.player.movementSpeed));
                this.player.mana-=0.1;
            }
            if(this.keyboard.SHIFT.isDown&this.keyboard.A.isDown)
            {
                this.player.setVelocityX(-(3*this.player.movementSpeed));
                this.player.mana-=0.1;
            }
            if(this.keyboard.SHIFT.isDown&this.keyboard.S.isDown)
            {
                this.player.setVelocityY(3*this.player.movementSpeed);
                this.player.mana-=0.1;
            }
            if(this.keyboard.SHIFT.isDown&this.keyboard.D.isDown)
            {
                this.player.setVelocityX(3*this.player.movementSpeed);
                this.player.mana-=0.1;
            }
            
            }
            if (Phaser.Input.Keyboard.JustDown(this.Rbar))
            {   
                //test on regenerate hp function
                this.hpbar.regenHPBar(10);

                if(this.player_scale === 2){
                    this.player.setScale(this.player_scale);
                    this.player_scale  --;
                }
                else{
                    this.player.setScale(this.player_scale);
                    this.player_scale  ++;
                }
            }
            // this.manabar.update(time,delta);
        }

        wonGame = ()=>{
            this.GameIsGoing = false;
            let countDownText= this.add.text(this.player.x, this.player.y, "You Won", { fontFamily: 'Arial', fontSize: 150, color: '#ffffff' });
            countDownText.setOrigin(0.5,0.5); 
        }
    
        gameOver = ()=>{
            this.GameIsGoing = false;
            let countDownText= this.add.text(this.player.x, this.player.y, "Game Over", { fontFamily: 'Arial', fontSize: 150, color: '#ffffff' });
            countDownText.setOrigin(0.5,0.5); 
        }

        towerDestroyed = ()=>{
            let countDownText= this.add.text(this.player.x, this.player.y, "Game Over", { fontFamily: 'Arial', fontSize: 150, color: '#ffffff' });
            countDownText.setOrigin(0.5,0.5); 
        }
        
    }
