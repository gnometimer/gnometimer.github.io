var modal = document.getElementById("modal");
var btn = document.getElementById("buttColor");
var modalspace = document.getElementById("colorsel");
var colors = []; colors = JSON.parse(localStorage.getItem('colors'));
var colorIndex = parseInt(localStorage.getItem('colorIndex'),10);
function init(){
    //init service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            // registration worked
            console.log("ServiceWorker registration successful with scope: ",registration.scope);
            navigator.serviceWorker.addEventListener('updatefound',function(){
                console.log("update found");
                registration.update();
            });
            navigator.serviceWorker.addEventListener('controllerchange', function () {
                console.log("updated cache available, reloading...")
                window.location.reload();
            });
        })
            .catch(function(error) {
            // registration failed
            console.log("ServiceWorker registration failed: ",error);
        });
    };
    
    //init persistant variables
    if (!colorIndex){
        colorIndex = 0;
    }
    if (!colors){
        colors = [
            ["#bf00ff","#ffd1dc"],
            ["#E2EB98","#93A392"],
            ["#EBF5DF","#BAD4AA"],
            ["#FAA6FF","#7353BA"],
            ["#F5E6E8","#D5C6E0"],
            ["#485696","#E7E7E7"],
            ["#EFBC9B","#EE92C2"],
            ["#bf00ff","#008000"]
        ];
    }
    updatevars();
    //init prev color selection
    chgColor();
    //init functions
    btn.onclick = function() { modal.style.display = "block";}
    window.onclick = function(event) { if ([modal,document.getElementById("modal-close")].indexOf(event.target) != -1) { modal.style.display = "none";}}
    document.getElementById("addbutton").onclick = function() {addColor();}
    document.getElementById("rmbutton").onclick = function() {rmColor();}
    window.setInterval(function() {display();}, 500);
    //init color selection
    createSel();
    updatesel();
}
function updatevars(){
    localStorage.setItem('colors',JSON.stringify(colors));
    localStorage.setItem('colorIndex',colorIndex);
}
function createSel(){
    var e = document.getElementsByClassName("colorChoice");
    modalspace.innerHTML='';
    for (var i=0;i<colors.length;i++) {
        modalspace.innerHTML+='<div id="colorChoice'+i+'" class="colorChoice"><button disabled class="dispcolor cfg" style="background:'+colors[i][0]+';"></button><button disabled class="dispcolor cbg" style="background:'+colors[i][1]+';"></button></div>';
    }
    for (var i=0;i<e.length;i++) {
        e[i].onclick = function() { localStorage.setItem("colorIndex",this.id.replace("colorChoice",""));updatesel()}
    }
}
function updatesel(){
    colors = JSON.parse(localStorage.getItem('colors'));
    colorIndex = parseInt(localStorage.getItem('colorIndex'),10);
    for (e of document.getElementsByClassName("colorChoice")) { e.style.borderColor = "rgba(0,0,0,0)"; }
    var hmm = document.getElementById("colorChoice"+colorIndex);
    hmm.style.borderColor = "lightgreen";
    document.getElementById("selcolor").innerHTML = "Selected Color scheme is "+colorIndex+".";
    chgColor();
}
function chgColor(){
    if(!colors[colorIndex]){
        colorIndex=0;localStorage.setItem('colorIndex','0');
    }
    for (e of document.getElementsByClassName("bg")) { e.style.backgroundColor = colors[colorIndex][1]; }
    for (e of document.getElementsByClassName("fg")) { e.style.backgroundColor = colors[colorIndex][0]; }
    var header=document.getElementsByTagName("header")[0],h1=document.getElementsByTagName("h1")[0];
    
}
function addColor(){
    var fg = document.getElementById("selfgcolor");
    var bg = document.getElementById("selbgcolor");
    colors.push(["#"+fg.innerHTML,"#"+bg.innerHTML]);
    updatevars();;
    createSel();
    updatesel();
}
function rmColor(){
    if(colors.length>1){
        colors.splice(colorIndex,1);
        if(colors[colorIndex-1]){colorIndex-=1;}
        updatevars()
        createSel();
        updatesel();
    }
}
function display(){
    
    floor = Math.floor;
    var about = floor((new Date()).getTime() / 1000);
    var time = (about - (1561136400 - 0)) / 86400;
    var times = [];
    times[0] = time/365;
    times[1] = times[0]%1 * 12;
    times[2] = times[1]%1 * 4.34524;
    times[3] = times[2]%1 * 7;
    times[4] = times[3]%1 * 24;
    times[5] = times[4]%1 * 60;
    times[6] = times[5]%1 * 60;

    for (var i=0;i<times.length;i++) {times[i] = floor(times[i]);}
    for (var l=0,unit=["year","month","week","day","hour","minute","second"];l<unit.length;l++){
        document.getElementById(unit[l]).innerHTML = floor(times[l]);
        if(times[l]!=1){
            document.getElementById(unit[l]+"lab").innerHTML = unit[l][0].toUpperCase() +  
            unit[l].slice(1)+"s";
        }
        else{
            document.getElementById(unit[l]+"lab").innerHTML = unit[l][0].toUpperCase() +  
            unit[l].slice(1);
        }
    }
    //get next anniversary
    var next = new Date();
    if (next.getDate()>=21){
        next.setMonth((next.getMonth()+1)%12);
            if (next.getMonth()==0){
                console.log(next.getFullYear());
                next.setFullYear((next.getFullYear()+1));
            }
    }
    next.setDate(21);
    next.setHours(13);
    next.setMinutes(0);
    next.setSeconds(0);
    var remain=floor(next.getTime()/1000)-about;
    document.getElementById("next").innerHTML = secondsToDhms(remain) + "<br/>until next month's monthiversary";
}

function rgb2hex(rgb){
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}
function secondsToDhms(seconds) {
seconds = Number(seconds);
var d = Math.floor(seconds / (3600*24));
var h = Math.floor(seconds % (3600*24) / 3600);
var m = Math.ceil(seconds % 3600 / 60);

var dDisplay = d + (d == 1 ? " day, " : " days, ");
var hDisplay = h + (h == 1 ? " hour, and " : " hours, and ");
var mDisplay = m + (m == 1 ? " minute " : " minutes ");
return dDisplay + hDisplay + mDisplay;
}