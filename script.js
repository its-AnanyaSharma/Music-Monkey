console.log('Lets write JavaScript');
let currentSong = new Audio();
let songs;
let currFolder;


function formatTime(seconds) {
    if (isNaN(seconds)|| seconds < 0){
        return "00:00";
    }
    // Calculate the minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds =  Math.floor(seconds % 60);
    
    // Format the remaining seconds to always have two digits
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    // Combine minutes and formatted seconds
    return `${minutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
   let response = await fetch(`https://github.com/its-AnanyaSharma/Music-Monkey/tree/main/songs/${folder}/`);
    let text = await response.text();
    let div = document.createElement("div");
    div.innerHTML = text;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    // Show all the songs in the playlist
    let songUL = document.querySelector(".songList ul")
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <div class="songPlay">
        <img src="svgs/music.svg">
             <div class="info">
            
            <div>${song.replaceAll("%20", " ")}</div>
                
            </div>
                <div class="playNow">
                    <h6>Play Now</h6>
                    <img src="svgs/play-grey.svg">
                   
                </div>
        </div>
    </li>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })

    return songs;
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "svgs/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"


}

async function displayAlbums() {
    try {
        let response = await fetch('https://raw.githubusercontent.com/its-AnanyaSharma/huraaayy/main/songs');
        let text = await response.text();
        let div = document.createElement("div");
        div.innerHTML = text;
        let anchor = div.getElementsByTagName("a");
        let allcards = document.querySelector(".allcards");
        let array = Array.from(anchor);
        
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
                let folder = e.href.split("/").slice(-2)[0];
                let infoResponse = await fetch(`https://raw.githubusercontent.com/its-AnanyaSharma/huraaayy/main/songs/${folder}/info.json`);
                let json = await infoResponse.json();
                allcards.innerHTML += `<div data-folder="${folder}" class="card border">
                    <img src="https://raw.githubusercontent.com/its-AnanyaSharma/huraaayy/main/songs/${folder}/cover.jpg">
                    <div class="play-button">
                        <img src="https://raw.githubusercontent.com/its-AnanyaSharma/huraaayy/main/songs/${folder}/play-green.svg" alt="Play Icon">
                    </div>
                    <h3>${json.title}</h3>
                    <p>${json.description}</p>
                </div>`;
            }
        }

        // Load the playlist whenever a card is clicked
        Array.from(document.getElementsByClassName("card")).forEach(e => { 
            e.addEventListener("click", async item => {
                if (document.querySelector(".left").style.left === "-100%") {
                    document.querySelector(".left").style.left = "0";
                }
                console.log("Fetching Songs");
                songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
                playMusic(songs[0]);
            });
        });
    } catch (error) {
        console.error('Error fetching albums:', error);
    }
}



async function main() {
    // Get the list of all the songs
    await getSongs("songs/happy/${}")
    playMusic(songs[0], true)

    // Display all the albums on the page
    await displayAlbums()



    // Attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "svgs/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "svgs/play.svg"
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/
        ${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
       
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })

    // Add an event listener to previous
    prev.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

}

main() 
