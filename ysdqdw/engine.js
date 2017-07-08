
MOBILE=window.mobilecheck();
GAMED_ENDED = false;
CERTAS = 0;
w = 252;
h = 248;
carretx = 16;
carrety = 194;
curr_level = 0;
keto.setup(true);
tframe = 0;

function getColor(colorname){
  game_colors= {'time_circle':'#7B7539','bg':'#eee1b5'};
  return game_colors[colorname];
}

var first_action = 0;

function update_certas(){
    hud_ctx.clearRect(w-48,2,46,16)
    png_font.drawText(CERTAS.toString(),[w-48,0])
}

function setpixelated(canvas){
  var ctx = canvas.getContext('2d');
  ctx['imageSmoothingEnabled'] = false;       /* standard */
  ctx['mozImageSmoothingEnabled'] = false;    /* Firefox */
  ctx['oImageSmoothingEnabled'] = false;      /* Opera */
  ctx['webkitImageSmoothingEnabled'] = false; /* Safari */
  ctx['msImageSmoothingEnabled'] = false;     /* IE */
  canvas.style.imageRendering = 'optimizeSpeed';
  canvas.style.imageRendering = '-moz-crisp-edges';
  canvas.style.imageRendering = '-o-crisp-edges';
  canvas.style.imageRendering = '-webkit-optimize-contrast';
  canvas.style.imageRendering = 'optimize-contrast';
  canvas.style.imageRendering = 'crisp-edges';
  canvas.style.imageRendering = 'pixelated';
}


function reset(){
    GAMED_ENDED = false;
    bg_ctx.clearRect(0,0,w,h);
    ctx.clearRect(0,0,w,h);
    ptx.clearRect(0,0,w,h);
    hud_ctx.clearRect(0,0,w,h);
    curr_level = 0;
    CERTAS = 0;
    update_certas()
    drawLevel()
}




function game_start(){

    loadImgs();

    bg_c = document.getElementById('bg_canvas')
    bg_ctx = bg_c.getContext("2d")
    setpixelated(bg_c)

    c = document.getElementById('level_canvas')
    ctx = c.getContext("2d")
    setpixelated(c);

    pc = document.getElementById('player_canvas')
    ptx = pc.getContext("2d")
    setpixelated(pc);

    px_id = ctx.createImageData(1,1); // only do this once per page
    px_d  = px_id.data;    // only do this once per page
    increr = 0;


    resize();
    setTimeout(resize,5000);

    function fireResizeEvent() {
     window.dispatchEvent(new Event('orientationchange'));
    }

    setTimeout(fireResizeEvent,6500);

    reset();
    draw();
}

function boot_game(){
    hud_c = document.getElementById('hud_canvas')
    hud_ctx = hud_c.getContext("2d")
    setpixelated(hud_c);

    png_font.setup( hud_ctx ,"img/unifont.png", function(){
      audio_start()
      game_start()
    })

}

function drawLevel(){
    bg_ctx.fillStyle=getColor('bg');
    bg_ctx.fillRect(0,0,w,h);
    bg_ctx.drawImage(document.getElementById(level[curr_level].bgimg),0,0,252,194);
    bg_ctx.fillStyle=getColor('time_circle');
    bg_ctx.fillRect(1,1,160,16);
    bg_ctx.beginPath();
    bg_ctx.arc(w-16, h-16, 16, 0, 2 * Math.PI);
    bg_ctx.fill();
}

word_queue = []

function pushNewWord(){
  var aword = level[curr_level].wordlist[Math.floor(Math.random()*level[curr_level].wordlist.length)];
  var posx = Math.floor(Math.random()*w-50)
  if( posx <4) posx = 4;
  var posy = Math.floor(Math.random()*32+194)
  var position =  [posx,posy];
  word_queue.push({word: aword, pos: position, wlength: aword.length, carret:0});
}

function drawText(){
  hud_ctx.clearRect(0,0,w,h)
  png_font.drawText(level[curr_level].levelname, [1,1],getColor('bg'),1);
  for(var i=0; i<word_queue.length; i++){
      png_font.drawText(word_queue[i].word,word_queue[i].pos,getColor('time_circle'),1);
      png_font.drawText(word_queue[i].word.charAt(word_queue[i].carret),
                       [word_queue[i].pos[0]+word_queue[i].carret*8,word_queue[i].pos[1]],
                       'red',1);
  }
}

function draw(){
    tframe++;
    if(tframe%240==0){
        pushNewWord();
    }
    drawText();
    window.requestAnimationFrame(draw);
}

function nextLevel(){
    audio_nextlevel()
    curr_level++;
    drawLevel();
}

function Create2DArray(rows) {
    var arr = [];

    for (var i=0;i<rows;i++) {
        arr[i] = [];
    }

    return arr;
}



function ketoKeyDown(e){
    for(var i=0; i<word_queue.length; i++){
        if(e.detail.toLowerCase()==word_queue[i].word.charAt(word_queue[i].carret).toLowerCase()){
            word_queue[i].carret+=1;
            if(word_queue[i].carret>=word_queue[i].wlength){
               word_queue.splice(i, 1);
               break;
            }
        }
    }


}

function resize(){
    keto.resize();
    function correctCanvas(canvas){
        if(window.innerHeight>window.innerWidth){
          available_h = keto.getRemainingHeight();
        
          //portrait
          canvas.style.height = Math.floor(available_h) + 'px';
          canvas.style.width = Math.floor(window.innerWidth) + 'px';
          canvas.style.position = 'absolute';
          canvas.style.top= 0;
          canvas.style.bottom= parseInt(window.innerHeight, 10)-parseInt(canvas.style.height, 10);
          canvas.style.left= 0;
          canvas.style.right= 0;
          canvas.style.margin= '0 auto';
        } else {
          //landscape
          if(MOBILE){
          
            available_w = keto.getRemainingWidth();
            canvas.style.height = Math.floor(window.innerHeight) + 'px';
            canvas.style.width = Math.floor(available_w) + 'px';
          } else {
            available_w = keto.getRemainingWidth();
            canvas.style.height = Math.floor(window.innerHeight) + 'px';
            canvas.style.width = Math.floor(available_w) + 'px';
          }
          canvas.style.position = 'absolute';
          canvas.style.top= 0;
          canvas.style.bottom= 0;
          canvas.style.left= 0;
          canvas.style.right= 0;
          canvas.style.margin= 'auto';
        }

        setpixelated(canvas)
    }

    correctCanvas(bg_c);
    correctCanvas(c);
    correctCanvas(pc);
    correctCanvas(hud_c);
}


anim_frame = 0;

window.addEventListener('keto_KeyPressed', ketoKeyDown,false);

window.addEventListener('resize', resize, false);
window.addEventListener('orientationchange', function(){resize(); setTimeout(resize,1000);}, false);
