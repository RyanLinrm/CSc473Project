import PlayerScene, { PlayScene } from '../PhaserGame/scenes/PlayScene';
import Phaser from 'phaser';
import { Enemy } from "../PhaserGame/gameObjects/StatusBar";
jest.mock('phaser');
jest.mock('../PhaserGame/gameObjects/Player');
jest.mock('../PhaserGame/gameObjects/Units');
const x=100;
const y=100;
const textureName="wolf";
let player = new Player(new PlayScene(),300,300, "p1", "p1_01.png",hP, movementSpeed,id);
let tower =new Units(this,0,0,100,-1,"pyramid",1,1000,4,180,200);
const target=player;
const enemyID=0;
const healthPoints=100;
const attackRate=0;
const ATK=0;
const attackRange=0;
const movementSpeed=0;
const cooldown=0;
const uid="233";

const newEnemy = new Enemy(scene,x,y,key,textureName,target,enemyID,healthPoints,attackRate,ATK,attackRange,movementSpeed,cooldown,uid);

test('Testing enemy class constructer correctly and intializes a new enemy wolf', ()=>{

    expect(newEnemy).toBeDefined();
    expect(newEnemy.x).toBe(x);
    expect(newEnemy.y).toBe(y);
    expect(newEnemy.textureName).toBe("wolf");
    expect(newEnemy.target).toBe(player);
    expect(newEnemy.enemyID).toBe(enemyID);
    expect(newEnemy.healthPoints).toBe(healthPoints);
    expect(newEnemy.attackRate).toBe(attackRate);
    expect(newEnemy.ATK).toBe(ATK);
    expect(newEnemy.attackRange).toBe(attackRange);
    expect(newEnemy.movementSpeed).toBe(movementSpeed);
    expect(newEnemy.cooldown).toBe(cooldown);
    expect(newEnemy.uid).toBe("233");
    expect(newEnemy.createAttack).toBeDefined();
    expect(newEnemy.removeDefense).toBeDefined();
    expect(newEnemy.beingAttacked).toBeDefined();
    
    
});


test('Testing the changetarget function in enemy class', ()=>{

    const newtarget =tower;

    //test wheather the current target is player 
    expect(newEnemy.target).toBe(player);

    newEnemy.changetarget(newtarget);
    let correctTarget=tower;
    //test wheather the target is changed to tower
    expect(newEnemy.target).toBe(correctTarget);
});


test('Testing if takeDamage correctly decrease the hp of enemy', ()=>{

    newEnemy.takeDamage(20);
    expect(newEnemy.healthPoints).toEqual(80);
    newEnemy.takeDamage(10);
    expect(newEnemy.healthPoints).toEqual(70);
    newEnemy.takeDamage(1);
    expect(newEnemy.healthPoints).toEqual(69);
    newEnemy.takeDamage(5);
    expect(newEnemy.healthPoints).toEqual(64);
    newEnemy.takeDamage(0);
    expect(newEnemy.healthPoints).toEqual(64);
 
});

test('Testing if takeDamage calls kill function when enemy hp is less than 0', ()=>{
 
    newEnemy.kill = jest.fn();
    newEnemy.takeDamage(105);
    expect(newEnemy.healthPoints).toEqual(-5);
    expect(newEnemy.kill).toBeCalledTimes(1);

});

test('Testing if collision funciton correctly works for enemy class', ()=>{
   
    newEnemy.takeDamage = jest.fn();
    newEnemy.collision();

    expect(newEnemy.beingAttacked).toEqual(true);
    expect(newEnemy.takeDamage).toBeCalledTimes(1);

});

test('Testing if isInjured function correctly work (changes tint and count) while being attacked', ()=>{
 
    newEnemy.beingAttacked = true;
    newEnemy.isInjured(666);

    expect(newEnemy.tint).toEqual(0xff0000);
    expect(newEnemy.count).toEqual(666);
    
});

test('Testing if isInjured function correctly work (changes tint and count) while not attacked', ()=>{

    newEnemy.count = 100
    newEnemy.beingAttacked = false;

    newEnemy.isInjured(6000);
    expect(newEnemy.tint).toEqual(0xffffff);
    
});
