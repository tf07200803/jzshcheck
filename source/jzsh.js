var pukuArray=new Array()
var colorArray=new Array("♣","♦","♥","♠")
var finishArray=new Array()
var scoreArray=new Array()
var scoresort=new Array("第一名","第二名","第三名","第四名")


function init(){

    setdata()//裝入資料
    share()//發牌4人分

}

//裝入資料
function setdata(){
    num=0
    for(var i=0;i<52;i++){
        if(i%13==0 && i!=0){
            num++
        }
        if(i%13>7){
            pukuArray.push({color:colorArray[num],id:i,paper:i%13+1})
        }
        //pukuArray.push({color:colorArray[num],id:i,paper:i%13+1})
    }

}
//發牌4人分
function share(){
    for(var i=0;i<4;i++){
        var array=new Array()
        for(var j=0;j<5;j++){
            var ran=Math.floor(Math.random()*pukuArray.length)
            array.push(pukuArray[ran])
            pukuArray.splice(ran,1)
        }
        finishArray.push(array)

    }
    //finishArray[0]=[{color: "♣", id: 3, paper: 1},{color: "♣", id: 3, paper: 2},{color: "♣", id: 3, paper: 3},{color: "♣", id: 3, paper: 4},{color: "♣", id: 3, paper: 5}]
    //finishArray[1]=[{color: "♣", id: 3, paper: 10},{color: "♦", id: 3, paper: 11},{color: "♣", id: 3, paper: 12},{color: "♣", id: 3, paper: 13},{color: "♣", id: 3, paper: 1}]
    showpuku()
}

function showpuku(){
    var txt='';


    var newArray = JSON.parse(JSON.stringify(finishArray));


    for(var i=0;i<finishArray.length;i++){

        txt+='<div class="userDiv">';
        txt+='<ul>';
        for(var j=0;j<finishArray[i].length;j++){
            style='black'
            if(finishArray[i][j].color=='♥' || finishArray[i][j].color=='♦'){
                style='red'
            }
            showtxt=finishArray[i][j].paper
            if(finishArray[i][j].paper==1){
                finishArray[i][j].paper=14
                newArray[i][j].paper=1
                showtxt="A"
            }else if(finishArray[i][j].paper==11){
                showtxt="J"
            }else if(finishArray[i][j].paper==12){
                showtxt="Q"
            }else if(finishArray[i][j].paper==13){
                showtxt="K"
            }
            txt+='<li><div class="number">'+showtxt+'</div><div class="color '+style+'">'+finishArray[i][j].color+'</div></li>';
        }
        txt+='</ul>';
        txt+='<div class="answer">';
        var win=checkpuku(finishArray[i],newArray[i])
        scoreArray.push({"id":i,"score":win.winner})
        txt+=win.type;
        txt+='</div>';
        txt+='<div class="winner'+i+'"></div>'
        txt+='</div>';
    }
    scoreArray.sort(function(a, b) {
        return b.score - a.score;
    });

    $txt=$(txt)
    for(var i=0;i<scoreArray.length;i++){

        $txt.find(".winner"+scoreArray[i].id).text(scoresort[i])
    }
    $(".container").append($txt)


}

function checkpuku(array,array2){


    array.sort(function(a, b) {
        return a.paper - b.paper;
    });
    array2.sort(function(a, b) {
        return a.paper - b.paper;
    });

    var type=[]
    var color=[]
    var shan=[]
    var shancopy=[]
    //判斷有無重複牌
    for(var i=0;i<array.length;i++){
        if(jQuery.inArray( array[i].paper, type )!=-1){
            type.push('s')
        }else{
            type.push(array[i].paper)
        }

        if(i!=0){
            if(array[i].color==array[i-1].color){
                color.push(array[i].paper)
            }
            if(array[i].paper==array[i-1].paper+1){
                shan.push(array[i].paper)
            }
            if(array2[i].paper==array2[i-1].paper+1){
                shancopy.push(array2[i].paper)
            }
        }else{
            color.push(array[i].paper)
            shan.push(array[i].paper)
            shancopy.push(array2[i].paper)
        }
    }




    //重複整理後陣列
    var ans=[]
    for(var i=0;i<type.length;i++){
        if(type[i]=='s'){
            type[i]=type[i-1]
            ans.push(type[i-1])
        }
    }



    var score=0
    var obj=collectionRepeat(ans)
    var arr=Object.entries(obj)
    var wintype='散牌'



    if(arr.length>0 && arr.length<2 && arr[0][1]==1){
        wintype='對子'
        other=[]
        for(var i=0;i<type.length;i++){
            if(jQuery.inArray( type[i], ans )==-1){
                other.push(type[i])
            }
        }
        score+=parseInt(arr[0][0])*1000+rema(other)


    }else if(arr.length>0 && arr.length<2 && arr[0][1]==2){
        wintype='三條'
        score=200000
        score+=parseInt(arr[0][0])*1000

    }else if(arr.length>0 && arr.length<2 && arr[0][1]==3){
        wintype='鐵支'
        score=700000
        score+=parseInt(arr[0][0])*1000
    }else if(arr.length>1 && arr[0][1]==1 && arr[1][1]==1){
        wintype='對對'
        score=100000
        other=[]
        for(var i=0;i<type.length;i++){
            if(jQuery.inArray( type[i], ans )==-1){
                other.push(type[i])
            }
        }
        if(parseInt(arr[0][0])>parseInt(arr[1][0])){
            score+=parseInt(arr[0][0])*1000+parseInt(arr[1][0])*100+rema(other)
        }else{
            score+=parseInt(arr[1][0])*1000+parseInt(arr[0][0])*100+rema(other)
        }
    }else if(arr.length>1 && arr[0][1]==2 && arr[1][1]==1){
        wintype='葫蘆'
        score=600000
        score+=parseInt(arr[0][0])*1000
    }else if(arr.length>1 && arr[0][1]==1 && arr[1][1]==2){
        wintype='葫蘆'
        score=600000
        score+=parseInt(arr[1][0])*1000
    }else if(color.length==5){
        wintype='同花'
        score=400000+rema(color)
        if(shan.length==5 || shancopy.length==5){
            wintype='同花順'
            score+=600000
        }

    }else if(shan.length==5 || shancopy.length==5){
        wintype='順子'
        score=300000+rema(shan)
    }

    return {'type':wintype,'winner':score}

}


var collectionRepeat = function(box, key){
    var counter = {};

    box.forEach(function(x) {
        counter[x] = (counter[x] || 0) + 1;
    });

    var val = counter[key];

    if (key === undefined) {
        return counter;
    }

    return (val) === undefined ? 0 : val;
}

function rema(arr){

    var score=0
    if(arr[0]){
        score+=arr[0]*1
    }
    if(arr[1]){
        score+=arr[1]*50
    }
    if(arr[2]){
        score+=arr[2]*100
    }
    if(arr[3]){
        score+=arr[3]*500
    }
    if(arr[4]){
        score+=arr[4]*1000
    }
    return score;
}

function btnclick(){
    window.location.reload()
}
