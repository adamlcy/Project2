/*
Hide the opening scene and display the stage
*/
function startAnime(){
	
	let $ghostIcon = $('#ghost_icon'),
	$titleElement=$('.title_element'),
	tl = new TimelineLite(),
	tl2 = new TimelineLite(),
	tl3 = new TimelineLite();
	
	tl.to($ghostIcon,0.1,{scale:3});
	tl.to($ghostIcon,2,{scale:1,delay:0.1});
	
	tl2.to($ghostIcon,2,{bezier:{curviness:1,values:[
		{x:0,y:0},{x:-120,y:140},{x:220,y:100},{x:0,y:0}
	]}})
	tl3.to($ghostIcon,2,{opacity:1});
	tl2.to($titleElement,1,{delay:0.5, opacity:0.7});
}
/*
Change the body color to look cool
*/

function stageAnime(){
	
	let $stage = $("#stage"),
	$backgroundColor = $("body"),
	tl = new TimelineLite(),
	tl2 = new TimelineLite();
	tl.to($backgroundColor,2,{backgroundColor:"rgb(25,0,0)"});
	tl2.to($stage,3,{opacity:1});
	
}

/*
Hide the stage and display the ending message
*/
function endAnimation(status){
	
	let $stage = $("#stage"),
	$ending = $("#end_title"),
	msg = `You DIED`,
	tl = new TimelineLite();
	tl.to($stage,3,{opacity:0});
	tl.to($stage,0,{display:"none"});
	if(status=="2"){
		msg="You escaped"
	}
	document.querySelector("#end_title").style.display = "block";
	document.querySelector("#end_title").innerHTML = msg;
	tl.to($ending,3,{opacity:1});
	
}

$(function() {
	startAnime();
});
