import { titleCase } from '/scripts/functions.js';

const audio = document.getElementById('audio');
const sourceAudio = document.getElementById('source-audio');

const timer = document.getElementById('timer');
const title = document.getElementById('title');
const duration = document.getElementById('duration');

const progressBarContainer = document.querySelector('.progress');
const progressBar = document.getElementById('progress-bar');

const previousButton = document.getElementById('previous');
const rewindButton = document.getElementById('rewind');
const playPauseButton = document.getElementById('play-pause');
const forwardButton = document.getElementById('forward');
const nextButton = document.getElementById('next');
const toggleMuteButton = document.getElementById('toggle-mute');

const playlist = document.getElementById('playlist');

progressBarContainer.addEventListener('click', handleProgressBarClick);

audio.addEventListener('timeupdate', onTimeUpdate);
previousButton.addEventListener('click', previous);
rewindButton.addEventListener('click', rewind);
playPauseButton.addEventListener('click', toggleAudio);
forwardButton.addEventListener('click', forward);
nextButton.addEventListener('click', next);
toggleMuteButton.addEventListener('click', toggleMute);

/**
 * Creates a new track item
 * @param {string} category the category of the track
 * @param {number} index the index of the track
 * @param {string} name the name of the track
 * @param {string} duration the duration of the track
 */
function createTrackItem(category, index, name, duration) {
    const trackItem = document.createElement('div');
    trackItem.setAttribute('class', 'playlist-track');
    trackItem.setAttribute('id', `playlist-track-${category}-${index}`);
    trackItem.setAttribute('data-category', category);
    trackItem.setAttribute('data-index', index);
    playlist.appendChild(trackItem);

    const playButtonItem = document.createElement('div');
    playButtonItem.setAttribute('class', 'playlist-play');
    playButtonItem.setAttribute('id', `play-${category}-${index}`);
    document.getElementById(`playlist-track-${category}-${index}`).appendChild(playButtonItem);

    const buttonIcon = document.createElement('i');
    buttonIcon.setAttribute('class', 'player-icon fa-solid fa-play');
    buttonIcon.setAttribute('height', '40');
    buttonIcon.setAttribute('width', '40');
    buttonIcon.setAttribute('id', `player-icon-${category}-${index}`);
    document.getElementById(`play-${category}-${index}`).appendChild(buttonIcon);

    const trackInfoItem = document.createElement('div');
    trackInfoItem.setAttribute('class', 'playlist-info-track');
    trackInfoItem.textContent = name;
    document.getElementById(`playlist-track-${category}-${index}`).appendChild(trackInfoItem);

    const trackDurationItem = document.createElement('div');
    trackDurationItem.setAttribute('class', 'playlist-duration');
    trackDurationItem.textContent = duration;
    document.getElementById(`playlist-track-${category}-${index}`).appendChild(trackDurationItem);
}

// Don't question my music choices...
/* cSpell:disable */
const audioTracks = {
    general: [
        {
            name: 'Electroswing Revival - Gee',
            file: '/files/mp3-player/general/Electroswing Revival.mp3',
            duration: '3:03',
        },
        {
            name: "Yoshi's Lounge - KryptoDigital",
            file: "/files/mp3-player/general/Yoshi's Lounge.mp3",
            duration: '3:13',
        },
        {
            name: 'Cantina Band - John Williams',
            file: '/files/mp3-player/general/Cantina Band.mp3',
            duration: '13:13',
        },
        {
            name: 'Pink Panther Theme - Henry Mancini',
            file: '/files/mp3-player/general/Pink Panther Theme.mp3',
            duration: '2:41',
        },
        {
            name: 'Blue - Eiffel 65',
            file: '/files/mp3-player/general/Blue.mp3',
            duration: '3:48',
        },
        {
            name: "Thomas the Tank Engine Theme - Mike O'Donnell",
            file: '/files/mp3-player/general/Thomas the Tank Engine Theme.mp3',
            duration: '2:43',
        },
        {
            name: 'Scatman - Scatman John',
            file: '/files/mp3-player/general/Scatman.mp3',
            duration: '3:30',
        },
        {
            name: 'Mr. Blue Sky - Electric Light Orchestra',
            file: '/files/mp3-player/general/Mr. Blue Sky.mp3',
            duration: '4:54',
        },
        {
            name: 'crystal dolphin - engelwood',
            file: '/files/mp3-player/general/crystal dolphin.mp3',
            duration: '1:53',
        },
        {
            name: 'Pata Pata - Miriam Makeba (Matt Cherne Remix)',
            file: '/files/mp3-player/general/Pata Pata.mp3',
            duration: '1:11',
        },
        {
            name: 'sans. (015) - Toby Fox (Undertale OST)',
            file: '/files/mp3-player/general/sans.mp3',
            duration: '0:50',
        },
        {
            name: 'How Amusing! - Yasunori Nishiki (Octopath Traveler OST)',
            file: '/files/mp3-player/general/How Amusing!.mp3',
            duration: '3:17',
        },
        {
            name: 'Yakety Sax - Benny Hill',
            file: '/files/mp3-player/general/Yakety Sax.mp3',
            duration: '4:32',
        },
        {
            name: 'Y.M.C.A. - Village People',
            file: '/files/mp3-player/general/YMCA.mp3',
            duration: '3:39',
        },
        {
            name: 'Waluigi Pinball (Mario Kart DS) (Eurobeat Remix) - Dominic Ninmark',
            file: '/files/mp3-player/general/Waluigi Pinball.mp3',
            duration: '5:19',
        },
        {
            name: 'Wii Shop Channel (Remix) - Nicky Flowers',
            file: '/files/mp3-player/general/Wii Shop Channel.mp3',
            duration: '2:46',
        },
        {
            name: 'make a move - nelward',
            file: '/files/mp3-player/general/make a move.mp3',
            duration: '2:23',
        },
    ],
    hypixel: [
        {
            name: 'Nyny (Stereo Pants) - Unknown',
            file: '/files/mp3-player/hypixel/Nyny.mp3',
            duration: '2:12',
        },
        {
            name: 'Pump it Up (Stereo Pants) - Hyperdon',
            file: '/files/mp3-player/hypixel/Pump it Up.mp3',
            duration: '3:26',
        },
        {
            name: 'Flowering Nights (Stereo Pants) - Hyperdon',
            file: '/files/mp3-player/hypixel/Flowering Nights.mp3',
            duration: '2:11',
        },
        {
            name: 'Chased by Creeper (Stereo Pants) - Shinkonet',
            file: '/files/mp3-player/hypixel/Chased by Creeper.mp3',
            duration: '4:44',
        },
        {
            name: 'Gamemode8 (Stereo Pants) - Shinkonet',
            file: '/files/mp3-player/hypixel/Gamemode8.mp3',
            duration: '5:03',
        },
        {
            name: 'Original (Stereo Pants) - MusicByPedro',
            file: '/files/mp3-player/hypixel/Original (MusicByPedro).mp3',
            duration: '0:47',
        },
        {
            name: 'Red House (Stereo Pants) - Shinkonet',
            file: '/files/mp3-player/hypixel/Red House.mp3',
            duration: '4:03',
        },
        {
            name: 'Sky of Trees (Forest Island) - Shinkonet',
            file: '/files/mp3-player/hypixel/Sky of Trees.mp3',
            duration: '5:37',
        },
        {
            name: 'Dungeon Drama!! (Boss Theme 2) - Shinkonet',
            file: '/files/mp3-player/hypixel/Dungeon Drama.mp3',
            duration: '5:05',
        },
        {
            name: 'blastin banter battle (Battle of Jerry Mountain) - Shinkonet',
            file: '/files/mp3-player/hypixel/blastin banter battle.mp3',
            duration: '4:37',
        },
        {
            name: 'The Watcher (Dungeons Miniboss) - Shinkonet',
            file: '/files/mp3-player/hypixel/The Watcher.mp3',
            duration: '3:59',
        },
        {
            name: 'Ambient Caves (Deep Caverns) - Shinkonet',
            file: '/files/mp3-player/hypixel/Ambient Caves.mp3',
            duration: '3:09',
        },
        {
            name: 'Abstract Ringing (Wilderness) - Shinkonet',
            file: '/files/mp3-player/hypixel/Abstract Ringing.mp3',
            duration: '4:39',
        },
        {
            name: 'Let Them Eat Cake (Winter Island Theme) - Shinkonet',
            file: '/files/mp3-player/hypixel/Let Them Eat Cake.mp3',
            duration: '3:28',
        },
        {
            name: 'Hallow Hallow (Halloween Event) - Shinkonet',
            file: '/files/mp3-player/hypixel/Hallow Hallow.mp3',
            duration: '3:58',
        },
        {
            name: "Dark and Seedy (Dante's Theme) - Shinkonet",
            file: '/files/mp3-player/hypixel/Dark and Seedy.mp3',
            duration: '5:57',
        },
        {
            name: "Dark and Seedy (Pre-Uprising Version) (Dante's Theme 2) - Shinkonet",
            file: '/files/mp3-player/hypixel/Dark and Seedy (Pre-Uprising Version).mp3',
            duration: '7:23',
        },
        {
            name: 'Breathless Encounter (Dante Uprising / Revolt Theme) - Shinkonet',
            file: '/files/mp3-player/hypixel/Breathless Encounter.mp3',
            duration: '2:40',
        },
        {
            name: 'Dwarven Mines - Shinkonet',
            file: '/files/mp3-player/hypixel/Dwarven Mines.mp3',
            duration: '3:38',
        },
        {
            name: 'Journey in the Sky (Spider Den) - Shinkonet',
            file: '/files/mp3-player/hypixel/Journey in the Sky.mp3',
            duration: '6:16',
        },
        {
            name: 'Necron Doom (Boss Theme 3) - Shinkonet',
            file: '/files/mp3-player/hypixel/Necron Doom.mp3',
            duration: '4:45',
        },
        {
            name: 'Light From Afar (Farming Island) - Shinkonet',
            file: '/files/mp3-player/hypixel/Light From Afar.mp3',
            duration: '3:40',
        },
        {
            name: 'Mythic Warfare (Enderdragon Boss) - Shinkonet',
            file: '/files/mp3-player/hypixel/Mythic Warfare.mp3',
            duration: '5:22',
        },
        {
            name: 'Going Even Deeper (Crystal Hollows) - Shinkonet',
            file: '/files/mp3-player/hypixel/Going Even Deeper.mp3',
            duration: '2:35',
        },
        {
            name: 'The Wither King (Boss Theme 4) - Shinkonet',
            file: '/files/mp3-player/hypixel/The Wither King.mp3',
            duration: '5:51',
        },
        {
            name: 'Lava Kraken (Kuudra Fight) - Shinkonet',
            file: '/files/mp3-player/hypixel/Lava Kraken.mp3',
            duration: '5:16',
        },
        {
            name: 'Blockjitsu (Nether Dojo) - Shinkonet',
            file: '/files/mp3-player/hypixel/Blockjitsu.mp3',
            duration: '4:40',
        },
        {
            name: 'Magetown (Scarleton) - Shinkonet',
            file: '/files/mp3-player/hypixel/Magetown.mp3',
            duration: '6:19',
        },
        {
            name: 'Fires of Fishermen (Volcano, Crimson Isle) - Shinkonet',
            file: '/files/mp3-player/hypixel/Fires of Fishermen.mp3',
            duration: '5:51',
        },
        {
            name: 'Forsaken Village (Dragontail, Crimson Isle) - Shinkonet',
            file: '/files/mp3-player/hypixel/Forsaken Village.mp3',
            duration: '3:08',
        },
        {
            name: 'Always Nether (Crimson Isle) - Shinkonet',
            file: '/files/mp3-player/hypixel/Always Nether.mp3',
            duration: '3:53',
        },
    ],
};
/* cSpell:enable */

Object.keys(audioTracks).forEach((key) => {
    const sectionTitleLink = document.createElement('a');
    sectionTitleLink.href = `#${key.replace(/_/g, '-')}`;

    const sectionTitle = document.createElement('div');
    sectionTitle.setAttribute('class', 'playlist-section-title');
    sectionTitle.setAttribute('id', key.replace(/_/g, '-'));
    sectionTitle.textContent = key === 'hypixel' ? 'Hypixel (SkyBlock) OST/BGM' : titleCase(key.replace(/_/g, ' '));

    sectionTitleLink.appendChild(sectionTitle);
    playlist.appendChild(sectionTitleLink);

    audioTracks[key].forEach((track, index) => {
        createTrackItem(key, index, track.name, track.duration);
    });
});

let audioCategory = 'general';
let audioIndex = 0;

/**
 * Loads a new track
 * @param {string} category the category of the track
 * @param {number} index the index of the track
 */
function loadNewTrack(category, index) {
    sourceAudio.src = audioTracks[category][index].file;
    title.innerHTML = audioTracks[category][index].name;
    audio.load();
    toggleAudio();
    updateActiveTrackStyle(audioCategory, audioIndex, category, index);
    audioCategory = category;
    audioIndex = index;
}

const playListItems = document.querySelectorAll('.playlist-track');

for (let i = 0; i < playListItems.length; i++) {
    playListItems[i].addEventListener('click', loadClickedTrack);
}

/**
 * Loads the clicked track
 * @param {MouseEvent} event the click event
 */
function loadClickedTrack(event) {
    for (let i = 0; i < playListItems.length; i++) {
        if (playListItems[i] === event.target) {
            const clickedCategory = event.target.getAttribute('data-category');
            const clickedIndex = event.target.getAttribute('data-index');
            if (clickedCategory === audioCategory && clickedIndex === audioIndex) toggleAudio();
            else loadNewTrack(clickedCategory, clickedIndex);
        }
    }
}

sourceAudio.src = audioTracks[audioCategory][audioIndex].file;
title.textContent = audioTracks[audioCategory][audioIndex].name;

audio.load();

audio.addEventListener('loadedmetadata', () => {
    duration.textContent = getMinutes(audio.duration);
});

/**
 * Toggles the audio's play state
 */
function toggleAudio() {
    if (audio.paused) {
        playPauseButton.classList.remove('fa-play');
        playPauseButton.classList.add('fa-pause');
        document.getElementById(`playlist-track-${audioCategory}-${audioIndex}`).classList.add('active-track');
        playToPause(audioCategory, audioIndex);
        audio.play();
    } else {
        playPauseButton.classList.add('fa-play');
        playPauseButton.classList.remove('fa-pause');
        pauseToPlay(audioCategory, audioIndex);
        audio.pause();
    }
}

/**
 * Updates the progress bar
 */
function onTimeUpdate() {
    timer.textContent = getMinutes(audio.currentTime);
    setBarProgress();
    if (audio.ended) {
        playPauseButton.classList.add('fa-play');
        playPauseButton.classList.remove('fa-pause');
        pauseToPlay(audioCategory, audioIndex);
        if (audioIndex < audioTracks[audioCategory].length - 1) loadNewTrack(audioCategory, parseInt(audioIndex) + 1);
    }
}

/**
 * Sets the progress bar
 */
function setBarProgress() {
    progressBar.style.width = (audio.currentTime / audio.duration) * 100 + '%';
}

/**
 * Gets the minutes from a time in seconds
 * @param {number} time the time
 * @returns {string} the minutes and seconds
 */
function getMinutes(time) {
    const min = parseInt(time / 60)
        .toString()
        .padStart(2, '0');
    const sec = parseInt(time % 60)
        .toString()
        .padStart(2, '0');

    return `${min}:${sec}`;
}

/**
 * Updates the progress bar and audio time
 * @param {MouseEvent} event the click event
 */
function handleProgressBarClick(event) {
    const percent = event.offsetX / progressBarContainer.offsetWidth;
    audio.currentTime = percent * audio.duration;
    progressBar.style.width = percent * 100 + '%';
}

/**
 * Increases the audio's current time by 5 seconds
 */
function forward() {
    audio.currentTime = audio.currentTime + 5;
    setBarProgress();
}

/**
 * Rewinds the audio's current time by 5 seconds
 */
function rewind() {
    audio.currentTime = audio.currentTime - 5;
    setBarProgress();
}

/**
 * Switches to the next song
 */
function next() {
    if (audioIndex < audioTracks[audioCategory].length - 1) {
        const oldIndex = audioIndex;
        audioIndex++;
        updateActiveTrackStyle(audioCategory, oldIndex, audioCategory, audioIndex);
        loadNewTrack(audioCategory, audioIndex);
    }
}

/**
 * Switches to the previous song
 */
function previous() {
    if (audioIndex > 0 && audioTracks[audioCategory].length > 0) {
        const oldIndex = audioIndex;
        audioIndex--;
        updateActiveTrackStyle(audioCategory, oldIndex, audioCategory, audioIndex);
        loadNewTrack(audioCategory, audioIndex);
    }
}

/**
 * Updates the current track style
 * @param {string} oldCategory the category of the old track
 * @param {number} oldIndex the index of the old track
 * @param {string} newCategory the category of the new track
 * @param {number} newIndex the index of the new track
 */
function updateActiveTrackStyle(oldCategory, oldIndex, newCategory, newIndex) {
    document.getElementById(`playlist-track-${oldCategory}-${oldIndex}`).classList.remove('active-track');
    pauseToPlay(oldCategory, oldIndex);
    document.getElementById(`playlist-track-${newCategory}-${newIndex}`).classList.add('active-track');
    playToPause(newCategory, newIndex);
}

/**
 * Pauses the playing audio
 * @param {string} category the category of the track
 * @param {number} index the index of the track
 */
function playToPause(category, index) {
    const element = document.getElementById(`player-icon-${category}-${index}`);
    element.classList.remove('fa-play');
    element.classList.add('fa-pause');
}

/**
 * Plays the paused audio
 * @param {string} category the category of the track
 * @param {number} index the index of the track
 */
function pauseToPlay(category, index) {
    const element = document.getElementById(`player-icon-${category}-${index}`);
    element.classList.add('fa-play');
    element.classList.remove('fa-pause');
}

/**
 * Toggles the audio's mute state
 */
function toggleMute() {
    if (audio.muted === false) {
        audio.muted = true;
        toggleMuteButton.classList.add('fa-volume-mute');
        toggleMuteButton.classList.remove('fa-volume-up');
    } else {
        audio.muted = false;
        toggleMuteButton.classList.remove('fa-volume-mute');
        toggleMuteButton.classList.add('fa-volume-up');
    }
}

window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        toggleAudio();
    }
    if (event.code === 'ArrowRight') {
        event.preventDefault();
        forward();
    }
    if (event.code === 'ArrowLeft') {
        event.preventDefault();
        rewind();
    }
    if (event.code === 'ArrowUp') {
        event.preventDefault();
        previous();
    }
    if (event.code === 'ArrowDown') {
        event.preventDefault();
        next();
    }
    if (event.code === 'KeyM') {
        event.preventDefault();
        toggleMute();
    }
});
