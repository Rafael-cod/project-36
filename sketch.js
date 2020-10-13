//Create variables here
var dog, dogImg, happyDog, database, foodS, foodStock;
var feed, addFood;
var fedTime, lastFed;
var foodObj;
var gameState = 0;
var readState;
var bedroom, garden, washroom;


function preload()
{
  //load images here
  dogImg = loadImage("images/dog.png");
  happyDog = loadImage("images/Happy.png");
  bedroom = loadImage("images/Bed Room.png");
  garden = loadImage("images/Garden.png");
  washroom = loadImage("images/Wash Room.png");

}

function setup() {
  database = firebase.database();
  createCanvas(1000, 500);

  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  });
  
  foodObj = new Food();
  
  dog = createSprite(250,300,150,150);
  dog.addImage(dogImg)
  dog.scale = 0.15

  feed = createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {  
  background(46,139,87);

  //add styles here

  fedTime = database.ref("FeedTime");
  fedTime.on("value", function(data){
    lastFed = data.val();
  })

  fill(255);
  textSize(20);
  if(lastFed >= 12){
    text("Last Feed : " + lastFed % 12 + " PM", 350, 30);
  }else if(lastFed == 0){
    text("Last Feed : 12 AM",350, 30);
  }else{
    text("Last Feed : " + lastFed + " AM", 350, 30);
  }

  if(gameState != "Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }

  currentTime = hour();
  if(currentTime === (lastFed + 1)){
    update("Playing");
    foodObj.garden();
  }else if (currentTime === (lastFed + 2)){
    update("Sleeping")
    foodObj.bedroom();
  }else if(currentTime>(lastFed + 2) && currentTime<=(lastFed + 4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry");
    foodObj.display();
  }

  drawSprites();

}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock()- 1)
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

function addFoods(){
  foodS ++;
  database.ref('/').update({
  Food: foodS
  })  
}

function update(state){
  database.ref('1').update({
    gameState: state
  })
}
