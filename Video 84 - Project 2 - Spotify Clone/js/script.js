console.log("Spotify Clone Started");

let currentSong = new Audio();

let songs = [];
let currFolder = "";
let currentSongIndex = -1;


// ======================================================
// ELEMENTS
// ======================================================

const playButton = document.querySelector("#play");
const previousButton = document.querySelector("#previous");
const nextButton = document.querySelector("#next");

const songInfo = document.querySelector(".songinfo");
const songTime = document.querySelector(".songtime");

const songList = document.querySelector(".songList ul");
const cardContainer = document.querySelector(".cardContainer");

const seekbar = document.querySelector(".seekbar");
const circle = document.querySelector(".circle");


// ======================================================
// TIME FORMAT
// ======================================================

function secondsToMinutesSeconds(seconds) {

    if (
        isNaN(seconds) ||
        seconds < 0 ||
        !isFinite(seconds)
    ) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}


// ======================================================
// GET SONGS FROM ALBUM
// ======================================================

async function getSongs(folder, songFiles) {

    songs = songFiles;
    currFolder = folder;
    currentSongIndex = -1;

    // Stop currently playing song
    currentSong.pause();
    currentSong.currentTime = 0;
    currentSong.src = "";

    // Reset player
    playButton.src = "./img/play.svg";
    songInfo.innerHTML = "";
    songTime.innerHTML = "00:00 / 00:00";
    circle.style.left = "0%";

    // Clear previous song list
    songList.innerHTML = "";

    // If album has no songs
    if (!songs || songs.length === 0) {
        songList.innerHTML = `
            <li>
                <div class="info">
                    <div>No songs found</div>
                    <div>This album is empty</div>
                </div>
            </li>
        `;

        return;
    }


    // ==================================================
    // DISPLAY SONGS
    // ==================================================

    songs.forEach((song) => {

        songList.innerHTML += `
            <li>

                <img
                    src="./img/music.svg"
                    alt="Music"
                >

                <div class="info">

                    <div>
                        ${song.replace(/\.mp3$/i, "")}
                    </div>

                    <div>
                        Spotify Clone
                    </div>

                </div>

                <div class="playnow">

                    <span>
                        Play Now
                    </span>

                    <img
                        src="./img/play.svg"
                        alt="Play"
                    >

                </div>

            </li>
        `;

    });


    // ==================================================
    // ADD CLICK EVENTS TO SONGS
    // ==================================================

    const songItems =
        document.querySelectorAll(".songList li");

    songItems.forEach((item, index) => {

        item.addEventListener("click", () => {

            playMusic(index);

        });

    });

}


// ======================================================
// PLAY MUSIC
// ======================================================

function playMusic(index) {

    if (
        index < 0 ||
        index >= songs.length
    ) {
        return;
    }


    currentSongIndex = index;


    const track = songs[index];


    console.log(
        "Playing song:",
        track
    );


    console.log(
        "Folder:",
        currFolder
    );


    // ==================================================
    // CREATE SONG URL
    // ==================================================

    const songURL =
        `./songs/${currFolder}/${encodeURIComponent(track)}`;


    console.log(
        "Song URL:",
        songURL
    );


    // ==================================================
    // SET AUDIO SOURCE
    // ==================================================

    currentSong.src = songURL;


    // ==================================================
    // DISPLAY SONG NAME
    // ==================================================

    songInfo.innerHTML =
        track.replace(/\.mp3$/i, "");


    songTime.innerHTML =
        "00:00 / 00:00";


    circle.style.left =
        "0%";


    // ==================================================
    // PLAY SONG
    // ==================================================

    currentSong
        .play()
        .then(() => {

            playButton.src =
                "./img/pause.svg";

        })
        .catch((error) => {

            console.error(
                "Unable to play song:",
                error
            );

            playButton.src =
                "./img/play.svg";

        });

}


// ======================================================
// DISPLAY ALBUMS
// ======================================================

async function displayAlbums() {

    try {

        console.log(
            "Loading music.json..."
        );


        // ==================================================
        // LOAD MUSIC JSON
        // ==================================================

        const response =
            await fetch("./songs/music.json");


        if (!response.ok) {

            throw new Error(
                `music.json could not be loaded. Status: ${response.status}`
            );

        }


        const albums =
            await response.json();


        console.log(
            "Albums loaded:",
            albums
        );


        // ==================================================
        // CLEAR ALBUMS
        // ==================================================

        cardContainer.innerHTML = "";


        // ==================================================
        // CREATE ALBUM CARDS
        // ==================================================

        albums.forEach(album => {

            cardContainer.innerHTML += `

                <div
                    class="card"
                    data-folder="${album.folder}"
                >

                    <div class="play">

                        <img
                            src="./img/play.svg"
                            alt="Play"
                        >

                    </div>


                    <img
                        src="./songs/${album.folder}/${album.cover}"
                        alt="${album.title}"
                    >


                    <h2>
                        ${album.title}
                    </h2>


                    <p>
                        ${album.description}
                    </p>

                </div>

            `;

        });


        // ==================================================
        // ALBUM CLICK EVENTS
        // ==================================================

        document
            .querySelectorAll(".card")
            .forEach(card => {

                card.addEventListener(
                    "click",
                    () => {

                        const folder =
                            card.dataset.folder;


                        const album =
                            albums.find(
                                album =>
                                    album.folder === folder
                            );


                        if (!album) {

                            console.error(
                                "Album not found:",
                                folder
                            );

                            return;

                        }


                        console.log(
                            "Selected album:",
                            album.title
                        );


                        // Load songs
                        // without automatically playing
                        getSongs(
                            album.folder,
                            album.songs
                        );

                    }
                );

            });

    }

    catch (error) {

        console.error(
            "Error loading albums:",
            error
        );


        cardContainer.innerHTML = `

            <div class="error">

                <h2>
                    Unable to load albums
                </h2>

                <p>
                    Please check songs/music.json
                </p>

            </div>

        `;

    }

}


// ======================================================
// PLAY / PAUSE
// ======================================================

playButton.addEventListener(
    "click",
    () => {

        // No song selected
        if (!currentSong.src) {

            return;

        }


        // ==================================================
        // PLAY
        // ==================================================

        if (currentSong.paused) {

            currentSong
                .play()
                .then(() => {

                    playButton.src =
                        "./img/pause.svg";

                })
                .catch(error => {

                    console.error(
                        "Play error:",
                        error
                    );

                });

        }


        // ==================================================
        // PAUSE
        // ==================================================

        else {

            currentSong.pause();

            playButton.src =
                "./img/play.svg";

        }

    }
);


// ======================================================
// PREVIOUS
// ======================================================

previousButton.addEventListener(
    "click",
    () => {

        if (songs.length === 0) {

            return;

        }


        if (currentSongIndex > 0) {

            playMusic(
                currentSongIndex - 1
            );

        }

    }
);


// ======================================================
// NEXT
// ======================================================

nextButton.addEventListener(
    "click",
    () => {

        if (songs.length === 0) {

            return;

        }


        if (
            currentSongIndex <
            songs.length - 1
        ) {

            playMusic(
                currentSongIndex + 1
            );

        }

    }
);


// ======================================================
// AUTOMATICALLY PLAY NEXT SONG
// ======================================================

currentSong.addEventListener(
    "ended",
    () => {

        console.log(
            "Song ended"
        );


        if (
            currentSongIndex <
            songs.length - 1
        ) {

            playMusic(
                currentSongIndex + 1
            );

        }

        else {

            playButton.src =
                "./img/play.svg";

            circle.style.left =
                "0%";

        }

    }
);


// ======================================================
// TIME UPDATE
// ======================================================

currentSong.addEventListener(
    "timeupdate",
    () => {

        if (!currentSong.duration) {

            return;

        }


        const current =
            secondsToMinutesSeconds(
                currentSong.currentTime
            );


        const duration =
            secondsToMinutesSeconds(
                currentSong.duration
            );


        songTime.innerHTML =
            `${current} / ${duration}`;


        const percent =
            (
                currentSong.currentTime /
                currentSong.duration
            ) * 100;


        circle.style.left =
            `${percent}%`;

    }
);


// ======================================================
// SEEK
// ======================================================

seekbar.addEventListener(
    "click",
    (event) => {

        if (!currentSong.duration) {

            return;

        }


        const rect =
            seekbar.getBoundingClientRect();


        const percent =
            (
                (event.clientX - rect.left) /
                rect.width
            ) * 100;


        const safePercent =
            Math.max(
                0,
                Math.min(
                    100,
                    percent
                )
            );


        currentSong.currentTime =
            currentSong.duration *
            safePercent /
            100;


        circle.style.left =
            `${safePercent}%`;

    }
);


// ======================================================
// VOLUME
// ======================================================

const volumeSlider =
    document.querySelector(".range input");


const volumeIcon =
    document.querySelector(".volume img");


volumeSlider.addEventListener(
    "input",
    (event) => {

        const volume =
            Number(event.target.value) /
            100;


        currentSong.volume =
            volume;


        if (volume === 0) {

            volumeIcon.src =
                "./img/mute.svg";

        }

        else {

            volumeIcon.src =
                "./img/volume.svg";

        }

    }
);


// ======================================================
// MUTE
// ======================================================

volumeIcon.addEventListener(
    "click",
    () => {

        if (currentSong.volume > 0) {

            currentSong.volume =
                0;

            volumeSlider.value =
                0;

            volumeIcon.src =
                "./img/mute.svg";

        }

        else {

            currentSong.volume =
                0.1;

            volumeSlider.value =
                10;

            volumeIcon.src =
                "./img/volume.svg";

        }

    }
);


// ======================================================
// HAMBURGER
// ======================================================

const hamburger =
    document.querySelector(".hamburger");


if (hamburger) {

    hamburger.addEventListener(
        "click",
        () => {

            document.querySelector(
                ".left"
            ).style.left = "0";

        }
    );

}


// ======================================================
// CLOSE SIDEBAR
// ======================================================

const closeButton =
    document.querySelector(".close");


if (closeButton) {

    closeButton.addEventListener(
        "click",
        () => {

            document.querySelector(
                ".left"
            ).style.left = "-120%";

        }
    );

}


// ======================================================
// MAIN
// ======================================================

async function main() {

    console.log(
        "Initializing Spotify Clone..."
    );


    await displayAlbums();


    console.log(
        "Spotify Clone Ready!"
    );

}


main();