
//battery last 5 steps, every step see less
//bribe(2 coins) / fight(2 steps wins) ghost -> coin or battery (rare drop)


const FULL = 5;
const LOW = 2;

const UP = 38;
const DOWN = 40;
const RIGHT = 39;
const LEFT = 37;

const BRIBE = 66;
const FIGHT = 70;

const FLOOR = 0;
const GHOST = 1;
const OPENED_CHEST = 2;
const CLOSED_CHEST = 3;
const BATTERY = 4;
const EXIT = 5;
const COIN_ONE = 6;
const COIN_STACK = 7;

const FLASHLIGHT = 9;
const FLASHLIGHT_SHINE = 10;
var additionalMsg = "";
const SIZE = 64;
var GAME_OVER=0;
var BATTLE = -1;
var map=[
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0],
];

var ghosts = [];

const ghostObj = {
	row:0,
	column:0,
	power:1,
	gold:0
};

var player = {
	row:0,
	column:0,
	power:2,
	gold:0,
	battery:FULL,
	current:FLOOR
};

var stage = document.querySelector("#map");
var output = document.querySelector("#output");
const ROWS = map.length;
const COLUMNS = map[0].length;

/*
Update the player icon based on the status
Update the message based on th inventory
*/
function renderWonderers(){
	
	if(player.battery>LOW){
		map[player.row][player.column] = FLASHLIGHT_SHINE;
	}
	else{
		map[player.row][player.column] = FLASHLIGHT;
	}
	output.innerHTML = `Player has ${player.gold} gold. The battery is at level ${player.battery}`;
	if(player.battery==FULL){
		output.innerHTML+= " (FULL).";
	}
	else if(player.battery==LOW){
		output.innerHTML+= " (LOW).";
	}
	else{
		output.innerHTML+=".";
	}
	output.innerHTML+=additionalMsg;
	additionalMsg="";
}
/*
Render the elements in the game
*/
function render(){
	//if the game ends, player dies or escapes, ends the game
	if(GAME_OVER>0){
		endAnimation(GAME_OVER);
	}
	
	if(stage.hasChildNodes()){
		for(let i = 0;i<ROWS*COLUMNS;i++){
			stage.removeChild(stage.firstChild);
		}
	}
	renderWonderers();
	
	for(let row=0;row<ROWS;row++){
		for(let column=0;column<COLUMNS;column++){
			let cell = document.createElement("img");
			cell.setAttribute("class","cell");
			stage.appendChild(cell);
			
			switch(map[row][column]){
				case FLOOR:
					cell.src=`images/cell.png`;
					break;
				case GHOST:
					cell.src=`images/ghost.png`;
					break;
				case OPENED_CHEST:
					cell.src=`images/treasure_open.png`;
					break;
				case CLOSED_CHEST:
					cell.src=`images/treasure_closed.png`;
					break;
				case BATTERY:
					cell.src=`images/battery.png`;
					break;
				case COIN_ONE:
					cell.src=`images/coin_one.png`;
					break;
				case COIN_STACK:
					cell.src=`images/coin_stack.png`;
					break;
				case EXIT:
					cell.src=`images/exit.png`;
					break;
				case FLASHLIGHT:
					cell.src = `images/flashlight.png`;
					break;
				case FLASHLIGHT_SHINE:
					cell.src = `images/flashlight_shine.png`;
					break;
			}
			cell.style.top = row*SIZE+"px";
			cell.style.left = column*SIZE+"px";
			
		}
	}
	
}

/*
The start button that starts the game
*/
function displayMap(){
	
	document.querySelector("#start_screen").style.display="none";
	document.querySelector("#stage").style.display="block";
	stageAnime();
	init();
	render();
}
/*
Initialize the positions and objects of the map
*/
function init(){
	init_player();
	init_items();
	init_ghosts();
	window.addEventListener("keydown",keydownHandler,false);
}
/*
Initialize the player and the exit one in each cornor diagonally
*/
function init_player(){
	
	let corner = Math.floor(Math.random()*4),
	corner_row = Math.floor(Math.random()*2),
	corner_column = Math.floor(Math.random()*2),
	exit_row = Math.floor(Math.random()*2),
	exit_column = Math.floor(Math.random()*2);
	if(corner==1){
		player.row = corner_row;
		player.column = corner_column;
		map[exit_row+6][exit_column+6]=EXIT;
	}else if(corner==2){
		player.row = corner_row;
		player.column = corner_column+6;
		map[exit_row+6][exit_column]=EXIT;
	}else if(corner==3){
		player.row = corner_row+6;
		player.column = corner_column;
		map[exit_row][exit_column+6]=EXIT;
	}else{
		player.row = corner_row+6;
		player.column = corner_column+6;
		map[exit_row][exit_column]=EXIT;
	}
}

/*2 betterys, one in each half of themap
2 chests, one in each half of the map
4 coins one in each corner of the map (of 4 tiles)
2 stack coins one in each half of the map
*/

function init_items(){
	
	let coin1x = Math.floor(Math.random()*4),
	coin1y = Math.floor(Math.random()*4);
	while(map[coin1x][coin1y]!=COIN_ONE){
		coin1x = Math.floor(Math.random()*4);
		coin1y = Math.floor(Math.random()*4);
		if(map[coin1x][coin1y]==FLOOR)
			map[coin1x][coin1y]=COIN_ONE;
	}
	
	let coin2x = Math.floor(Math.random()*4),
	coin2y = Math.floor(Math.random()*4)+4;
	while(map[coin2x][coin2y]!=COIN_ONE){
		coin2x = Math.floor(Math.random()*4);
		coin2y = Math.floor(Math.random()*4)+4;
		if(map[coin2x][coin2y]==FLOOR)
			map[coin2x][coin2y]=COIN_ONE;
	}
	
	let coin3x = Math.floor(Math.random()*4)+4,
	coin3y = Math.floor(Math.random()*4);
	while(map[coin3x][coin3y]!=COIN_ONE){
		coin3x = Math.floor(Math.random()*4)+4;
		coin3y = Math.floor(Math.random()*4);
		if(map[coin3x][coin3y]==FLOOR)
			map[coin3x][coin3y]=COIN_ONE;
	}
	let coin4x = Math.floor(Math.random()*4)+4,
	coin4y = Math.floor(Math.random()*4)+4;
	while(map[coin4x][coin4y]!=COIN_ONE){
		coin4x = Math.floor(Math.random()*4)+4;
		coin4y = Math.floor(Math.random()*4)+4;
		if(map[coin4x][coin4y]==FLOOR)
			map[coin4x][coin4y]=COIN_ONE;
	}
	
	let coin_stack1x = Math.floor(Math.random()*7),
	coin_stack1y = Math.floor(Math.random()*4);
	while(map[coin_stack1x][coin_stack1y]!=COIN_STACK){
		coin_stack1x = Math.floor(Math.random()*7);
		coin_stack1y = Math.floor(Math.random()*4);
		if(map[coin_stack1x][coin_stack1y]==FLOOR)
			map[coin_stack1x][coin_stack1y]=COIN_STACK;
	}
	
	let coin_stack2x = Math.floor(Math.random()*7),
	coin_stack2y = Math.floor(Math.random()*4)+4;
	while(map[coin_stack2x][coin_stack2y]!=COIN_STACK){
		coin_stack2x = Math.floor(Math.random()*7);
		coin_stack2y = Math.floor(Math.random()*4)+4;
		if(map[coin_stack2x][coin_stack2y]==FLOOR)
			map[coin_stack2x][coin_stack2y]=COIN_STACK;
	}	
	let chest1x = Math.floor(Math.random()*7),
	chest1y = Math.floor(Math.random()*4);
	while(map[chest1x][chest1y]!=CLOSED_CHEST){
		chest1x = Math.floor(Math.random()*7);
		chest1y = Math.floor(Math.random()*4);
		if(map[chest1x][chest1y]==FLOOR)
			map[chest1x][chest1y]=CLOSED_CHEST;
	}
	let chest2x = Math.floor(Math.random()*7),
	chest2y = Math.floor(Math.random()*4)+4;
	while(map[chest2x][chest2y]!=CLOSED_CHEST){
		chest2x = Math.floor(Math.random()*7);
		chest2y = Math.floor(Math.random()*4)+4;
		if(map[chest2x][chest2y]==FLOOR)
			map[chest2x][chest2y]=CLOSED_CHEST;
	}
	
	
	let battery1x = Math.floor(Math.random()*7),
	battery1y = Math.floor(Math.random()*4);
	while(map[battery1x][battery1y]!=BATTERY){
		battery1x = Math.floor(Math.random()*7);
		battery1y = Math.floor(Math.random()*4)+4;
		if(map[battery1x][battery1y]==FLOOR)
			map[battery1x][battery1y]=BATTERY;
	}	
	let battery2x = Math.floor(Math.random()*7),
	battery2y = Math.floor(Math.random()*4);
	while(map[battery2x][battery2y]!=BATTERY){
		battery2x = Math.floor(Math.random()*7);
		battery2y = Math.floor(Math.random()*4);
		if(map[battery2x][battery2y]==FLOOR)
			map[battery2x][battery2y]=BATTERY;
	}
	
}

/*initialize five ghosts
	one in each corner of the map (of 4 tiles)
	one in the middle of the 4 tiles
*/
function init_ghosts(){
	
	let ghost1 = Object.create(ghostObj),
	ghost1x = Math.floor(Math.random()*4),
	ghost1y = Math.floor(Math.random()*4);
	while(map[ghost1x][ghost1y]!=GHOST){
		ghost1x = Math.floor(Math.random()*4);
		ghost1y = Math.floor(Math.random()*4);
		if(map[ghost1x][ghost1y]==FLOOR){
			ghost1.row = ghost1x;
			ghost1.column = ghost1y;
			ghosts.push(ghost1);
			break;
		}
	}
	
	let ghost2x = Math.floor(Math.random()*4),
	ghost2y = Math.floor(Math.random()*4)+4,
	ghost2 = Object.create(ghostObj);
	while(map[ghost2x][ghost2y]!=GHOST){
		ghost2x = Math.floor(Math.random()*4);
		ghost2y = Math.floor(Math.random()*4)+4;
		if(map[ghost2x][ghost2y]==FLOOR){
			ghost2.row = ghost2x;
			ghost2.column = ghost2y;
			ghosts.push(ghost2);
			break;
		}
	}
	
	let ghost3x = Math.floor(Math.random()*4)+4,
	ghost3y = Math.floor(Math.random()*4),
	ghost3 = Object.create(ghostObj);
	while(map[ghost3x][ghost3y]!=GHOST){
		ghost3x = Math.floor(Math.random()*4)+4;
		ghost3y = Math.floor(Math.random()*4);
		if(map[ghost3x][ghost3y]==FLOOR){
			ghost3.row = ghost3x;
			ghost3.column = ghost3y;
			ghosts.push(ghost3);
			break;
		}
	}
	let ghost4x = Math.floor(Math.random()*4)+4,
	ghost4y = Math.floor(Math.random()*4)+4,
	ghost4 = Object.create(ghostObj);
	while(map[ghost4x][ghost4y]!=GHOST){
		ghost4x = Math.floor(Math.random()*4)+4;
		ghost4y = Math.floor(Math.random()*4)+4;
		if(map[ghost4x][ghost4y]==FLOOR){
			ghost4.row = ghost4x;
			ghost4.column = ghost4y;
			ghosts.push(ghost4);
			break;
		}
	}
	let ghost5x = Math.floor(Math.random()*4)+2,
	ghost5y = Math.floor(Math.random()*4)+2,
	ghost5 = Object.create(ghostObj);
	while(map[ghost5x][ghost5y]!=GHOST){
		ghost5x = Math.floor(Math.random()*4)+2;
		ghost5y = Math.floor(Math.random()*4)+2;
		if(map[ghost5x][ghost5y]==FLOOR){
			ghost5.row = ghost5x;
			ghost5.column = ghost5y;
			ghosts.push(ghost5);
			break;
		}
	}
		for(let i=0;i<ghosts.length;i++){
		map[ghosts[i].row][ghosts[i].column] = GHOST;
	}
}

/*
The ghosts can collect coins, and they can move around but they cannot
collect batteries and open chests.
*/
function moveGhosts(){
	for(let i=0;i<ghosts.length;i++){
		let choices = [];

		if(ghosts[i].row>0 && (map[ghosts[i].row-1][ghosts[i].column]==FLOOR || map[ghosts[i].row-1][ghosts[i].column]==COIN_ONE ||
			 map[ghosts[i].row-1][ghosts[i].column]==COIN_STACK ||map[ghosts[i].row-1][ghosts[i].column]==FLASHLIGHT
			 ||map[ghosts[i].row-1][ghosts[i].column]==FLASHLIGHT_SHINE)){
			choices.push(0);
		}
		if(ghosts[i].row<(ROWS-1) && (map[ghosts[i].row+1][ghosts[i].column]==FLOOR || map[ghosts[i].row+1][ghosts[i].column]==COIN_ONE ||
			 map[ghosts[i].row+1][ghosts[i].column]==COIN_STACK ||map[ghosts[i].row+1][ghosts[i].column]==FLASHLIGHT
			 ||map[ghosts[i].row+1][ghosts[i].column]==FLASHLIGHT_SHINE)){
			choices.push(1);
		}
		if(ghosts[i].column<(COLUMNS-1) && (map[ghosts[i].row][ghosts[i].column+1]==FLOOR || map[ghosts[i].row][ghosts[i].column+1]==COIN_ONE ||
			 map[ghosts[i].row][ghosts[i].column+1]==COIN_STACK ||map[ghosts[i].row][ghosts[i].column+1]==FLASHLIGHT
			 ||map[ghosts[i].row][ghosts[i].column+1]==FLASHLIGHT_SHINE)){
			choices.push(2);
		}
		if(ghosts[i].column>0 && (map[ghosts[i].row][ghosts[i].column-1]==FLOOR || map[ghosts[i].row][ghosts[i].column-1]==COIN_ONE ||
			 map[ghosts[i].row][ghosts[i].column-1]==COIN_STACK ||map[ghosts[i].row][ghosts[i].column-1]==FLASHLIGHT
			 ||map[ghosts[i].row][ghosts[i].column-1]==FLASHLIGHT_SHINE)){
			choices.push(3);
		}
		//what if the ghost got trapped?
		//choice.length==0
		map[ghosts[i].row][ghosts[i].column] = FLOOR;
		let index  = Math.floor(Math.random()*choices.length);
		if(choices[index]==0){
			ghosts[i].row-=1;
		}
		if(choices[index]==1){
			ghosts[i].row+=1;
		}
		if(choices[index]==2){
			ghosts[i].column+=1;
		}
		if(choices[index]==3){
			ghosts[i].column-=1;
		}

		if(map[ghosts[i].row][ghosts[i].column]==COIN_ONE){
			ghosts[i].gold+=1;
		}
		if(map[ghosts[i].row][ghosts[i].column]==COIN_STACK){
			let amount  = Math.floor(Math.random()*3)+2;
			ghosts[i].gold+=amount;
		}
		//if encounter the player, notify the player
		if(ghosts[i].row==player.row&&ghosts[i].column==player.column){
			BATTLE = i;
			if(player.gold>1){
				additionalMsg="Press (b) to bribe the ghost. Press (f) to fight it."
			}
			else{
				additionalMsg+="You have to fight with the ghost. Press (f) to fight."
			}

		}
		map[ghosts[i].row][ghosts[i].column] = GHOST;
	}
	
}
/*
Player movements and the result of the move
*/
function playerMove(event){
	let moving = false;
	switch(event.keyCode){
		case UP:
			map[player.row][player.column] = player.current;
			moving=true;
			if(player.row>0){
				player.row-=1;
			}
			break;
		case DOWN:
			map[player.row][player.column] = player.current;
			moving=true;
			if(player.row<ROWS-1){
				player.row+=1;
			}
			break;
		case LEFT:
			map[player.row][player.column] = player.current;
			moving=true;
			if(player.column>0){
				player.column-=1;
			}
			break;
		case RIGHT:
			map[player.row][player.column] = player.current;
			moving=true;
			if(player.column<COLUMNS-1){
				player.column+=1;
			}
			break;
	}
	if(moving){
		if(player.battery>LOW){
			player.battery-=1;
		}
		//there is a chance of everything you can get in the chest
		if(map[player.row][player.column]==CLOSED_CHEST){
			let chance = Math.floor(Math.random()*5);
			if(chance==0){
				player.battery=FULL;
			}
			else if(chance<3){
				let amount  = Math.floor(Math.random()*3)+2;
				player.gold+=amount;
			}
			else{
				player.gold+=1;
			}
			player.current = OPENED_CHEST;
		}else{
			if(map[player.row][player.column]==COIN_ONE){
				player.gold+=1;
			}
			else if(map[player.row][player.column]==COIN_STACK){
				//amount of stack of coins can be in range of 2-4
				let amount  = Math.floor(Math.random()*3)+2;
				player.gold+=amount;
			}
			else if(map[player.row][player.column]==BATTERY){
				player.battery=FULL;
			}
			else if(map[player.row][player.column]==EXIT){
				GAME_OVER=2;
			}
			player.current = FLOOR;
		}

		moveGhosts();
	}
}
/*
This handles the triger of player movement and 
the battles between the ghosts and player.
*/
function keydownHandler(event){
	if(GAME_OVER==0){
		if(BATTLE==-1){
			playerMove(event);
		}
		else{
			switch(event.keyCode){
				case BRIBE:
					player.battery-=1;
					if(player.gold==2){
						additionalMsg="The ghost took all your gold and left.";
						player.gold = 0;
					}
					else{
						//bribe the ghost with a random amount of your gold
						let amount  = Math.floor(Math.random()*(player.gold-1))+2;
						additionalMsg="The ghost took "+amount+" gold and left.";
						player.gold -= amount;
						ghosts[BATTLE].gold+=amount;
					}
					BATTLE=-1;
					break;
					
				case FIGHT:
					player.battery-=1;
					console.log("The ghost will play Rock–paper–scissors with you.");
					let chance  = Math.floor(Math.random()*3);
					if(chance==0){
						additionalMsg="Your lost and your life is taken.";
						GAME_OVER=1;
					}
					else if(chance==1){
						additionalMsg="You tied. The ghost took all your gold and left.";
						ghosts[BATTLE].gold+=player.gold;
						player.gold = 0;
					}
					else{
						additionalMsg="You win. The ghost left you with all its gold";
						player.gold += ghosts[BATTLE].gold;
					}
					BATTLE=-1;
					break;
			}
			if(player.battery==0){
				additionalMsg="Your battery died completely and your life is taken.";
				GAME_OVER=1;
			}
		}
		render();
	}
}

