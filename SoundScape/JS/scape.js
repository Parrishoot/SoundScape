//vars
var canvas_count = 0;
var num_osc = 50;
var ac;
var oscs;
var gains;
var curr;
var notes;
var wave;


window.onload = function() {
	//create requestAnimationFrame
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;


	//init allowed note freqs
	notes = [
		77.78, 	//Eb
		87.305, //F
		98, 	//G
		233.08, //Bb
		116.54, //C
		155.565 //Eb
	];
	//init audio context and oscillator
	ac = new (window.AudioContext || window.webkitAudioContext);
	oscs = [];
	gains = [];
	for(var i = 0; i < num_osc; i++) {
		oscs[i] = ac.createOscillator();
		oscs[i].type = 'sine';
		gains[i] = ac.createGain();
		gains[i].gain.setValueAtTime(.00001, ac.currentTime);
		oscs[i].connect(gains[i]);
		gains[i].connect(ac.destination);
		oscs[i].start();
	}

	//init current oscillator var
	curr = 0;

	//init wave type
	wave = 'sine'

	//buttons to change the wave types
  	$("#sq").click(function() {
  		console.log("click!");
  		if(wave === "square") {
  			return;
  		}
  		else {
  			$("#sq").attr('src', '../Assets/Images/square_selected.png');
  			$("#tri").attr('src', '../Assets/Images/tri_unselected.png');
  			$("#sine").attr('src', '../Assets/Images/sine_unselected.png');
  			for(var i = 0; i < num_osc; i++) {
  				oscs[i].type = 'square';
  			}
  			wave = "square";
  		}
  	});

  	$("#tri").click(function() {
  		if(wave === "tri") {
  			return;
  		}
  		else {
  			$("#tri").attr('src', '../Assets/Images/tri_selected.png');
  			$("#sq").attr('src', '../Assets/Images/square_unselected.png');
  			$("#sine").attr('src', '../Assets/Images/sine_unselected.png');
  			for(var i = 0; i < num_osc; i++) {
  				oscs[i].type = 'triangle';
  			}
  			wave = "tri";
  		}
  	});

  	$("#sine").click(function() {
  		if(wave === "sine") {
  			return;
  		}
  		else {
  			$("#sine").attr('src', '../Assets/Images/sine_selected.png');
  			$("#tri").attr('src', '../Assets/Images/tri_unselected.png');
  			$("#sq").attr('src', '../Assets/Images/square_unselected.png');
  			for(var i = 0; i < num_osc; i++) {
  				oscs[i].type = 'square';
  			}
  			wave = "sine";

  		}
  	});
};

document.addEventListener("click", printMousePos);

//create new canvas and start circle animation at 
//mouse click point
function printMousePos(event) {

	//create a new canvas
	var canvas = document.createElement('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.style.position="absolute";
	canvas_count++;
	var id = "canvas_" + canvas_count.toString();
	canvas.setAttribute("id", id);
	document.body.appendChild(canvas);

	//set the current oscillator to the next in line and set random frequency
	osc_num = (curr++) % num_osc;
	oscs[osc_num].frequency.setValueAtTime(getNote(), ac.currentTime);

	//
	gains[osc_num].gain.exponentialRampToValueAtTime(0.7, ac.currentTime + .2);
	gains[osc_num].gain.exponentialRampToValueAtTime(0.00001, ac.currentTime + 2);
	animate(event.clientX, event.clientY, 0, canvas, canvas.getContext('2d'), id, 1, osc_num);
}

//animate the circles growing and fading
function animate(x, y, radius, canvas, ctx, id, alpha, osc_num) {

	//set its opacity
	ctx.globalAlpha = alpha;

	//clear prev frame
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//draw next circle
	ctx.beginPath();
	ctx.arc(x, y, radius , 2 * Math.PI, false);
	ctx.lineWidth = 5;
	ctx.strokeStyle = "#FFFFFF";
	ctx.stroke();

	//draw next frame or remove the canvas
	if(radius < 700) {
		requestAnimationFrame(function() {
			animate(x,y,radius+7, canvas, ctx, id, alpha - .01, osc_num);
		});
	}
	else {
		$('#' + id).remove();
	}
}

//get a random in between a range of numbers
function randIntInRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//get a random note within the pentatonic scale
function getNote() {
	var note = notes[randIntInRange(0, notes.length - 1)];
	var multiplier = randIntInRange(1,3);
	
	//allow for multiple octaves
	return note * (Math.pow(2, multiplier));
}

