
var game_running=0;
var screen_width=1920;var screen_height=960;
var canvas = document.getElementById("cv");
var ctx = canvas.getContext("2d");
var hidden_ctx = hidden_cv.getContext("2d");

var water_level;
var gravity_speed=8;
var bg_speed=6;
var enemies_speed=9;
var ghost_vertical_speed=2;
var laser_speed=12;
var kills=0;
var duck_horizontal_speed=10;
var meteor_vertical_speed=6;
var meteor_horizontal_speed=10;
var duck={};

var jetpack_flying_time=3;//3 sec
var jetpack_reload_time=5;//from 0 to max

var enemies=[];
var gameparts=[];
var upper_backgrounds=[];
var lower_backgrounds=[];
var lasers=[];

var intervalls=[];

var racoon={};

var hitbox_test_mod=false;
var unkillable=false;

duck.hitbox=[
			[{'x':296,'y':74},{'x':543, 'y':349}],//első a bal fenti, második a jobb lenti
			[{'x':37,'y':350},{'x':554, 'y':497}],
			[{'x':0,'y':313},{'x':110, 'y':423}],
			[{'x':74,'y':498},{'x':517, 'y':571}],
			[{'x':111,'y':572},{'x':480, 'y':608}],
			[{'x':185,'y':609},{'x':406, 'y':645}]
		];
duck.size=0.1;
duck.skins=["character/duck.png","character/duck2.png"];


var enemy_parameters={};



var mouse_x;
var mouse_y;
window.onmousemove=function(event){
	mouse_x=event.clientX;
	mouse_y=event.clientY;
}

function screenSizing(selected_option){
	console.log(selected_option)
	let w = selected_option.split('x')[0]*1;
	let h = selected_option.split('x')[1]*1;
	console.log(w)
	screen_width=w;
	screen_height=h;
	start_screen.style.width=w+'px';
	start_screen.style.height=h+'px';
	console.log(screen_width+'px')
	cv.setAttribute('width',screen_width+'px');
	cv.setAttribute('height',screen_height+'px');
	start_screen.style.display='default';
	start_screen.style.backgroundImage="url('ui/start_screen.png')";
	
	//console.log(start_screen.getBoundingClientRect().right)
	scores.style.right=body.getBoundingClientRect().width-start_screen.getBoundingClientRect().right+30+'px';
}

function startgame(){
	music.currentTime = 0;
	music.play();
	//console.log(enemy_parameters.tree.hitbox[0][0].x);
	if(game_running==1) return;
	clear_screen();
	game_running=1;pause=false;
	start_screen.style.display='none';
	kill_counter.style.display='block';
	highscore_dv.style.display='block';
	hp_counter.style.display='block';
	ammo_counter.style.display='block';
	distance_dv.style.display='block';
	jp_meter_img.style.display='none';
	
	enemies=[];
	gameparts=[];
	upper_backgrounds=[];
	lower_backgrounds=[];
	lasers=[];
	intervalls=[];
	hp_counter.src="character/life_3.png";
	kill_counter.innerHTML=kill_counter.innerHTML.split(':')[0]+': 0';
	highscore=0;distance=0;kills=0;
	
	water_level = 0.8*cv.height;
	
	let upper_bg={};
	upper_bg.x=0;
	upper_bg.y=0;
	upper_bg.width=upper_bg_img.width;
	upper_bg.height=screen_height-(screen_height-water_level);
	upper_bg.pic=upper_bg_img;
	upper_backgrounds.push(upper_bg);
	
	
	let upper_bg2={};
	upper_bg2.x=upper_bg_img.width;
	upper_bg2.y=0;
	upper_bg2.width=upper_bg_img.width;
	upper_bg2.height=screen_height-(screen_height-water_level);
	upper_bg2.pic=upper_bg_img;
	upper_backgrounds.push(upper_bg2);
	
	let lower_bg={};
	lower_bg.x=0;
	lower_bg.y=water_level;
	lower_bg.width=lower_bg_img.width;
	lower_bg.height=screen_height-water_level;
	lower_bg.pic=lower_bg_img;
	lower_backgrounds.push(lower_bg);
	
	let lower_bg2={};
	lower_bg2.x=0;
	lower_bg2.y=water_level;
	lower_bg2.width=lower_bg_img.width;
	lower_bg2.height=screen_height-water_level;
	lower_bg2.pic=lower_bg_img;
	lower_backgrounds.push(lower_bg2);
	
	
	duck.x=screen_width*0.05;
	duck.y=water_level-duck_img.height*0.1;
	duck.width=duck_img.width*0.1;
	duck.height=duck_img.height*0.1;
	duck.lives=3;
	duck.pic=duck_img;
	duck.pic.src=duck.skins[0];
	duck.current_skin=0;
	duck.jetpack_max=jetpack_flying_time*1000/16;
	duck.jetpack=duck.jetpack_max;
	duck.jetpack_reload_per_frame=duck.jetpack_max/(jetpack_reload_time*1000/16);
	gameparts.push(duck);
	
	
	racoon.board={};
	racoon.board.name='racoon_board';
	racoon.board.x=screen_width-enemy_parameters.racoon_board.width;
	racoon.board.y=water_level-210;
	racoon.board.width=enemy_parameters.racoon_board.width;
	racoon.board.height=enemy_parameters.racoon_board.height;
	racoon.board.pic=racoon_board_img;
	gameparts.push(racoon.board);
	
	
	racoon.name='racoon';
	racoon.x=screen_width-enemy_parameters.racoon.width;
	racoon.y=water_level-enemy_parameters.racoon.height-200;
	racoon.width=enemy_parameters.racoon.width;
	racoon.height=enemy_parameters.racoon.height;
	racoon.current_skin=1;
	racoon.pic=racoon_img;
	gameparts.push(racoon);
	
	
	racoon.flame1={};
	racoon.flame1.pic=racoon_board_flames_img;
	racoon.flame1.current_skin=1;
	racoon.flame1.x=racoon.board.x+21;
	racoon.flame1.y=racoon.board.y+racoon.board.height;
	racoon.flame1.width=racoon_board_flames_img.width*0.3;
	racoon.flame1.height=racoon_board_flames_img.height*0.3;
	gameparts.push(racoon.flame1);
	
	racoon.flame2={};
	racoon.flame2.current_skin=1;
	racoon.flame2.pic=racoon_board_flames_img;
	racoon.flame2.x=racoon.board.x+81;
	racoon.flame2.y=racoon.board.y+racoon.board.height;
	racoon.flame2.width=racoon_board_flames_img.width*0.3;
	racoon.flame2.height=racoon_board_flames_img.height*0.3;
	gameparts.push(racoon.flame2);
	
	var flame_animation=setInterval(()=>{
		racoon.flame1.current_skin++;
		if(racoon.flame1.current_skin==7) racoon.flame1.pic.src=racoon.flame1.pic.src.replace(racoon.flame1.current_skin-1,racoon.flame1.current_skin=1);
		else racoon.flame1.pic.src=racoon.flame1.pic.src.replace(racoon.flame1.current_skin-1,racoon.flame1.current_skin);
		
		
		racoon.flame2.current_skin++;
		if(racoon.flame2.current_skin==7) racoon.flame2.pic.src=racoon.flame2.pic.src.replace(racoon.flame2.current_skin-1,racoon.flame2.current_skin=1);
		else racoon.flame2.pic.src=racoon.flame2.pic.src.replace(racoon.flame2.current_skin-1,racoon.flame2.current_skin);
		
		
		
	},100); intervalls.push(flame_animation);
	
	//console.log(gravity_speed);
	
	var grav = setInterval(()=>{ //gravity
		if(pause) return;
		if(!no_grav && !isjetpacking){
			//console.log('gravity');
			if(duck.y==water_level-duck.height){
				if(duck.jetpack<duck.jetpack_max) {
					duck.jetpack+=duck.jetpack_reload_per_frame; //console.log(duck.jetpack);
					jp_meter_img.src="ui/jp_animation/Meter"+Math.max(15-Math.round(duck.jetpack/(duck.jetpack_max/15)),1)+".png";
					if(duck.jetpack>=duck.jetpack_max) jp_meter_img.style.display='none';
				}
			}
			else if(duck.y>water_level-duck.height){
				move(duck,duck.x,water_level-duck.height);
			}
			else move(duck, duck.x,duck.y+gravity_speed);
		}
		//console.log(get_random(0,2));
		//console.log(enemies.length);
		if(hitbox_test_mod) move(duck,mouse_x,mouse_y);
		
		for(let el of enemies) {
			//if(el.name=='racoon') continue;
			if(el.x+enemy_parameters[el.name].width<-300 || el.x>screen_width+300 || el.y+enemy_parameters[el.name].height<-300 || el.y>screen_height+300)
			{
				enemies.splice(enemies.indexOf(el),1);
			}
			
			if(el.name=='tree' || el.name=='ground_spike') move(el,el.x-bg_speed,el.y);
			else if(el.name=='meteor') move(el,el.x-meteor_horizontal_speed,el.y+meteor_vertical_speed);
			else if(el.name!='spike') move(el,el.x-enemies_speed,el.y);
			
			if(el.name=='ghost') {
				if(el.direction=='up') {
					move(el,el.x,el.y-ghost_vertical_speed);
					if(el.y<=el.y_top) el.direction='down';
				}
				else {
					move(el,el.x,el.y+ghost_vertical_speed);
					if(el.y>=el.y_bottom) el.direction='up';
				}
			}
			if(el.name=='bird') {
				if(el.direction=='up') {
					move(el,el.x,el.y-el.speed/2);
					if(el.y<=0) el.direction='down';
				}
				else {
					move(el,el.x,el.y+el.speed/2);
					if(el.y>=screen_height*0.6-enemy_parameters.bird.height) el.direction='up';
				}
			}
			if(el.name=='spike') {
				if(el.y<el.target_y)
				{
					move(el,el.x-el.move_by_x,el.y-el.move_by_y);
				}
				else move(el,el.x-enemies_speed,el.y);
				
				//console.log(alpha);
			}
			
			if(enemy_parameters[el.name].hitbox){
				for(let hitbox of enemy_parameters[el.name].hitbox)
				{
					let was_a_hit=false;
					for(duck_hitbox of duck.hitbox)
					{
						if(!(el.x+hitbox[1].x<duck.x+duck_hitbox[0].x || el.y+hitbox[1].y<duck.y+duck_hitbox[0].y || el.x+hitbox[0].x>duck.x+duck_hitbox[1].x || el.y+hitbox[0].y>duck.y+duck_hitbox[1].y)) {
							if(duck.lives>1) {
								if(!unkillable) duck.lives--;		
								hp_counter.src="character/life_"+duck.lives+'.png';
								enemies.splice(enemies.indexOf(el),1);
								was_a_hit=true;
								break;
							}
							else{
								duck.lives=0;
								pause=true;
								for(interval of intervalls) clearInterval(interval);
								game_running=0;
								kill_counter.style.display='none';
								highscore_dv.style.display='none';
								distance_dv.style.display='none';
								hp_counter.style.display='none';
								ammo_counter.style.display='none';
								start_screen.style.backgroundImage='none';
								start_screen.style.display='flex';
								was_a_hit=true;
								break;
							}
						}					
					}
					if(was_a_hit) break;
				}
			}
			else
			{
				if(!(el.x+enemy_parameters[el.name].width<duck.x || el.y+  enemy_parameters[el.name].height<duck.y || el.x>duck.x+duck.width || el.y>duck.y+duck.height)) {
					if(duck.lives>1) {
						if(!unkillable) duck.lives--;
						hp_counter.src="character/life_"+duck.lives+'.png';
						enemies.splice(enemies.indexOf(el),1);
					}
					else{
						duck.lives=0;//ilyenkor a pause nem lesz 1-es ha az egér belép megint a játékba
						pause=true;
						for(interval of intervalls) clearInterval(interval);
						game_running=0;
						kill_counter.style.display='none';
						highscore_dv.style.display='none';
						distance_dv.style.display='none';
						hp_counter.style.display='none';
						start_screen.style.backgroundImage='none';
						start_screen.style.display='flex';
						music.pause();
					}
				}
			}
		}
		if(enemies.length!=0 && enemies[0].x+enemies[0].width<0) {
			enemies.shift();
		}
		
		
		move(upper_backgrounds[0], upper_backgrounds[0].x-bg_speed,upper_backgrounds[0].y);
		move(upper_backgrounds[1], upper_backgrounds[1].x-bg_speed,upper_backgrounds[1].y);
		
		if(upper_backgrounds[1].x+upper_backgrounds[1].width<screen_width){
			let asd = upper_backgrounds.shift();
			upper_backgrounds.push(asd);
			upper_backgrounds[1].x=upper_backgrounds[0].x+upper_backgrounds[0].width;
		}
		
		move(lower_backgrounds[0], lower_backgrounds[0].x-bg_speed,lower_backgrounds[0].y);
		move(lower_backgrounds[1], lower_backgrounds[1].x-bg_speed,lower_backgrounds[1].y);
		
		if(lower_backgrounds[1].x+lower_backgrounds[1].width<screen_width){
			let asd = lower_backgrounds.shift();
			lower_backgrounds.push(asd);
			lower_backgrounds[1].x=lower_backgrounds[0].x+lower_backgrounds[0].width;
		}
		
		for(let laser of lasers) {
			move(laser,laser.x+laser_speed,laser.y);
			for(let enemy of enemies){
				if(enemy.name=='spike' || enemy.name=='meteor' || enemy.name=='ground_spike') continue;
				
				if(!(laser.x+laser.width<enemy.x || laser.y+laser.height<enemy.y || laser.x>enemy.x+enemy_parameters[enemy.name].width || laser.y>enemy.y+enemy_parameters[enemy.name].height))
				{
					if(enemy.lives) {
						enemy.lives=enemy.lives-1;
						enemy.pic=enemy_parameters[enemy.name].skins[2-enemy.lives];
						lasers.splice(lasers.indexOf(laser),1);
						continue;
					}
					lasers.splice(lasers.indexOf(laser),1);
					enemies.splice(enemies.indexOf(enemy),1);
					kill_update(enemy.name);
				}
			}
		}
		if(lasers.length!=0 && lasers[0].x>screen_width) lasers.shift();
		
		if(is_right_pressed && !is_left_pressed && duck.x+duck.width<1920){
			move(duck,duck.x+duck_horizontal_speed,duck.y);
		}
		else if(is_left_pressed && !is_right_pressed && duck.x>0){
			move(duck,duck.x-duck_horizontal_speed,duck.y);
		}
		if(isjetpacking && duck.jetpack>0){
			move(duck,duck.x,duck.y-2);
			duck.pic.src=duck.skins[1-duck.current_skin];
			duck.current_skin=1-duck.current_skin;
			duck.jetpack--;
			jp_meter_img.src="ui/jp_animation/Meter"+Math.max(15-Math.round(duck.jetpack/(duck.jetpack_max/15)),1)+".png";
			if(duck.jetpack<=0){
				isjetpacking=false;
			}
		}
		
		jp_meter_img.style.left=duck.x-10+'px';
		jp_meter_img.style.top=duck.y-60+'px';
		
		refresh();
		
		if(is_squish_pressed && issquishing!=1 && duck.y==water_level-duck.height){
			squish_down(); //console.log('asd2');
		}
		
		ammo_counter.src='character/ammo_'+(5-lasers.length)+'.png';
		
	},16); intervalls.push(grav);
	
	
	//adding one spike every 1 sec
	var spike_spawn = setInterval(()=>{
		if(pause || waiting_for_spike) return;
		waiting_for_spike=true;
		setTimeout(()=>{			
			if(pause) {waiting_for_spike=false;
			return;}
			pattern_1();
		},get_random(1000,3000));
		
	},500); intervalls.push(spike_spawn);

	
	var tree_spawn = setInterval(()=>{
		if(pause || waiting_for_tree) return;
		waiting_for_tree=true;
		setTimeout(()=>{
			waiting_for_tree=false;
			if(pause) return;
			let tree = {};			
			tree.y = water_level-enemy_parameters.tree.height;
			tree.x = screen_width;
			tree.lives=2;
			tree.pic=enemy_tree_img;
			tree.name='tree';
			enemies.push(tree);			
		},Math.floor(Math.random() * 1000) + 2000);
	},500); intervalls.push(tree_spawn);
	
	var ghost_spawn = setInterval(()=>{
		if(pause || waiting_for_ghost) return;
		waiting_for_ghost=true;
		setTimeout(()=>{
			waiting_for_ghost=false;
			if(pause) return;
			let ghost = {};
			ghost.name='ghost';
			ghost.y = get_random(water_level-enemy_parameters.ghost.height-100,water_level-enemy_parameters.ghost.height); //bottom point of the levitation, it starts here
			ghost.y_top =  get_random(water_level-enemy_parameters.ghost.height-200,water_level-enemy_parameters.ghost.height-150);
			ghost.y_bottom = ghost.y;
			ghost.direction='up';
			ghost.x = screen_width+enemy_parameters.ghost.width;
			ghost.pic=enemy_ghost_img;
			enemies.push(ghost);	
		},Math.floor(Math.random() * 1000) + 2000);
	},500); intervalls.push(ghost_spawn);

	var meteor_spawn = setInterval(()=>{
		if(pause || waiting_for_meteor) return;
		waiting_for_meteor=true;
		setTimeout(()=>{
			waiting_for_meteor=false;
			if(pause) return;
			let meteor = {};
			meteor.name='meteor';
			meteor.y = -enemy_parameters.meteor.height; //bottom point of the levitation, it starts here
			meteor.x = get_random(1920/3*2,1920+enemy_parameters.meteor.width+100);
			var img = document.createElement("img");
			img.src='enemies/meteor/'+enemy_parameters.meteor.skins[get_random(0,3)]+'0.png';
			meteor.pic=img;
			enemies.push(meteor);
		},get_random(3000,8000));
	},500); intervalls.push(meteor_spawn);
	
	var meteor_animation = setInterval(()=>{
		if(pause) return;
		for(el of enemies)
		{
			if(el.name=='meteor')
			{
				let current_img = el.pic.src.split('.')[el.pic.src.split('.').length-2];
				if(current_img[current_img.length-1]*1==7) el.pic.src=el.pic.src.replace(current_img[current_img.length-1],'0');
				else el.pic.src=el.pic.src.replace(current_img[current_img.length-1],(current_img[current_img.length-1]*1+1)+'');
			}
		}
	},50); intervalls.push(meteor_animation);
	
	var g_spike_spawn = setInterval(()=>{
		if(pause || waiting_for_gspike) return;
		waiting_for_gspike=true;
		setTimeout(()=>{
			waiting_for_gspike=false;
			if(pause) return;
			let gspike = {};
			gspike.name='ground_spike';
			gspike.y = water_level-enemy_parameters.ground_spike.height;
			gspike.x = screen_width+enemy_parameters.ground_spike.width;
			gspike.pic=ground_spike_img;
			enemies.push(gspike);				
		},get_random(3000,4000));
	},500); intervalls.push(g_spike_spawn);
	
	var bird_spawn = setInterval(()=>{
		if(pause || waiting_for_bird) return;
		waiting_for_bird=true;
		setTimeout(()=>{
			waiting_for_bird=false;
			if(pause) return;
			let bird = {};
			bird.name='bird';
			bird.y = get_random(0,screen_height*0.6);
			bird.x = screen_width;
			bird.direction=get_random(0,101)<50?'up':'down';
			//console.log('starting_direction: '+bird.direction);
			bird.pic=new Image();
			bird.pic.src='enemies/bird/'+enemy_parameters.bird.skins[get_random(0,5)]+'1.png';
			bird.speed=get_random(enemy_parameters.bird.min_speed,enemy_parameters.bird.min_speed+1);
			bird.current_skin=1;
			enemies.push(bird);
		},get_random(1000,2000));
	},500); intervalls.push(bird_spawn);
	
	var bird_animation = setInterval(()=>{
		if(pause) return;
		for(el of enemies)
		{
			if(el.name=='bird')
			{
				el.pic.src=el.pic.src.replace(el.current_skin,3-el.current_skin);
				el.current_skin=3-el.current_skin;
				if(get_random(0,101)<(enemy_parameters.bird.chance_of_changing_direction*100)){
					el.direction=el.direction=='up'?'down':'up';
				}
			}
			
		}
	},100); intervalls.push(bird_animation);
	
	
	var highscore_time_increase = setInterval(()=>{
		if(pause) return;
		if(kills < 20) highscore+=distance;
		else if (kills < 40) highscore+=distance * 1.5;
		else if (kills < 80) highscore+=distance * 2.0;
		else if (kills < 160) highscore+=distance * 2.5;
		else if (kills < 320) highscore+=distance * 3.0;
		else highscore+=distance * 3.5;	
		distance+=50;
		
		distance_dv.innerHTML=distance_dv.innerHTML.split(':')[0]+': '+distance+' m';
		highscore_dv.innerHTML=highscore_dv.innerHTML.split(':')[0]+': '+highscore;
	},1000); intervalls.push(highscore_time_increase); 
	
	
}
var distance=0;
var highscore=0;

var waiting_for_bird=false;
var waiting_for_spike=false;
var waiting_for_tree=false;
var waiting_for_ghost=false;
var waiting_for_meteor=false;
var waiting_for_gspike=false;
//var last_update=0;
//var difficulties={'20':}


function kill_update(name){
	kills++;
	kill_counter.innerHTML=kill_counter.innerHTML.split(':')[0]+': '+kills;
	
	if (name=='ghost') {
		highscore+=distance * 5.0;
		//console.log('ghost killed');
	}

	if (name=='tree') {
		highscore+=distance * 4.0;
		//console.log('tree killed');
	}
	/*if (name=='insane_ghost') {
		highscore+=distance * 7.0
	}
	if (name=='insane_tree') {
		highscore+=distance * 6.0
	}*/
	
	

}


function pattern_1(){

	var racoon_animation=setInterval(()=>{
		if(racoon.current_skin==11) {return;racoon.pic.src=racoon.pic.src.replace(11,1);racoon.current_skin=0;}
		else racoon.pic.src=racoon.pic.src.replace(racoon.current_skin,racoon.current_skin+1);
		racoon.current_skin++;
	},150);
	
	setTimeout(()=>{
		clearInterval(racoon_animation);
		let spikeball = {};
		spikeball.x=racoon.x+30;
		spikeball.y=racoon.y+125;
		spikeball.name='spike';
		spikeball.pic=spikeball_img;
		spikeball.target_y=duck.y;
		let a = spikeball.y-duck.y;
		let b = spikeball.x-duck.x;
		let c = Math.sqrt(a*a+b*b);
		let ratio=enemies_speed/c;
		spikeball.move_by_y=ratio*a;
		spikeball.move_by_x=ratio*b;
		
		enemies.push(spikeball);
		racoon.pic.src='enemies/racoon/raconthrowing1.png';
		racoon.current_skin=1;
		waiting_for_spike=false;
	},150*11);
	
	//intervalls.push(racoon_animation);
	
	
}


function get_random(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function move(element,x,y){
	element.x=x;element.y=y;
}

function refresh(){
	clear_hidden_screen();
	//ctx.drawImage(duck.pic, duck.x, duck.y, duck.width, duck.height);
	for(let el of upper_backgrounds) {
		hidden_ctx.drawImage(el.pic, el.x, el.y, el.width, el.height);
	}
	for(let el of lower_backgrounds) {
		hidden_ctx.drawImage(el.pic, el.x, el.y, el.width, el.height);
	}
	for(let el of gameparts) {
		hidden_ctx.drawImage(el.pic, el.x, el.y, el.width, el.height);
	}
	
	for(let el of enemies) {
		//console.log(el.name+', ',el.pic.src);
		//if(el.name=='meteor')
		//console.log("drawn: "+el.name+", "+el.x+", "+el.y+", w: "+enemy_parameters[el.name].width);
		if(el.name=='bird' && el.direction=='down') 
			draw_rotated(el,-90);
		else 
			hidden_ctx.drawImage(el.pic, el.x, el.y, enemy_parameters[el.name].width, enemy_parameters[el.name].height);
	}
	
	for(let el of lasers) {
		hidden_ctx.drawImage(el.pic, el.x, el.y, el.width, el.height);
	}
	
	
	hidden_ctx.beginPath();
	hidden_ctx.lineWidth = "2";
	hidden_ctx.strokeStyle = "pink";
	hidden_ctx.fillStyle = "pink";
	hidden_ctx.fillRect(screen_width*0.2, 100,screen_width*0.6, 5);
	hidden_ctx.stroke();
	
	hidden_ctx.fillStyle = "yellow";
	let img=new Image();
	img.src="character/duck_old.png";
	hidden_ctx.drawImage(img, screen_width*0.2, 100-duck.height, duck.width, duck.height);
	//ctx.fillRect(screen_width*0.2, 50,50, 50);
	hidden_ctx.stroke();
	
	
	if(hitbox_test_mod)
	{
		hidden_ctx.beginPath();
				hidden_ctx.lineWidth = "2";
				hidden_ctx.strokeStyle = "pink";
		
		for(enemy of enemies)
		{
			if(!enemy_parameters[enemy.name].hitbox) continue;
			for(hitbox of enemy_parameters[enemy.name].hitbox)
			{		
				hidden_ctx.rect(enemy.x+hitbox[0].x, enemy.y+hitbox[0].y,hitbox[1].x-hitbox[0].x, hitbox[1].y-hitbox[0].y);		
			}
		}
		for(hitbox of duck.hitbox)
		{		
			hidden_ctx.rect(duck.x+hitbox[0].x, duck.y+hitbox[0].y,hitbox[1].x-hitbox[0].x, hitbox[1].y-hitbox[0].y);		
		} 
		hidden_ctx.stroke();
	}
	
	clear_screen();
	ctx.drawImage(hidden_cv, 0, 0);
}

function draw_rotated(el,degree){
	hidden_ctx.save();
	hidden_ctx.translate( el.x, el.y);
	hidden_ctx.rotate(degree*Math.PI/180);
	hidden_ctx.translate(-el.x, -el.y);
	hidden_ctx.drawImage(el.pic, el.x, el.y, enemy_parameters[el.name].width, enemy_parameters[el.name].height);
	hidden_ctx.restore();
}

function clear_screen(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function clear_hidden_screen(){
	hidden_ctx.clearRect(0, 0, canvas.width, canvas.height);
}

var no_grav=false;
var issquishing=0;
var is_squish_pressed=false;
var is_right_pressed=false;
var is_left_pressed=false;
var jump_pressed=false;
var isjetpacking=false;
var keep_shooting=0;
var jumpintervall;
var shooting_intervall;
/*document.addEventListener("keydown", (event) => {
  if (event.keyCode==32) {
    console.log('asdasdsdasad');
  }
  if (event.keyCode==83) {
    console.log('asdasdsdasad2222');
  }
  // do something
});*/

window.onkeydown=function(event){
	//if(event.keyCode==13) {startgame();}
	//event.preventDefault();
	//console.log(event.keyCode);
	if(event.keyCode==32) { //up
		if(hitbox_test_mod) {bg_speed=0;meteor_vertical_speed=0;meteor_horizontal_speed=0;enemies_speed=0;pause=true;return;}
		if(!jump_pressed){
			jump_pressed=true;
			if(duck.y==water_level-duck.height){
				jump();
			}
			else if(!isjetpacking && duck.jetpack>0){
				isjetpacking=true;
				if(duck.jetpack>=duck.jetpack_max) jp_meter_img.style.display='block';
				//console.log('jetpacking');
			}
		}

		
		/*if((isjumping==1 || isfalling==1) && !isjetpacking && next_jump_is_second && duck.jetpack>0 && duck.y!=water_level-duck.height)
		{
			isjetpacking=true;
			return;
		}*/
		

		
	}
	
	if(event.keyCode==83) {// S
	
		//if(!inputs.includes('squish')) inputs.push('squish');
		//return;
		if(!is_squish_pressed){
			is_squish_pressed=true;
			//korábban itt volt a squish_down
		}
		
	}
	
	if(event.keyCode==75) { //K
		//inputs.push('shoot');
		if(keep_shooting==1) return;
		keep_shooting=1;
		shoot_laser();
		shooting_intervall = setInterval(()=>{
			shoot_laser();
		},500);
	}
	
	if(event.keyCode==68) {//D
		is_right_pressed=true;
	}
	
	if(event.keyCode==65) {//A
		is_left_pressed=true;
	}
	
	
	//return false;
}

window.onkeyup=function(event){
	//if(event.keyCode==13) {startgame();}
	event.preventDefault();
	if(event.keyCode==32) {
		if(hitbox_test_mod){bg_speed=6;meteor_vertical_speed=6;meteor_horizontal_speed=6; enemies_speed=9;pause=false;return;}
		jump_pressed=false;
		if(isjetpacking){
			console.log('ya')
			setTimeout(()=>{
				console.log(duck.y);
				if(is_squish_pressed && duck.y==water_level-duck.height) {squish_down();}
			},(water_level-duck.height-duck.y)/gravity_speed*17);
		}
		isjetpacking=false;//console.log('j1');
		//inputs.splice(inputs.indexOf('jump'),1);
	}
	
	if(event.keyCode==83) {
		//inputs.splice(inputs.indexOf('squish'),1);
		is_squish_pressed=false;
		squish_up();
	}
	if(event.keyCode==75) {
		//inputs.splice(inputs.indexOf('shoot'),1);
		clearInterval(shooting_intervall);
		keep_shooting=0;
	}
	if(event.keyCode==68) {//D
		is_right_pressed=false;
	}
	
	if(event.keyCode==65) {//A
		is_left_pressed=false;
	}
	//return false;
}

function jump(){
	no_grav=true; //console.log('no_grav=true 1');
	if(issquishing==1) {
		setTimeout(()=>{squish_up();}, duck.height/2/gravity_speed*16);
	}
	var jumpintervall = setInterval(()=>{
		move(duck,duck.x,duck.y-gravity_speed);
	},16)
	
	setTimeout(()=>{
		clearInterval(jumpintervall);
		no_grav=false; //console.log('no_grav=false 1');
		setTimeout(()=>{
			if(duck.y==water_level-duck.height) {
				if(jump_pressed) jump();
				else if(is_squish_pressed) squish_down();
			}
		}, (screen_height*0.2)/(gravity_speed)*16);
	}, (screen_height*0.2)/(gravity_speed)*16);
}


function shoot_laser()
{
	if(lasers.length>4) return;
	let laser={};
	laser.x=duck.x+30;
	laser.y=duck.y+15;
	laser.width=laser_img.width;
	laser.height=laser_img.height;
	laser.pic = laser_img;
	lasers.push(laser);
}

function squish_down(){
	issquishing=1;
	duck.y=duck.y+duck.height/2;
	duck.height=duck.height/2;
}
function squish_up(){
	if(issquishing==0) return;
	duck.y=duck.y-duck.height/2;
	duck.width=duck_img.width*0.1;
	duck.height=duck_img.height*0.1;
	issquishing=0;
}
var can_fly=false;
function activate_flying(){
	
	can_fly=true;
}

function isImageLoaded(img){
	return img.complete && typeof img.naturalWidth != 'undefined' && img.naturalWidth != 0;
}

var pause=false;
body.onmouseleave=function(){ pause=true; }
body.onmouseenter=function(){ if(duck.lives) pause=false; }

function loadWhenAllImagesAreLoaded(){
	let images = document.querySelectorAll('img');
	let asd = true;
	for(let im of images){
		if(!isImageLoaded(im)) asd=false;
	}
	if(!asd){
		setTimeout(()=>{
			loadWhenAllImagesAreLoaded();
		},100);
	}
	else{
		console.log('now');
		onload();
	}
}

function onload(){
	
	enemy_parameters={
	  "tree":{
			"width":enemy_tree_img.width*0.4,
			"height":enemy_tree_img.height*0.4,
			"skins":[enemy_tree_img,enemy_tree_damaged_1_img,enemy_tree_damaged_2_img],
			"hitbox":[
				[{'x':9,'y':158},{'x':16, 'y':175}],
				[{'x':17,'y':141},{'x':41, 'y':166}],
				[{'x':35,'y':141},{'x':42, 'y':149}],
				[{'x':44,'y':114},{'x':87, 'y':140}],
				[{'x':53,'y':105},{'x':78, 'y':113}],
				[{'x':80,'y':26},{'x':237, 'y':78}],
				[{'x':88,'y':79},{'x':237, 'y':148}],
				[{'x':97,'y':149},{'x':219, 'y':219}],
				[{'x':105,'y':220},{'x':149, 'y':263}],
				[{'x':88,'y':246},{'x':104, 'y':254}],
				[{'x':97,'y':238},{'x':104, 'y':245}],
				[{'x':70,'y':255},{'x':104, 'y':263}],
				[{'x':62,'y':264},{'x':121, 'y':272}],
				[{'x':238,'y':114},{'x':298, 'y':149}],
				[{'x':282,'y':150},{'x':316, 'y':193}],
				[{'x':214,'y':237},{'x':281, 'y':272}]
			],
			"size":0.4
		},
		"ghost":{
			"width":enemy_ghost_img.width*0.4,
			"height":enemy_ghost_img.height*0.4
		},
		"spike":{
			"width":spikeball_img.width*0.2,
			"height":spikeball_img.height*0.2,
			"hitbox":[
				[{'x':71,'y':68},{'x':269, 'y':261}],
				[{'x':140,'y':261},{'x':189, 'y':310}],
				[{'x':20,'y':145},{'x':71, 'y':193}],
				[{'x':140,'y':19},{'x':189, 'y':68}],
				[{'x':269,'y':136},{'x':319, 'y':174}]
			],
			"size":0.2
		},
		"meteor":{
			"width":duck_img.width*0.1*7, /*let it be 5 times of the duck*/
			"height":duck_img.width*0.1*7,
			"skins":['BlueMeteorFrame','GreenMeteorFrame','RedMeteorFrame'],
			"hitbox":[
				[{'x':128,'y':290},{'x':200, 'y':420}],
				[{'x':108,'y':300},{'x':200, 'y':420}],
				[{'x':87,'y':313},{'x':124, 'y':400}]
			],
			"size":(duck_img.width*0.1*7)/480
		},
		"ground_spike":{
			"width":ground_spike_img.width*2,
			"height":ground_spike_img.height*2,
			"hitbox":[
				[{'x':0,'y':30},{'x':31, 'y':31}],
				[{'x':1,'y':28},{'x':30, 'y':29}],
				[{'x':2,'y':26},{'x':29, 'y':27}],
				[{'x':3,'y':24},{'x':28, 'y':25}],
				[{'x':4,'y':22},{'x':27, 'y':23}],
				[{'x':5,'y':20},{'x':26, 'y':21}],
				[{'x':6,'y':18},{'x':25, 'y':19}],
				[{'x':7,'y':16},{'x':24, 'y':17}],
				[{'x':8,'y':14},{'x':25, 'y':15}],
				[{'x':9,'y':12},{'x':22, 'y':13}],
				[{'x':10,'y':10},{'x':21, 'y':11}],
				[{'x':11,'y':8},{'x':20, 'y':9}],
				[{'x':12,'y':6},{'x':19, 'y':7}],
				[{'x':13,'y':4},{'x':18, 'y':5}],
				[{'x':14,'y':2},{'x':17, 'y':3}],
				[{'x':15,'y':0},{'x':16, 'y':1}]
			],
			"size":2
		},
		"bird":{
			"width":bird_img.width*0.5,
			"height":bird_img.height*0.5,
			"skins":['BlueBirdFrame','GreenBirdFrame','OrangeBirdFrame','PinkBirdFrame','YellowBirdFrame'],
			"size":0.5,
			"chance_of_changing_direction":0.1,
			"max_speed":3,
			"min_speed":7
		},
		"racoon":{
			"width":racoon_img.width*0.4,
			"height":racoon_img.height*0.4,
			"size":0.4
		},
		"racoon_board":{
			"width":racoon_board_img.width*0.4,
			"height":racoon_board_img.height*0.4,
			"size":0.4
		}
		
	}
	//console.log('resize');
	
	updateImageSizes();
	
	//music.volume=0.05;
	music.volume=0;
	res_selector.getElementsByTagName('option')[0].selected=true;
}

function updateImageSizes(){
	for(let enemy_name in enemy_parameters)
	{
		if(!enemy_parameters[enemy_name].hitbox) continue;
		console.log("ht set for: "+enemy_name)
		for(let hitbox of enemy_parameters[enemy_name].hitbox) {
			hitbox[0].x*=enemy_parameters[enemy_name].size;
			hitbox[0].y*=enemy_parameters[enemy_name].size;
			hitbox[1].x*=enemy_parameters[enemy_name].size;
			hitbox[1].y*=enemy_parameters[enemy_name].size;
		}
		
	}

	for(let hitbox of duck.hitbox) {
		hitbox[0].x*=duck.size;
		hitbox[0].y*=duck.size;
		hitbox[1].x*=duck.size;
		hitbox[1].y*=duck.size;
	}
}

window.addEventListener("resize", (event)=>{
	if(1920-screen.width>1080-screen.height){
		//a szélesség változásához képest, jelenlegi/alap
	}
	
	for(let enemy_name in enemy_parameters){
		enemy_parameters[enemy_name].size
	}
});

var full=false;
/*body.onclick=()=>{
	if(full) return;
	let docElm = document.documentElement;
	if (docElm.requestFullscreen) {
		docElm.requestFullscreen();
	} else if (docElm.webkitRequestFullscreen) {
		docElm.webkitRequestFullscreen();
	} else if (docElm.msRequestFullscreen) { 
		docElm.msRequestFullscreen();
	}
	full=true;
}*/