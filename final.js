var song;
var img; // 6. style points
var fft;
var particles = [] // 4. particles

function preload(){
  // song = loadSound('./music/amoeba.mp3')
  // img = loadImage('./img/background.jpg')
  song = loadSound('./music/dre.mp3')
  img = loadImage('./img/hiphop.jpg')

}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // 2. change angle mode from radians to degrees
  angleMode(DEGREES);
  
  // 6. style points
  imageMode(CENTER)
  img.filter(BLUR, 2)

  rectMode(CENTER)

  fft = new p5.FFT(0.3)// Fast Fourier Transform, smoothing values can be added as arguments 0.8 by default

}

function draw() {
  background(0);

  // 2. translate circle into center of canvas
  translate(width/2, height /2);

  // 6. Beat detection
  fft.analyze()
  amp = fft.getEnergy(20, 200)
  
  // 6. style points

  push()
  if(amp > 200) {
    rotate(random(-0.5, 0.5))
  }
  image(img, 0, 0, width + 100, height + 100) // make img a little bigger so don't see corners on rotate
  pop()

  // 6. style points
  var alpha = map(amp, 0, 255, 180, 150) // alpha layer, black rectangle that's transparency changes depending on the size of the amp var 
  fill(0, alpha)
  noStroke();
  rect(0, 0, width, height); 

  // 1. initial setup
  stroke(255); // default stroke color is black so change it to white making it visible
  strokeWeight(3);
  noFill();

  let wave = fft.waveform(); // Returns an array of 1024 amplitude values (between -1.0 and +1.0) that represent a snapshot of amplitude readings in a single buffer. 

/* 1. DISPLAY WAVE ACROSS SCREEN LINEAR */ 

  // beginShape();
  // // loop through the waveform data
  // for(let i = 0; i <= width; i++) { // iterate from 0 to width of canvas, create wave on each x-coordinate across the whole screen
  //   let index = floor(map(i, 0, width, 0, wave.length)) // floor creates integer value

  //   let x = i;
  //   let y = wave[index] * 300 + height / 2; // scale it up to see value (300) then divide height by 2 to center in middle of screen
  //   // point(x, y) 
  //   vertex(x, y)
  // }
  // endShape()


/* 2. DISPLAY WAVE AS CIRCLE */ 

/* DUPLICATE CODE 
// TWO WAVE FORMS THAT ARE HALFCIRCLES MIRRORED
// FIRST HALF CIRCLE
  beginShape();
  // loop through the waveform data
  for(let i = 0; i <= 180; i++) { // iterate from 0 to 180 (degrees in half circle)
    let index = floor(map(i, 0, 180, 0, wave.length -1 )) // floor creates integer value

    let r = map(wave[index], -1, 1, 150, 350) // use the index to map the radius of the circle to the waveform

    let x = r * sin(i)

    let y = r * cos(i)

    // point(x, y) 
    vertex(x, y)
  }
  endShape()

  // SECOND HALF CIRCLE (ADD - INFRONT OF THE SINE FUNCTION IN THE x COORDINATE)
  beginShape();
  // loop through the waveform data
  for(let i = 0; i <= 180; i++) { // iterate from 0 to 180 (degrees in half circle)
    let index = floor(map(i, 0, 180, 0, wave.length -1 )) // floor creates integer value

    let r = map(wave[index], -1, 1, 150, 350) // use the index to map the radius of the circle to the waveform

    let x = r * -sin(i)
    let y = r * cos(i)

    // point(x, y) 
    vertex(x, y)
  }
  endShape()
*/

// 3. For loop - positive first time, negative second time
  for (let t = -1; t<=1; t+=2) {
    beginShape();
    // loop through the waveform data
    for(let i = 0; i <= 180; i += 0.5) { // iterate from 0 to 180 (degrees in half circle)  -- 3. INCREMENT BY 0.5 TO MAKE WAVEFORM MORE COMPLEX
      let index = floor(map(i, 0, 180, 0, wave.length -1 )) // floor creates integer value

      let r = map(wave[index], -1, 1, 150, 350) // use the index to map the radius of the circle to the waveform

      let x = r * sin(i) * t // 3. multiply x coordinate with t variable

      let y = r * cos(i)

      // point(x, y) 
      vertex(x, y)
    }
    endShape()
  }

  // 4. Particles

  
  let p = new Particle()
  particles.push(p)

  for(let i = particles.length -1; i >= 0; i--) { // iterate backwards through particle array to remove flicker upon splice
    if(!particles[i].edges()) {
      particles[i].update(amp > 200); // 6. add amp to update method, 200 value depends on song
      particles[i].show()
    } else {
      particles.splice(i, 1)
    }
  }




  
} // end draw function

function mouseClicked() {
  if(song.isPlaying()) {
    song.pause();
    noLoop() // wave pauses with song
  } else {
    song.play();
    loop();
  }
}

// 4. Particles 

class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(250);

    // 5. Particle movement
    this.vel = createVector(0, 0);
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001));
    this.w = random(3, 5)

    // 6. Style points
    this.color = [random(200, 255), random(200, 255), random(200, 255)]
  }
  // 5. Particle movement, 6. add cond argument
  update(cond) {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    if(cond) { // if true, add vel to pos a few more times
      this.pos.add(this.vel);
      this.pos.add(this.vel);
      this.pos.add(this.vel);
    }
  }

  edges() {
    if(this.pos.x < -width / 2 || this.pos.x > width / 2 ||
    this.pos.y < -height / 2 || this.pos.y > height / 2) {
      return true;
    } else {
      return false;
    }
  }

  show() {
    noStroke()
    fill(this.color)
    ellipse(this.pos.x, this.pos.y, this.w)
    // 4. static particle
    // ellipse(this.pos.x, this.pos.y, 4)
  }
}


