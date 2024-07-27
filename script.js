// console.log("Checking")

var songs = []
let currFolder;
var currentSong=new Audio()
async function getsongs(folder) {
    currFolder=folder
    let s = await fetch(`http://127.0.0.1:3000/Projects/Project%202%20(Spotify%20Clone)/${folder}/`);
    let response = await s.text();
    // console.log(response)
    let div = document.createElement('div');
    div.innerHTML = response;
    let a = div.getElementsByTagName("a")
    // console.log(a)
    songs=[]
    for (let i = 0; i < a.length; i++) {
        const element = a[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
     let songUl=document.querySelector(".songList").getElementsByTagName("ul")[0];
     songUl.innerHTML=""
    for (const song of songs) {
        // console.log(song)
        // console.log(song.replaceAll("%20"," "))
        songUl.innerHTML=songUl.innerHTML + `<li>
        <img class="invert" src="img/music.svg" alt="">
        <div class="Info">
        <div>${song.replaceAll("%20"," ")}</div>
        </div>
        <div class="playnow">
        <span>Play Now</span>
        <img class="invert" src="img/play.svg" alt="">
        </div>
        </li>`;
        
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener('click',element=>{
            // console.log(e.querySelector(".Info").textContent.trim())
        playMusic(e.querySelector(".Info").textContent.trim());
        })
        
    })
    return songs;

}


const playMusic=(track,pause=false)=>{
    currentSong.src = `/Projects/Project%202%20(Spotify%20Clone)/${currFolder}/`+track
    if(!pause){
        currentSong.play()
        play.src="img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songTime").innerHTML="00:00/00:00"
}

function convertSecondsToMinutes(seconds) {
    seconds = Math.round(seconds); // Round seconds to the nearest whole number
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    var formattedMinutes = (minutes < 10 ? "0" : "") + minutes;
    var formattedSeconds = (remainingSeconds < 10 ? "0" : "") + remainingSeconds;
    var formattedTime = formattedMinutes + " :" + formattedSeconds;
    return formattedTime;
}


async function displayAlbums(){
    let s = await fetch(`http://127.0.0.1:3000/Projects/Project%202%20(Spotify%20Clone)/Songs/`);
    let response = await s.text();
    // console.log(response)
    let div = document.createElement('div');
    div.innerHTML = response;
    // console.log(div)
    let anchor = div.getElementsByTagName("a")
    // console.log(anchor)
    var cardCont=document.querySelector(".cardCont")
    anchor= Array.from(anchor)
    for (let i = 0; i  < anchor.length; i++) {
        const element = anchor[i];
        if(element.href.includes("/Songs")){
            let folder=element.href.split("/").splice(-2)[0]
            let s = await fetch(`http://127.0.0.1:3000/Projects/Project%202%20(Spotify%20Clone)/Songs/${folder}/info.json`);
            let response = await s.json();
            cardCont.innerHTML=cardCont.innerHTML + `<div data-folder="${folder}" class="card" >
            <div class="play">
                <svg data-encore-id="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" width="24"
                    height="24" class="Svg-sc-ytk21e-0 bneLcE"
                    style="background-color: #1fdf64; border-radius: 50%; padding: 8px;">
                    <path
                        d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z">
                    </path>
                </svg>
            </div>
            <img src="Songs/${folder}/cover.jpg" alt="">
            <h2 class="invert">${response.title}</h2>
            <p class="invert">${response.description}</p>
        </div>`
        }
        
        Array.from(document.getElementsByClassName("card")).forEach(e=>{e.addEventListener('click', async item=>{
        
            songs = await getsongs(`Songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0],false)
            // console.log(songs)
            })
          })
          
    }
}

async function main() {
    songs = await getsongs("Songs/Calming%20Acoustic")
    playMusic(songs[0],true)
    // console.log(songs);

    // <div>${song.replaceAll("%20"," ").split("-")[1]}</div>

    //Adding photos to dynamics albums
    displayAlbums()

    play.addEventListener('click',()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src="img/pause.svg"
        }
        else{
            currentSong.pause()
            play.src="img/play.svg"
        }
    })
    
    currentSong.addEventListener("timeupdate",()=>{
        // console.log(currentSong.currentTime,currentSong.duration)
        document.querySelector(".songTime").innerHTML=`${convertSecondsToMinutes(currentSong.currentTime)}/${convertSecondsToMinutes(currentSong.duration)}`
        document.querySelector(".circle").style.left= (currentSong.currentTime/currentSong.duration)*100 +"%"
        document.querySelector(".seekbar").addEventListener('click',(e)=>{
            // console.log(e.offsetX,e.target.getBoundingClientRect())
            let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
            document.querySelector(".circle").style.left=percent+"%"
            currentSong.currentTime=(currentSong.duration*percent)/100
        })
    })

    document.querySelector(".hamBurger").addEventListener('click',()=>{
        document.querySelector(".left").style.left="0"
    })
    
    document.querySelector(".cross").addEventListener('click',()=>{
        document.querySelector(".left").style.left="-120%"
    })

    previous.addEventListener("click",()=>{
        // console.log("previous clicked")
        // console.log(songs)
        // console.log(currentSong.src.split("/").splice(-1)[0])
        let index=songs.indexOf(currentSong.src.split("/").splice(-1)[0])
        if(index-1 >= 0){
            playMusic(songs[index-1])
        }
        
        
    })
    next.addEventListener("click",()=>{
        console.log("next clicked")
        // console.log(songs)
        // console.log(currentSong.src.split("/").splice(-1)[0])
        let index=songs.indexOf(currentSong.src.split("/").splice(-1)[0])
        if(index+1 <= songs.length-1){
            playMusic(songs[index+1])
        }
    })
    
    volumebar.addEventListener('change',(e)=>{
        console.log(e.target.value);
        currentSong.volume=parseInt(e.target.value)/100;
        if(currentSong.volume==0){
            volume.src="img/mute.svg"
        }
        else{
            volume.src="img/volume.svg"
        }
    })
    
    document.querySelector(".volume>img").addEventListener("click",(e)=>{
        console.log(e.target.src)
        if(e.target.src == "http://127.0.0.1:3000/Projects/Project%202%20(Spotify%20Clone)/img/volume.svg"){
            e.target.src="http://127.0.0.1:3000/Projects/Project%202%20(Spotify%20Clone)/img/mute.svg"
            currentSong.volume=0;
            volumebar.value=0;
        }
        else{
            e.target.src="http://127.0.0.1:3000/Projects/Project%202%20(Spotify%20Clone)/img/volume.svg";
            currentSong.volume=0.1;
            volumebar.value=10;
        }
    })

    //Load playlist when card is clicked
    // Array.from(document.querySelector(".card")).forEach(e=>{e.addEventListener('click', async item=>{
    //     console.log("hi")
    //     songs = await getsongs(`Songs/${item.currentTarget.dataset.folder}`)
    // })
    // })
   
    }


main() 
