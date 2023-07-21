import { AudioCategory, AudioTrack, audioTracks } from '../../../data/audio-tracks.js';
import { shuffleArray } from '../../functions.js';

const tracksByCategory = Object.fromEntries(audioTracks.map((category) => [category.id, category]));

const audio = document.getElementById('audio') as HTMLAudioElement;
const sourceAudio = document.getElementById('source-audio') as HTMLSourceElement;

const timer = document.getElementById('timer') as HTMLDivElement;
const title = document.getElementById('title') as HTMLDivElement;
const duration = document.getElementById('duration') as HTMLDivElement;

const progressBarContainer = document.querySelector('.progress') as HTMLDivElement;
const progressBar = document.getElementById('progress-bar') as HTMLDivElement;

const toggleShuffleButton = document.getElementById('toggle-shuffle') as HTMLSpanElement;
const shuffleStatusIcon = document.getElementById('shuffle-status')!;
const previousButton = document.getElementById('previous')!;
const rewindButton = document.getElementById('rewind')!;
const playPauseButton = document.getElementById('play-pause')!;
const forwardButton = document.getElementById('forward')!;
const nextButton = document.getElementById('next')!;
const toggleMuteButton = document.getElementById('toggle-mute')!;

const playlistsList = document.getElementById('playlists-list') as HTMLUListElement;

const playlist = document.getElementById('playlist') as HTMLDivElement;

progressBarContainer.addEventListener('click', handleProgressBarClick);

audio.addEventListener('loadedmetadata', () => {
    duration.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', onTimeUpdate);

toggleShuffleButton.addEventListener('click', toggleShuffle);
previousButton.addEventListener('click', previous);
rewindButton.addEventListener('click', rewind);
playPauseButton.addEventListener('click', toggleAudio);
forwardButton.addEventListener('click', forward);
nextButton.addEventListener('click', next);
toggleMuteButton.addEventListener('click', toggleMute);

/**
 * Creates a new track item.
 * @param category The category of the track.
 * @param index The index of the track.
 * @param track The track item.
 */
function createTrackItem(category: AudioCategory, index: number, track: AudioTrack) {
    const trackItem = document.createElement('div');
    trackItem.classList.add('playlist-track');
    trackItem.id = `playlist-track-${category.id}-${index}`;
    trackItem.dataset.category = category.id;
    trackItem.dataset.index = index.toString();

    const playButtonItem = document.createElement('div');
    playButtonItem.classList.add('playlist-play');
    playButtonItem.id = `play-${category.id}-${index}`;

    const buttonIcon = document.createElement('i');
    buttonIcon.classList.add('player-icon', 'fa-solid', 'fa-play');
    buttonIcon.setAttribute('height', '40');
    buttonIcon.setAttribute('width', '40');
    buttonIcon.id = `player-icon-${category.id}-${index}`;

    playButtonItem.appendChild(buttonIcon);
    trackItem.appendChild(playButtonItem);

    const trackInfoItem = document.createElement('div');
    trackInfoItem.classList.add('playlist-info-track');
    trackInfoItem.textContent = track.name;

    trackItem.appendChild(trackInfoItem);

    const trackDurationItem = document.createElement('div');
    trackDurationItem.classList.add('playlist-duration');
    trackDurationItem.textContent = track.duration;

    trackItem.appendChild(trackDurationItem);
    playlist.appendChild(trackItem);
}

audioTracks.forEach((category) => {
    const sectionTitle = document.createElement('div');
    sectionTitle.classList.add('playlist-section-title');
    sectionTitle.id = category.id;

    const sectionTitleLink = document.createElement('a');
    sectionTitleLink.href = `#${category.id}`;
    sectionTitleLink.textContent = category.name;

    const playSectionButton = document.createElement('i');
    playSectionButton.classList.add('player-icon', 'fa-solid', 'fa-shuffle');

    sectionTitle.appendChild(sectionTitleLink);
    sectionTitle.appendChild(playSectionButton);
    playlist.appendChild(sectionTitle);

    const playlistsListItem = document.createElement('li');

    const playlistsListItemLink = document.createElement('a');
    playlistsListItemLink.href = `#${category.id}`;
    playlistsListItemLink.textContent = category.name;

    playlistsListItem.appendChild(playlistsListItemLink);

    playlistsList.appendChild(playlistsListItem);

    category.tracks.forEach((track, index) => createTrackItem(category, index, track));
});

document.querySelectorAll('.playlist-section-title > i.player-icon').forEach((playButton) => {
    playButton.addEventListener('click', () => shuffleSection(playButton.parentElement!.id));
});

let audioCategory = 'general';
let audioIndex = 0;

/**
 * Loads a new track.
 * @param category The category of the track.
 * @param index The index of the track.
 * @param play Whether to play the track (defaults to `true`).
 */
function loadNewTrack(category: string, index: number, play = true) {
    const track = tracksByCategory[category].tracks[index];
    sourceAudio.src = `https://raw.githubusercontent.com/Eejit43/eejitstools-v2-files/main/files/mp3-player/${category}/${track.file}.mp3`;
    title.textContent = track.name;
    audio.load();
    if (play) toggleAudio();
    updateActiveTrackStyle(audioCategory, audioIndex, category, index, play);
    audioCategory = category;
    audioIndex = index;
}

for (const track of document.querySelectorAll('.playlist-track')) track.addEventListener('click', loadClickedTrack as EventListener);

/**
 * Loads the clicked track.
 * @param event The click event.
 */
function loadClickedTrack(event: MouseEvent) {
    shuffled = false;
    shuffledQueue = [];
    shuffleStatusIcon.classList.remove('fa-check');
    shuffleStatusIcon.classList.add('fa-xmark');

    const { category, index } = (event.target as HTMLElement).dataset as { category: string; index: string };
    if (category === audioCategory && parseInt(index) === audioIndex) toggleAudio();
    else loadNewTrack(category, parseInt(index));
}

loadNewTrack(audioCategory, audioIndex, false);

/**
 * Toggles the audio's play state.
 */
function toggleAudio() {
    if (audio.paused) {
        playPauseButton.classList.remove('fa-play');
        playPauseButton.classList.add('fa-pause');
        document.getElementById(`playlist-track-${audioCategory}-${audioIndex}`)?.classList.add('active-track');
        pauseToPlay(audioCategory, audioIndex);
        audio.play();
    } else {
        playPauseButton.classList.add('fa-play');
        playPauseButton.classList.remove('fa-pause');
        playToPause(audioCategory, audioIndex);
        audio.pause();
    }
}

interface AudioTrackWithIndex extends AudioTrack {
    index: number;
}

let shuffledQueue: AudioTrackWithIndex[] = [];

/**
 * Shuffles an audio section.
 * @param category The section category to shuffle.
 */
function shuffleSection(category: string) {
    const oldCategory = audioCategory,
        oldIndex = audioIndex;

    shuffled = true;
    shuffleStatusIcon.classList.remove('fa-xmark');
    shuffleStatusIcon.classList.add('fa-check');
    if (!audio.paused) {
        playPauseButton.classList.add('fa-play');
        playPauseButton.classList.remove('fa-pause');
        playToPause(audioCategory, audioIndex);
        audio.pause();
    }
    audioCategory = category;

    const tracks = tracksByCategory[category].tracks.map((track, index) => ({ ...track, index })) as AudioTrackWithIndex[];
    shuffledQueue = shuffleArray(tracks) as AudioTrackWithIndex[];

    audioIndex = tracks[0].index;

    updateActiveTrackStyle(oldCategory, oldIndex, audioCategory, audioIndex, false);

    loadNewTrack(audioCategory, audioIndex, true);

    shuffledQueue.shift();
}

/**
 * Updates the progress bar.
 */
function onTimeUpdate() {
    timer.textContent = formatTime(audio.currentTime);
    setBarProgress();
    if (audio.ended) {
        playPauseButton.classList.add('fa-play');
        playPauseButton.classList.remove('fa-pause');
        playToPause(audioCategory, audioIndex);

        if (shuffled && shuffledQueue.length > 0) {
            const nextTrack = shuffledQueue.shift()!;
            loadNewTrack(audioCategory, nextTrack.index);
        } else if (audioIndex < tracksByCategory[audioCategory].tracks.length - 1) loadNewTrack(audioCategory, audioIndex + 1);
    }
}

/**
 * Sets the progress bar.
 */
function setBarProgress() {
    progressBar.style.width = ((audio.currentTime / audio.duration) * 100).toString() + '%';
}

/**
 * Formats the time in seconds to minutes and seconds.
 * @param time The time.
 */
function formatTime(time: number) {
    const minutes = Math.floor(time / 60)
        .toString()
        .padStart(1, '0');
    const seconds = Math.floor(time % 60)
        .toString()
        .padStart(2, '0');

    return `${minutes}:${seconds}`;
}

/**
 * Updates the progress bar and audio time.
 * @param event The click event.
 */
function handleProgressBarClick(event: MouseEvent) {
    const percent = event.offsetX / progressBarContainer.offsetWidth;
    audio.currentTime = percent * audio.duration;
    progressBar.style.width = (percent * 100).toString() + '%';
}

/**
 * Increases the audio's current time by 5 seconds.
 */
function forward() {
    audio.currentTime = audio.currentTime + 5;
    setBarProgress();
}

/**
 * Rewinds the audio's current time by 5 seconds.
 */
function rewind() {
    audio.currentTime = audio.currentTime - 5;
    setBarProgress();
}

/**
 * Switches to the next song.
 */
function next() {
    if (shuffled) return loadNewTrack(audioCategory, Math.floor(Math.random() * tracksByCategory[audioCategory].tracks.length));
    if (audioIndex < tracksByCategory[audioCategory].tracks.length - 1) {
        const oldIndex = audioIndex;
        audioIndex++;
        updateActiveTrackStyle(audioCategory, oldIndex, audioCategory, audioIndex);
        loadNewTrack(audioCategory, audioIndex);
    }
}

/**
 * Switches to the previous song.
 */
function previous() {
    if (audioIndex > 0 && tracksByCategory[audioCategory].tracks.length > 0) {
        const oldIndex = audioIndex;
        audioIndex--;
        updateActiveTrackStyle(audioCategory, oldIndex, audioCategory, audioIndex);
        loadNewTrack(audioCategory, audioIndex);
    }
}

/**
 * Updates the current track style.
 * @param oldCategory The category of the old track.
 * @param oldIndex The index of the old track.
 * @param newCategory The category of the new track.
 * @param newIndex The index of the new track.
 * @param play Whether or not to mark the new track as playing (defaults to `true`).
 */
function updateActiveTrackStyle(oldCategory: string, oldIndex: number, newCategory: string, newIndex: number, play = true) {
    document.getElementById(`playlist-track-${oldCategory}-${oldIndex}`)?.classList.remove('active-track');
    if (play) playToPause(oldCategory, oldIndex);
    document.getElementById(`playlist-track-${newCategory}-${newIndex}`)?.classList.add('active-track');
    if (play) pauseToPlay(newCategory, newIndex);
}

let shuffled = false;

/**
 * Toggles shuffle mode.
 */
function toggleShuffle() {
    if (shuffled) {
        shuffled = false;
        shuffledQueue = [];
        shuffleStatusIcon.classList.remove('fa-check');
        shuffleStatusIcon.classList.add('fa-xmark');
    } else {
        shuffled = true;
        const tracks = tracksByCategory[audioCategory].tracks.map((track, index) => ({ ...track, index }));
        shuffledQueue = shuffleArray(tracks) as AudioTrackWithIndex[];
        shuffleStatusIcon.classList.remove('fa-xmark');
        shuffleStatusIcon.classList.add('fa-check');
    }
}

/**
 * Marks the icon of a track as playing.
 * @param category The category of the track.
 * @param index The index of the track.
 */
function pauseToPlay(category: string, index: number) {
    const element = document.getElementById(`player-icon-${category}-${index}`)!;
    element.classList.remove('fa-play');
    element.classList.add('fa-pause');
}

/**
 * Marks the icon of a track as paused.
 * @param category The category of the track.
 * @param index The index of the track.
 */
function playToPause(category: string, index: number) {
    const element = document.getElementById(`player-icon-${category}-${index}`)!;
    element.classList.add('fa-play');
    element.classList.remove('fa-pause');
}

/**
 * Toggles the audio's mute state.
 */
function toggleMute() {
    if (audio.muted === false) {
        audio.muted = true;
        toggleMuteButton.classList.remove('fa-volume-up');
        toggleMuteButton.classList.add('fa-volume-mute');
    } else {
        audio.muted = false;
        toggleMuteButton.classList.remove('fa-volume-mute');
        toggleMuteButton.classList.add('fa-volume-up');
    }
}

document.addEventListener('keydown', (event) => {
    if ((document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) || event.ctrlKey || event.metaKey || event.altKey) return; // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing

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
