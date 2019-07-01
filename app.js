const canvas = document.getElementById('flappyCanvas');
const ctx = canvas.getContext('2d');

var frames =0;
const score={
    value: 0,
    best: parseInt(localStorage.getItem('best'))||0,
    draw: function(){
        ctx.font = "100px Courier";
        ctx.fillStyle= "#fff";
        ctx.strokeStyle="#000";
        ctx.lineWidth = 5;
        ctx.fillText('SCORE:'+this.value,0,100);
        ctx.strokeText('SCORE:'+this.value,0,100 );
        ctx.fillText('BEST:'+this.best,650,100);
        ctx.strokeText('BEST:'+this.best,650,100);
    }

}


function roundOver(){
    document.getElementById('roundEnd').playbackRate = 1;
    document.getElementById('roundEnd').play();
}

//images
const ship = {
    pic: document.querySelector('#ship>img'),
    width: 236,
    height: 130,
    x: 100,
    y: 1000,
    speed:0,
    gravity: 1,
    jump: 20,
    fly: function(){
        this.speed= -(this.jump);
    },
    draw: function(){
        ctx.drawImage(this.pic,this.x,this.y,this.width,this.height );
    },
    update: function(){
        if(state==1){
            this.speed+=this.gravity;
            this.y+=this.speed;
            if(this.y+this.height>=canvas.height-ftr.height+(this.height*0.25)){
                this.y=canvas.height-ftr.height-(this.height/1.7);
                state=2;
                roundOver();
            }
        }
        
    }
};

var changeObs=0;

const obs = {
    pic: document.querySelector('#obstacle>img'),
    width: 418,
    height: 2792,
    x: 600,
    y: -261,
    dx: 20,
    position: [],
    update: function(){
        changeObs=Math.random()*800;
        if(state!=1) return;
        
        if(frames%80==0){
            this.position.push({
                x: canvas.width,
                y: this.y-changeObs
            })
        }
        for(let i = 0; i<this.position.length;i++){
            let p=this.position[i];
            p.x-=this.dx;

            if((ship.x+(ship.width/2)<=p.x+this.width)&&(ship.x+(ship.width/2)>=p.x+(this.width/3))){
                if((ship.y+(ship.height/2)<=p.y+1262+ring.height)&&(ship.y>=p.y+1262)){
                    // console.log(score);
                }
                else{
                    state=2;
                    roundOver();
                }
                
            }
            if(p.x+this.width<=0){
                this.position.shift();
            }
        }
    },
    draw: function(){
        for(let i = 0; i<this.position.length;i++){
            let p=this.position[i];
            ctx.drawImage(this.pic,p.x,p.y,this.width,this.height );
        }        
    }
};

const ring = {
    pic: document.querySelector('#ring>img'),
    width: 280,
    height: 500,
    x: 702,
    y: 1000,
    position:[],
    update: function(){
        if(state!=1) return;
        
        if(frames%80==0){
            this.position.push({
                x: canvas.width+100,
                y: this.y-changeObs,
                z: 0                
            })
        }
        for(let i = 0; i<this.position.length;i++){
            let p=this.position[i];
            p.x-=obs.dx;

            if(p.x+this.width<=ship.x){
                if(p.z!=1){
                    score.value+=1;
                    p.z=1;
                    score.best=Math.max(score.value,score.best);
                    localStorage.setItem('best',score.best);
                }
            }

            if(p.x+this.width<=0){
                this.position.shift();
            }
        }
    },
    draw: function(){
        for(let i = 0; i<this.position.length;i++){
            let p=this.position[i];
            ctx.drawImage(this.pic,p.x,p.y,this.width,this.height );
        }
    }
};

const bg = {
    pic: document.querySelector('#back>img'),
    width: 1080,
    height: 1920,
    x: 0,
    y: 0,
    draw: function(){
        ctx.drawImage(this.pic,this.x,this.y,this.width,this.height);
    }
};

const ftr = {
    pic: document.querySelector('#footer>img'),
    width: 1080,
    height: 235,
    x: 0,
    y: 1685,
    draw: function(){
        ctx.drawImage(this.pic,this.x,this.y,this.width,this.height );
    }
};

const start = {
    pic: document.querySelector('#start>img'),
    width: 864,
    height: 432,
    x: 108,
    y: 288,
    draw: function(){
        if(state==0){
            ctx.drawImage(this.pic,this.x,this.y,this.width,this.height );
        }
    }
};

const end = {
    pic: document.querySelector('#end>img'),
    width: 720,
    height: 431,
    x: 170,
    y: 700,
    draw: function(){
        if(state==2){
            ctx.drawImage(this.pic,this.x,this.y,this.width,this.height );
        } 
    }
};

var state=0;



function draw(){
    frames++;
    bg.draw();
    obs.draw();
    ship.draw();
    ring.draw();
    ftr.draw();
    start.draw();
    end.draw();
    score.draw();
}

function update(){

    ship.update();
    obs.update();
    ring.update();
}

function loop(){
    update();
    draw();
    frames++;
    


    requestAnimationFrame(loop);
}

loop();
canvas.addEventListener('click', function(evt){
    state=state%3;
    switch(state){
        case 0:
            state=1;
            ship.fly();
            break;
        case 1:
            ship.fly();
            document.getElementById('swoosh').playbackRate = 10;
            document.getElementById('swoosh').play();
            break;
        case 2:
            
            state= 0;
            ship.y=1000;
            for(let i=0;i<obs.position.length;i++){
                obs.position.shift();
                ring.position.shift();
            }
            score.value=0;
            obs.position.pop();
            ring.position.pop();
            break;
    }
});

setTimeout(() => {
    document.getElementById('finish').style.display='block';
    document.getElementById('finish').style.width='100%';
    canvas.style.display='none';
}, 600000);

