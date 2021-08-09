let board=new Array(9);
let boardb=new Array(9);
for(let i=0;i<9;i++){
    board[i]=new Array(9);
    boardb[i]=new Array(9);
}
let motigoma=new Array(7);
let motigoma2=new Array(7);
for(let i=0;i<7;i++){
    motigoma[i]=0;
    motigoma2[i]=0;
}

let cellsize=65,topx=210,topy=10;
let img=new Array(59);
let row=9,column=9,row2,column2,koman;
let koma=["#歩","#香","#桂","#銀","#金","#飛","#角"];
let gamemode=6; //０：駒選択　１：進む場所選択　２：進む場所選択（置き駒から）　３：成り選択　４：待機　６：マッチング　
let endgame=0; //０：ゲーム中　1：勝ち　2：負け

let button=new Array(3);

let conn,peer;
let dim;
let connectplayer=false,connectserver=false;
let allPeerList=[];
let select;


function preload(){
    for(let i=1;i<29;i++)    img[i]=loadImage('image/sgl'+i+'.png');
}

function setup(){
    createCanvas(1010,600);

    peer=new Peer(makeid(),
        {
            key: 'cf1155ef-ab9f-41a3-bd4a-b99c30cc0663',
            debug:3
        }
    );

    peer.on('open',()=>{
        dim=createP("あなたのID： "+peer.id);
        connectserver=true;
        search(false);
    });

    peer.on('connection',function(connection){
        conn=connection;
        conn.on("open",function(){
            console.log("接続成功");
            connectplayer=true;
        });
        conn.on("data",onRecvMessage);
        select.remove();
        dim.remove();
        gamemode=0;
    });

    setstone();
     
}

function draw(){
    disp();
}

function setstone(){
    for(let i=0;i<9;i++)    for(let j=0;j<9;j++){
        board[i][j]="N";
    }
    for(let i=0;i<9;i++){
        board[i][6]="#歩";
        board[i][2]="@歩";
    }
    board[0][8]=board[8][8]="#香";
    board[1][8]=board[7][8]="#桂";
    board[2][8]=board[6][8]="#銀";
    board[3][8]=board[5][8]="#金";
    board[4][8]="#王";
    board[1][7]="#角";
    board[7][7]="#飛";

    board[0][0]=board[8][0]="@香";
    board[1][0]=board[7][0]="@桂";
    board[2][0]=board[6][0]="@銀";
    board[3][0]=board[5][0]="@金";
    board[4][0]="@玉";
    board[7][1]="@角";
    board[1][1]="@飛";

     
}

function disp(){
    background('#e7d465');
    imageMode(CENTER);

    for(let i=0;i<9;i++)    for(let j=0;j<9;j++){
        noFill();
        stroke(0);
        if(i==column&&j==row) {
            fill('#bb333388');
        }
        square(i*cellsize+topx,j*cellsize+topy,cellsize);
    }

    for(let i=0;i<9;i++)    for(let j=0;j<9;j++){
        if(boardb[i][j]){
            noFill();
            strokeWeight(3);
            stroke('#3344ee');
            square(i*cellsize+topx,j*cellsize+topy,cellsize);    
            strokeWeight(1);
        }
    }

    //盤上の駒表示
    var x,y;
    for(let i=0;i<9;i++)    for(let j=0;j<9;j++){
        x=topx+i*cellsize+cellsize/2;
        y=topy+j*cellsize+cellsize/2;

        if(board[i][j]=="#王")  image(img[1],x,y);
        if(board[i][j]=="#飛")  image(img[2],x,y);
        if(board[i][j]=="#角") image(img[3],x,y);
        if(board[i][j]=="#金")  image(img[4],x,y);
        if(board[i][j]=="#銀")  image(img[5],x,y);
        if(board[i][j]=="#桂") image(img[6],x,y);
        if(board[i][j]=="#香")  image(img[7],x,y);
        if(board[i][j]=="#歩")  image(img[8],x,y);
        if(board[i][j]=="#!竜")  image(img[9],x,y);
        if(board[i][j]=="#!馬")  image(img[10],x,y);
        if(board[i][j]=="#!成銀")  image(img[11],x,y);
        if(board[i][j]=="#!成桂")  image(img[12],x,y);
        if(board[i][j]=="#!成香")  image(img[13],x,y);
        if(board[i][j]=="#!と")  image(img[14],x,y); 
        if(board[i][j]=="@飛")  image(img[15],x,y);
        if(board[i][j]=="@角")  image(img[16],x,y);
        if(board[i][j]=="@金") image(img[17],x,y);
        if(board[i][j]=="@銀")  image(img[18],x,y);
        if(board[i][j]=="@桂")  image(img[19],x,y);
        if(board[i][j]=="@香") image(img[20],x,y);
        if(board[i][j]=="@歩")  image(img[21],x,y);
        if(board[i][j]=="@玉")  image(img[22],x,y);
        if(board[i][j]=="@竜")  image(img[23],x,y);
        if(board[i][j]=="@馬")  image(img[24],x,y);
        if(board[i][j]=="@成銀")  image(img[25],x,y);
        if(board[i][j]=="@成桂")  image(img[26],x,y);
        if(board[i][j]=="@成香")  image(img[27],x,y);
        if(board[i][j]=="@と")  image(img[28],x,y); 

    }

    //成るか尋ねる
    if(gamemode==3){
        noStroke();
        fill("#ffffffaa");
        rectMode(CENTER);
        rect(topx+cellsize*4.5,topy+cellsize*4.5,cellsize*4.5,cellsize*2.5);
        rectMode(CORNER);
        fill(0);
        textAlign(CENTER);
        textSize(30);
        text("成りますか？",topx+cellsize*4.5,topy+cellsize*4.2);
    }

    if(endgame>0){
        noStroke();
        fill("#ffffffaa");
        rectMode(CENTER);
        rect(topx+cellsize*4.5,topy+cellsize*4.5,cellsize*4.5,cellsize*2.5);
        rectMode(CORNER);
        fill(0);
        textAlign(CENTER);
        textSize(30);
        if(endgame==1) text("あなたの勝ちです",topx+cellsize*4.5,topy+cellsize*4.2);   
        else            text("あなたの負けです",topx+cellsize*4.5,topy+cellsize*4.2);  
    }
    
    //持ち駒の表示
    stroke(0);
    fill('#e7d465');
    square(5,10,cellsize*3);
    square(topx+cellsize*9+10,topy+cellsize*6,cellsize*3);
    strokeWeight(3);
    textSize(20);

    let im=[8,7,6,4,5,2,3];
    var x=[9, 10, 11, 9.5, 10.5, 9.5, 10.5];
    var y=[6,6,6,7,7,8,8];
    for(let i=0;i<7;i++){
        if(motigoma[i]>0){
            if(gamemode==2&&i==koman){
                noStroke();
                fill('#bb333388');
                square(topx+cellsize*x[i]+10,topy+cellsize*y[i],cellsize);
            }
            image(img[im[i]],topx+cellsize*x[i]+10+cellsize/2,topy+cellsize*y[i]+cellsize/2);
            if(motigoma[i]>1){
                fill(255);
                stroke(0);
                text(motigoma[i],topx+cellsize*x[i]+10+cellsize*0.8,topy+cellsize*y[i]+cellsize);
            }
        }
    }
    im=[21,20,19,17,18,15,16];
    var x=[2, 1, 0, 1.5, 0.5, 1.5, 0.5];
    var y=[2,2,2,1,1,0,0];
    for(let i=0;i<7;i++){
        if(motigoma2[i]>0){
            image(img[im[i]],cellsize*x[i]+cellsize/2,topy+cellsize*y[i]+cellsize/2);
            if(motigoma[i]>1)   text(motigoma[i],cellsize*x[i]+cellsize*0.7,topy+cellsize*y[i]+cellsize*0.9)
        }
    }
    strokeWeight(1);

}


function mouseClicked(){
    if(mouseX>100&&mouseX<300&&mouseY>100&&mouseY<300&&gamemode==6)  search(true);

    if(endgame==0&&gamemode<3&&mouseX>=topx&&mouseX<=topx+9*cellsize&&mouseY>=topy&&mouseY<topy+cellsize*9){
        column=int((mouseX-topx)/cellsize);
        row=int((mouseY-topy)/cellsize);
        
        if(board[column][row].charAt(0)=='#'){  //自分の駒を選択
            gamemode=1;
            column2=column;
            row2=row;
            enablecite(column,row);
        }else if(gamemode==1){  //進む場所を選択
            if(boardb[column][row]){    //進める
                if(board[column2][row2].charAt(1)!='!'&&(row<3||row2<3))  flip();
                else{
                    if(board[column][row].charAt(0)=='@')   getstone();
                    gamemode=4;
                    sendmessage(8,false);
                    board[column][row]=board[column2][row2];
                    board[column2][row2]="N";
                    for(let i=0;i<9;i++)    for(let j=0;j<9;j++)    boardb[i][j]=false;
                    
                }
            }else{  //進めない
                gamemode=0;
                for(let i=0;i<9;i++)    for(let j=0;j<9;j++)    boardb[i][j]=false;
            }
    
        }

        if(gamemode==2&&boardb[column][row]){     //置き駒から置く
            sendmessage(koman,false);
            board[column][row]=koma[koman];
            gamemode=4;
            for(let i=0;i<9;i++)    for(let j=0;j<9;j++)    boardb[i][j]=false;
            motigoma[koman]--;

        }
    }else　if(endgame==0&&gamemode<3){  //置き駒を選択
        
        var x=[9, 10, 11, 9.5, 10.5, 9.5, 10.5];
        var y=[6,6,6,7,7,8,8];
        
        for(let i=0;i<8;i++){
            if(mouseX>=topx+cellsize*x[i]+10&&mouseX<topx+cellsize*(x[i]+1)+10&&mouseY>=topy+cellsize*y[i]&&mouseY<topy+cellsize*(y[i]+1)){
                if(motigoma[i]>0){
                    koman=i;
                    enablecite2(i);
                    gamemode=2;
                    column=9;
                    row=9;
                }
                break;
            }
        }
        
    }
}


function enablecite(c,r){
    for(let i=0;i<9;i++)    for(let j=0;j<9;j++){
        boardb[i][j]=false;
    }

    if(board[c][r]=="#歩"||board[c][r]=="#桂"||board[c][r]=="#銀"||board[c][r]=="#金"||board[c][r]=="#王"||
    board[c][r]=="#!成銀"||board[c][r]=="#!成桂"||board[c][r]=="#!成香"||board[c][r]=="#!と"||board[c][r]=="#!竜"||board[c][r]=="#!馬"){
        let b;

        if(board[c][r]=="#歩")  b=[[c,r-1]];
        if(board[c][r]=="#桂")  b=[[c-1,r-2],[c+1,r-2]];
        if(board[c][r]=="#銀")  b=[[c,r-1],[c+1,r+1],[c+1,r-1],[c-1,r+1],[c-1,r-1]];
        if(board[c][r]=="#金"|| board[c][r]=="#!成銀"||board[c][r]=="#!成桂"||board[c][r]=="#!成香"||board[c][r]=="#!と")  b=[[c-1,r-1],[c-1,r],[c,r-1],[c,r+1],[c+1,r-1],[c+1,r]];
        if(board[c][r]=="#王"||board[c][r]=="#!竜"||board[c][r]=="#!馬")  b=[[c-1,r-1],[c-1,r],[c,r-1],[c,r+1],[c+1,r-1],[c+1,r],[c+1,r+1],[c-1,r+1]];

        for(let i=0;i<b.length;i++){
            if(inorout(b[i][0],b[i][1])){
                if(board[b[i][0]][b[i][1]].charAt(0)!='#'){
                    boardb[b[i][0]][b[i][1]]=true;
                }
            }
        }
    }

    if(board[c][r]=="#香"||board[c][r]=="#飛"||board[c][r]=="#角"||board[c][r]=="#!竜"||board[c][r]=="#!馬"){
        let b;

        if(board[c][r]=="#香")  b=[[0,-1]];
        if(board[c][r]=="#飛"||board[c][r]=="#!竜")  b=[[0,-1],[0,1],[-1,0],[1,0]];
        if(board[c][r]=="#角"||board[c][r]=="#!馬")  b=[[-1,-1],[-1,1],[1,-1],[1,1]];
        
        for(let i=1;i<b.length+1;i++){
            for(let j=1;j<9;j++){
                if(inorout(c+b[i-1][0]*j,r+b[i-1][1]*j)){
                    if(board[c+b[i-1][0]*j][r+b[i-1][1]*j].charAt(0)=='N'){
                        boardb[c+b[i-1][0]*j][r+b[i-1][1]*j]=true;
                    }else if(board[c+b[i-1][0]*j][r+b[i-1][1]*j ].charAt(0)=='@'){
                        boardb[c+b[i-1][0]*j][r+b[i-1][1]*j]=true;
                        break;
                    }else   break;
                }else   break;
            }
        }
    }


    
}


function enablecite2(n){
    let tem=[1,1,2,0,0,0,0];

    for(let i=0;i<9;i++)    for(let j=0;j<9;j++)    boardb[i][j]=false;
    for(let i=0;i<9;i++)    for(let j=tem[n];j<9;j++){
        if(board[i][j]=="N")    boardb[i][j]=true;
            else    boardb[i][j]=false;
    }
    if(n==0)    for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
            if(board[i][j]=="#歩"){
                for(let k=0;k<9;k++)    boardb[i][k]=false;
                break;
            }
        }
    }
}


function inorout(c,r){
    if(c>=0&&c<9&&r>=0&&r<9)    return true;
        else    return false;
}


function flip(){
    gamemode=3;
    button[0]=createButton("はい");
    button[0].position(topx+cellsize*3,topy+cellsize*5);
    button[0].style('width','80px');
    button[0].style('height','30px');
    button[0].mouseClicked(flipyes);
    button[1]=createButton("いいえ");
    button[1].position(topx+cellsize*5,topy+cellsize*5);
    button[1].style('width','80px');
    button[1].style('height','30px');
    button[1].mouseClicked(flipno);

   
}


function flipyes(){
    if(board[column][row].charAt(0)=='@')   getstone();
    gamemode=4;
    button[0].remove();
    button[1].remove();
    sendmessage(8,true);
    if(board[column2][row2]=="#歩") board[column][row]="#!と";
    if(board[column2][row2]=="#香") board[column][row]="#!成香";
    if(board[column2][row2]=="#桂") board[column][row]="#!成桂";
    if(board[column2][row2]=="#銀") board[column][row]="#!成銀";
    if(board[column2][row2]=="#飛") board[column][row]="#!竜";
    if(board[column2][row2]=="#角") board[column][row]="#!馬";
    board[column2][row2]="N";
    for(let i=0;i<9;i++)    for(let j=0;j<9;j++)    boardb[i][j]=false;
}


function flipno(){
    if(board[column][row].charAt(0)=='@')   getstone();
    gamemode=4;
    button[0].remove();
    button[1].remove();
    sendmessage(8,false);
    board[column][row]=board[column2][row2];
    board[column2][row2]="N";
    for(let i=0;i<9;i++)    for(let j=0;j<9;j++)    boardb[i][j]=false;
}


function getstone(){
    if(board[column][row]=="@歩"||board[column][row]=="@と")    motigoma[0]++;
    if(board[column][row]=="@香"||board[column][row]=="@成香")  motigoma[1]++;
    if(board[column][row]=="@桂"||board[column][row]=="@成桂")  motigoma[2]++;
    if(board[column][row]=="@金")                              motigoma[3]++;
    if(board[column][row]=="@銀"||board[column][row]=="@成銀")  motigoma[4]++;
    if(board[column][row]=="@飛"||board[column][row]=="@竜")    motigoma[5]++;
    if(board[column][row]=="@角"||board[column][row]=="@馬")    motigoma[6]++;
    if(board[column][row]=="@玉"){
        endgame=1;
        conn.send("youlose");
    }
}


function onRecvMessage(data){

    let m=new Array(8);
    console.log(data);
        
    if(data.charAt(0)=='a'){ 
        m[0]=data.charAt(0);
        for(let i=1;i<6;i++)    m[i]=int(data.charAt(i));
        m[6]=data.charAt(6);
        m[7]=data.slice(7);

        board[m[1]][m[2]]="N";
        column=m[3];
        row=m[4];
        if(m[7]=="@王") m[7]="@玉";
        board[m[3]][m[4]]=m[7];
        if(m[5]<8){
            if(m[6]=='+')    motigoma2[m[5]]++;
                else                motigoma2[m[5]]--;
        }
        gamemode=0;
    }
    if(data=="youlose") endgame=2;
    console.log(board);
    /*
    a12133+@歩:２列目３行目を削除２列目４行目に歩を置く
    */
}


    function sendmessage(n,swi){    //swi成る　n<7
    let message;
    message='a'+String(8-column2)+String(8-row2)+String(8-column)+String(8-row);
    if(n<8){
        message+=n+'-@'+koma[koman].slice(1);
    }
    else{
        if(board[column][row]=="N") message+="8+";
        else{
            if(board[column][row]=="@歩"||board[column][row]=="@と")    message+="0+";
            if(board[column][row]=="@香"||board[column][row]=="@成香")  message+="1+";
            if(board[column][row]=="@桂"||board[column][row]=="@成桂")  message+="2+";
            if(board[column][row]=="@金")                              message+="3+";
            if(board[column][row]=="@銀"||board[column][row]=="@成銀")  message+="4+";
            if(board[column][row]=="@飛"||board[column][row]=="@竜")    message+="5+";
            if(board[column][row]=="@角"||board[column][row]=="@馬")    message+="6+";
            if(board[column][row]=="@玉")                              message+="8+";
        }
        message+='@';
        if(swi){
            if(board[column2][row2]=="#歩") message+="と";
            if(board[column2][row2]=="#香") message+="成香";
            if(board[column2][row2]=="#桂") message+="成桂";
            if(board[column2][row2]=="#銀") message+="成銀";
            if(board[column2][row2]=="#飛") message+="竜";
            if(board[column2][row2]=="#角") message+="馬";
        }else message+=board[column2][row2].slice(1);
        if(message.charAt(8)=='!')  message=message.slice(0,-2)+message.slice(9);
    }
    conn.send(message);
}


function makeid() {
    var text = "";
    var possible = "abcdefghijkmnopqrstuvwxyz023456789";
    for (var i = 0; i < 5; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
    text="shogi"+text;
    return text;
}


function search(swi){
    allPeerList.length=0;
    peer.listAllPeers(list=>{
        for(let i=0;i<list.length;i++){
            if(peer.id!=list[i]&&peer.id.slice(0,-5)=="shogi")   allPeerList[allPeerList.length]=list[i];
        }
        console.log(allPeerList);
        console.log(allPeerList.length);

        if(swi) select.remove();
        select=createSelect();
        select.option("対戦相手を選んでください");
        for(let i=0;i<allPeerList.length;i++){
            select.option(allPeerList[i]);
            select.changed(selectevent);
        } 
    });
}


function selectevent(){
    if(select.value()!="対戦相手を選んでください"){
        conn=peer.connect(select.value());

        conn.on("data",onRecvMessage);
    
        conn.on("open",function(){
            console.log("接続成功");
            connectplayer=true;
            select.remove();
            dim.remove();
            gamemode=4;
        });

    }
}

