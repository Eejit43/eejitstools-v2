import { escapeHTML, showAlert } from '/scripts/functions.js';

const fileUploadButton = document.getElementById('file-upload');
const fileUploadMessage = document.getElementById('file-message');
const clearButton = document.getElementById('clear');
const outputTypePicker = document.getElementById('output-type');
const convertButton = document.getElementById('convert');
const convertingMessage = document.getElementById('converting-message');
const audioOutput = document.getElementById('audio-output');
const openConvertedResultLink = document.getElementById('open-converted-link');
const openConvertedResult = document.getElementById('open-converted-result');
const downloadConvertedResultLink = document.getElementById('download-converted-link');
const downloadConvertedResult = document.getElementById('download-converted-result');

/* Add event listeners */
fileUploadButton.addEventListener('change', () => {
    const file = fileUploadButton.files[0];

    if (file) {
        if (!file.type.startsWith('video/')) return showAlert('File must be a video!', 'error');
        fileUploadMessage.innerHTML = `Uploaded: <code>${escapeHTML(file.name)}</code>`;

        outputTypePicker.disabled = false;
        convertButton.disabled = false;
    } else {
        fileUploadMessage.textContent = '';

        outputTypePicker.disabled = true;
        convertButton.disabled = true;
    }
});
clearButton.addEventListener('click', () => {
    fileUploadButton.value = '';
    fileUploadMessage.textContent = '';
    outputTypePicker.disable = true;
    outputTypePicker.value = 'png';
    convertButton.disabled = true;
    convertingMessage.textContent = '';
    audioOutput.src = '';
    openConvertedResultLink.removeAttribute('href');
    openConvertedResult.disabled = true;
    downloadConvertedResultLink.removeAttribute('href');
    downloadConvertedResultLink.removeAttribute('download');
    downloadConvertedResult.disabled = true;

    clearButton.disabled = true;
    clearButton.textContent = 'Cleared!';
    showAlert('Cleared!', 'success');

    setTimeout(() => {
        clearButton.disabled = false;
        clearButton.textContent = 'Clear';
    }, 2000);
});
convertButton.addEventListener('click', convert);

/**
 * Converts and displays the image
 */
async function convert() {
    convertingMessage.innerHTML = '<br />Converting... <i class="fa-solid fa-spinner fa-pulse"></i>';
    convertButton.disabled = true;

    const blob = fileUploadButton.files[0];
    const result = await convertVideoToAudio(blob, `audio/${outputTypePicker.value}`).catch(() => {
        convertingMessage.textContent = '';
        convertButton.disabled = false;
        return showAlert('Failed to convert video!', 'error');
    });

    audioOutput.src = result;
    openConvertedResultLink.href = downloadConvertedResultLink.href = result;
    openConvertedResult.disabled = downloadConvertedResult.disabled = false;
    downloadConvertedResultLink.download = `${fileUploadButton.files[0].name.replace(/\.[^/.]+$/, '') || 'download'}.${outputTypePicker.value}`;

    convertingMessage.textContent = '';
    convertButton.disabled = false;
}

/**
 * Converts video to target audio format
 * @param {File} videoFileData video file data
 * @param {string} targetFormat output target format
 * @returns {Promise<Blob>} output blob url
 * @see https://github.com/suvro404/video-to-audio/blob/main/index.js
 */
function convertVideoToAudio(videoFileData, targetFormat) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(videoFileData);
    return new Promise((resolve) => {
        reader.addEventListener('load', () => {
            const audioContext = new window.AudioContext();
            let myBuffer;
            const sampleRate = 16000;
            const numberOfChannels = 1;
            const videoFileAsBuffer = reader.result;
            audioContext.decodeAudioData(videoFileAsBuffer).then((decodedAudioData) => {
                const { duration } = decodedAudioData;
                const offlineAudioContext = new OfflineAudioContext(numberOfChannels, sampleRate * duration, sampleRate);
                const soundSource = offlineAudioContext.createBufferSource();
                myBuffer = decodedAudioData;
                soundSource.buffer = myBuffer;
                soundSource.connect(offlineAudioContext.destination);
                soundSource.start();
                offlineAudioContext.startRendering().then((renderedBuffer) => {
                    const UintWave = createWaveFileData(renderedBuffer);
                    const b64Data = btoa(uint8ToString(UintWave));
                    const blob = getBlobFromBase64Data(b64Data, targetFormat);
                    const blobUrl = URL.createObjectURL(blob);

                    resolve(blobUrl);
                });
            });
        });
    });
}

/**
 * Gets a blob from base64 data
 * @param {string} b64Data base64 data
 * @param {string} contentType output content type
 * @param {number} [sliceSize=512] size of slice
 * @returns {Blob} blob
 */
function getBlobFromBase64Data(b64Data, contentType, sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

/**
 * Create wave file data
 * @param {AudioBuffer} audioBuffer audio buffer
 * @returns {Uint8Array} wave file data
 */
function createWaveFileData(audioBuffer) {
    const frameLength = audioBuffer.length;
    const { numberOfChannels, sampleRate } = audioBuffer;
    const bitsPerSample = 16;
    const byteRate = (sampleRate * numberOfChannels * bitsPerSample) / 8;
    const blockAlign = (numberOfChannels * bitsPerSample) / 8;
    const wavDataByteLength = frameLength * numberOfChannels * 2;
    const headerByteLength = 44;
    const totalLength = headerByteLength + wavDataByteLength;

    const waveFileData = new Uint8Array(totalLength);

    const subChunk1Size = 16;
    const subChunk2Size = wavDataByteLength;
    const chunkSize = 4 + (8 + subChunk1Size) + (8 + subChunk2Size);

    writeString('RIFF', waveFileData, 0);
    writeInt32(chunkSize, waveFileData, 4);
    writeString('WAVE', waveFileData, 8);
    writeString('fmt ', waveFileData, 12);

    writeInt32(subChunk1Size, waveFileData, 16);
    writeInt16(1, waveFileData, 20);
    writeInt16(numberOfChannels, waveFileData, 22);
    writeInt32(sampleRate, waveFileData, 24);
    writeInt32(byteRate, waveFileData, 28);
    writeInt16(blockAlign, waveFileData, 32);
    writeInt32(bitsPerSample, waveFileData, 34);

    writeString('data', waveFileData, 36);
    writeInt32(subChunk2Size, waveFileData, 40);

    writeAudioBuffer(audioBuffer, waveFileData, 44);

    return waveFileData;
}

/**
 * Writes a string to a Uint8Array at the specified offset
 * @param {string} string the string to write
 * @param {Uint8Array} array the array to write to
 * @param {number} offset the offset to write at
 */
function writeString(string, array, offset) {
    for (let i = 0; i < string.length; ++i) {
        array[offset + i] = string.charCodeAt(i);
    }
}

/**
 * Writes an int16 to a Uint8Array at the specified offset
 * @param {number} number number to write
 * @param {Uint8Array} array the array to write to
 * @param {number} offset the offset to write at
 */
function writeInt16(number, array, offset) {
    number = Math.floor(number);

    const b1 = number & 255;
    const b2 = (number >> 8) & 255;

    array[offset + 0] = b1;
    array[offset + 1] = b2;
}

/**
 * Writes an int32 to a Uint8Array at the specified offset
 * @param {number} number number to write
 * @param {Uint8Array} array the array to write to
 * @param {number} offset the offset to write at
 */
function writeInt32(number, array, offset) {
    number = Math.floor(number);
    const b1 = number & 255;
    const b2 = (number >> 8) & 255;
    const b3 = (number >> 16) & 255;
    const b4 = (number >> 24) & 255;

    array[offset + 0] = b1;
    array[offset + 1] = b2;
    array[offset + 2] = b3;
    array[offset + 3] = b4;
}

/**
 * Writes an audio buffer to a Uint8Array at the specified offset
 * @param {AudioBuffer} audioBuffer the audio buffer to write
 * @param {Uint8Array} array the array to write to
 * @param {number} offset the offset to write at
 */
function writeAudioBuffer(audioBuffer, array, offset) {
    const n = audioBuffer.length;
    const channels = audioBuffer.numberOfChannels;

    for (let i = 0; i < n; ++i) {
        for (let k = 0; k < channels; ++k) {
            const buffer = audioBuffer.getChannelData(k);
            let sample = buffer[i] * 32768.0;

            if (sample < -32768) sample = -32768;
            if (sample > 32767) sample = 32767;

            writeInt16(sample, array, offset);
            offset += 2;
        }
    }
}

/**
 * Writes a Uint8Array to string
 * @param {Uint8Array} uint8 the Uint8Array to write
 * @returns {string} the string
 */
function uint8ToString(uint8) {
    let out = '';
    for (let i = 0, { length } = uint8; i < length; i += 1) {
        out += String.fromCharCode(uint8[i]);
    }
    return out;
}
