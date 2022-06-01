import { audioTracks, audioTrackNames } from '/data/audio-tracks.js';

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

const playlistsList = document.getElementById('playlists-list');

const playlist = document.getElementById('playlist');

progressBarContainer.addEventListener('click', handleProgressBarClick);

audio.addEventListener('loadedmetadata', () => {
    duration.textContent = formatTime(audio.duration);
});

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

Object.keys(audioTracks).forEach((key) => {
    const sectionTitleLink = document.createElement('a');
    sectionTitleLink.href = `#${key.replace(/_/g, '-')}`;

    const sectionTitle = document.createElement('div');
    sectionTitle.setAttribute('class', 'playlist-section-title');
    sectionTitle.setAttribute('id', key.replace(/_/g, '-'));
    sectionTitle.textContent = audioTrackNames[key];

    sectionTitleLink.appendChild(sectionTitle);
    playlist.appendChild(sectionTitleLink);

    const playlistsListItem = document.createElement('li');

    const playlistsListItemLink = document.createElement('a');
    playlistsListItemLink.href = `#${key.replace(/_/g, '-')}`;
    playlistsListItemLink.textContent = audioTrackNames[key];

    playlistsListItem.appendChild(playlistsListItemLink);

    playlistsList.appendChild(playlistsListItem);

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
 * @param {boolean} [play=true] whether or not to play the track
 */
function loadNewTrack(category, index, play = true) {
    sourceAudio.src = `/files/mp3-player/${category}/${audioTracks[category][index].file}`;
    title.innerHTML = audioTracks[category][index].name;
    audio.load();
    if (play) toggleAudio();
    updateActiveTrackStyle(audioCategory, audioIndex, category, index, play);
    audioCategory = category;
    audioIndex = index;
}

const playlistItems = document.querySelectorAll('.playlist-track');

for (let i = 0; i < playlistItems.length; i++) {
    playlistItems[i].addEventListener('click', loadClickedTrack);
}

/**
 * Loads the clicked track
 * @param {MouseEvent} event the click event
 */
function loadClickedTrack(event) {
    for (let i = 0; i < playlistItems.length; i++) {
        if (playlistItems[i] === event.target) {
            const clickedCategory = event.target.getAttribute('data-category');
            const clickedIndex = event.target.getAttribute('data-index');
            if (clickedCategory === audioCategory && clickedIndex === audioIndex) toggleAudio();
            else loadNewTrack(clickedCategory, clickedIndex);
        }
    }
}

loadNewTrack(audioCategory, audioIndex, false);

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
    timer.textContent = formatTime(audio.currentTime);
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
 * Formats the time in seconds to minutes and seconds
 * @param {number} time the time
 * @returns {string} the minutes and seconds
 */
function formatTime(time) {
    const minutes = parseInt(time / 60)
        .toString()
        .padStart(1, '0');
    const seconds = parseInt(time % 60)
        .toString()
        .padStart(2, '0');

    return `${minutes}:${seconds}`;
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
 * @param {boolean} [play=true] whether or not to mark the track as playing
 */
function updateActiveTrackStyle(oldCategory, oldIndex, newCategory, newIndex, play = true) {
    document.getElementById(`playlist-track-${oldCategory}-${oldIndex}`).classList.remove('active-track');
    if (play) pauseToPlay(oldCategory, oldIndex);
    document.getElementById(`playlist-track-${newCategory}-${newIndex}`).classList.add('active-track');
    if (play) playToPause(newCategory, newIndex);
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
