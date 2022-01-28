var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound
var S1
var ducktrex

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")

  ducktrex = loadAnimation("duck1.png","duck2.png")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.addAnimation("trexduck",ducktrex);
  trex.scale = 0.5;
  S1 = new Student("Matheus",13,9)
  S1.display()
  
  ground = createSprite(width / 2,height-65,width,20);
  ground.scale = 1.5
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
   gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(width / 2,height-55,width,20);
  invisibleGround.visible = false;
  
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  
  trex.setCollider("circle",0,0,40);
  trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(180);
 
  text("Pontuação: "+ score, 500,50);
  
  
  
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    scoreSound()
    ground.velocityX = -6 - score /   2000;
    
    score = score + Math.round(getFrameRate()/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    
    if( touches.length > 0 || keyDown("space")&& trex.y >= height - 90) {
        trex.velocityY = -15;
        jumpSound.play()
        touches = []
    }
    
    if(keyWentDown("down_arrow")){
      trex.changeAnimation("trexduck")
    trex.scale = 1
    trex.setCollider("circle",0,0,15);
    }
    if(keyWentUp("down_arrow")){
      trex.changeAnimation("running")
      trex.scale = 0.5
      trex.setCollider("circle",0,0,40);
    }
    trex.velocityY = trex.velocityY + 0.8
  
    
    spawnClouds();
  
   
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play()
    }
  }
   else if (gameState === END) {
     
      gameOver.visible = true;
      restart.visible = true;
      
      ground.velocityX = 0;
      trex.velocityY = 0
      trex.changeAnimation("collided", trex_collided);
      if (mousePressedOver(restart)){
        reset()
      }
      
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
   }
  
 
  
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-80,10,40);
   obstacle.velocityX = -6 - score /   2000;
   
    
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
               
    obstacle.scale = random(0.55,0.60);
    obstacle.lifetime = width / 6;
   
   
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {

  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     
    cloud.lifetime = 234;
    
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    
   cloudsGroup.add(cloud);
    }
}

function scoreSound(){
if (score % 200 === 0 && score > 0){
  checkPointSound.play()
}
}
function reset(){
gameState = PLAY
trex.changeAnimation("running",trex_running);

score = 0;
obstaclesGroup.destroyEach()
cloudsGroup.destroyEach()
restart.visible = false
gameOver.visible = false


}
