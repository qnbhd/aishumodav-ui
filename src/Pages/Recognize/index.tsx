import { onCleanup } from 'solid-js';
import { createSignal } from 'solid-js';
import toast from 'solid-toast';
import WaveSurfer from 'wavesurfer.js';

import { AudioRecorder } from './recorder';
import { sendAudioToService } from './utils';

function downloadLinkOnClick(url: string, filename: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
}

export default function Recognize() {
    const [uploadedAudio, setUploadedAudio] = createSignal<Blob | null>(null);
    const [isPlayingOriginal, setIsPlayingOriginal] = createSignal(false);
    const [isPlayingCleaned, setIsPlayingCleaned] = createSignal(false);

    const recorder = new AudioRecorder();

    let wavesurfer: WaveSurfer | null = null;
    let wavesurferCleaned: WaveSurfer | null = null;

    onCleanup(() => recorder.stop());

    const sendRecording = () => {
        if (recorder.audioChunks().length === 0 && uploadedAudio() === null) {
            console.error('No audio to save.');
            return;
        }

        const audioBlob = recorder.lastAudioIssuer() === 'record' ? new Blob(recorder.audioChunks()) : uploadedAudio();

        if (!audioBlob) {
            console.error('No audio to save.');
            return;
        }

        sendAudioToService(audioBlob)
            .then(
                (
                    data:
                        | {
                              originalAudio: Blob;
                              cleanedAudio: Blob;
                              transcription: object;
                          }
                        | undefined,
                ) => {
                    if (!data) {
                        return;
                    }

                    const originalDownload = document.getElementById('cleaned-download');
                    const cleanedDownload = document.getElementById('cleaned-download');
                    const transcriptionDownload = document.getElementById('transcription-download');
                    document.getElementById('waveform')!.innerHTML = '';
                    document.getElementById('waveform-cleaned')!.innerHTML = '';

                    wavesurfer = WaveSurfer.create({
                        container: '#waveform',
                        waveColor: '#374151',
                        progressColor: '#641ae6',
                    });
                    wavesurferCleaned = WaveSurfer.create({
                        container: '#waveform-cleaned',
                        waveColor: '#374151',
                        progressColor: '#641ae6',
                    });

                    const originalUrl = URL.createObjectURL(data['originalAudio']);
                    wavesurfer.load(originalUrl);
                    originalDownload!.onclick = () => downloadLinkOnClick(originalUrl, 'original.wav');
                    const cleanedUrl = URL.createObjectURL(data['cleanedAudio']);
                    wavesurferCleaned.load(cleanedUrl);
                    cleanedDownload!.onclick = () => downloadLinkOnClick(cleanedUrl, 'cleaned.wav');

                    transcriptionDownload!.onclick = () => {
                        const a = document.createElement('a');
                        const blobObj = new Blob([JSON.stringify(data['transcription'], null, 4)], {
                            type: 'application/json',
                        });
                        a.href = URL.createObjectURL(blobObj);
                        a.download = 'transcription.json';
                        a.click();
                    };

                    wavesurfer.on('play', () => setIsPlayingOriginal(true));
                    wavesurfer.on('pause', () => setIsPlayingOriginal(false));
                    wavesurferCleaned.on('play', () => setIsPlayingCleaned(true));
                    wavesurferCleaned.on('pause', () => setIsPlayingCleaned(false));

                    document.getElementById('original-audio')?.classList.remove('hidden');
                    document.getElementById('cleaned-audio')?.classList.remove('hidden');
                    document.getElementById('transcription-audio')?.classList.remove('hidden');
                    document.getElementById('results-container')?.classList.remove('hidden');
                },
            )
            .catch((error) => {
                // console.error('Error sending audio:', error);
                toast.error('Error sending audio' + error.message);
            });
        recorder.setAudioChunks([]);
    };

    function dragOver(event: DragEvent & { currentTarget: HTMLDivElement; target: Element }) {
        event.preventDefault();
        const audioUploadArea = document.getElementById('audio-upload-area');
        audioUploadArea!.classList.add('border-blue-500', 'bg-white');
    }

    // Function to reset styles when leaving the drag-and-drop area
    function dragLeave(event: DragEvent & { currentTarget: HTMLDivElement; target: Element }) {
        event.preventDefault();
        const audioUploadArea = document.getElementById('audio-upload-area');
        audioUploadArea!.classList.remove('border-blue-500', 'bg-white');
    }

    // Function to handle file drop
    function fileDrop(event) {
        event.preventDefault();

        const selectedAudioInfo = document.getElementById('selected-audio-info');
        const audioFileName = document.getElementById('audio-file-name');
        const audioUploadArea = document.getElementById('audio-upload-area');
        audioUploadArea!.classList.remove('border-blue-500', 'bg-white');

        const file = event.type === 'change' ? event.target.files[0] : event.dataTransfer.files[0];

        if (file) {
            recorder.setLastAudioIssuer('upload');
            setUploadedAudio(file);
            recorder.setIsRecording(false);
            selectedAudioInfo!.classList.remove('hidden');
            audioFileName!.textContent = file.name;
        } else {
            selectedAudioInfo!.classList.add('hidden');
            audioFileName!.textContent = '';
        }
    }

    return (
        <div class="flex justify-center">
            <div class="pt-10 px-10">
                <div class="card w-96 bg-base-200 border border-base-300 rounded  transition duration-300">
                    <div class="card-body p-4">
                        <h2 class="card-title text-md">Recognize</h2>
                        <div class="collapse collapse-arrow bg-base-300">
                            <input type="radio" name="my-accordion-2" checked="checked" />
                            <div class="collapse-title text-base font-medium align-middle items-center">
                                <div class="flex h-full w-full items-center">Upload</div>
                            </div>
                            <div class="collapse-content">
                                <div
                                    id="audio-upload-area"
                                    class="relative p-4 rounded-lg text-center"
                                    ondragover={(e) => {
                                        dragOver(e);
                                    }}
                                    ondragleave={(e) => {
                                        dragLeave(e);
                                    }}
                                    ondrop={(e) => {
                                        fileDrop(e);
                                    }}
                                >
                                    <input
                                        type="file"
                                        id="audio-upload"
                                        class="hidden"
                                        accept="audio/*"
                                        onChange={(e) => {
                                            fileDrop(e);
                                        }}
                                    />
                                    <label for="audio-upload" class="cursor-pointer block text-gray-600">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="w-6 h-6 mx-auto"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M10 0a10 10 0 1010 10A10 10 0 0010 0zm0 18a8 8 0 110-16 8 8 0 010 16z" />
                                            <path d="M10 4a1 1 0 00-1 1v4H5a1 1 0 000 2h4v4a1 1 0 002 0v-4h4a1 1 0 000-2h-4V5a1 1 0 00-1-1z" />
                                        </svg>
                                        <p class="mt-2 text-base">Click to upload audio or drag and drop here</p>
                                    </label>
                                    <p class="text-base text-gray-500 mt-2">Supported formats: MP3, WAV, FLAC, etc.</p>
                                </div>

                                <div id="selected-audio-info" class="mt-4 text-gray-600 hidden">
                                    <p class="text-base">Selected audio:</p>
                                    <p class="font-semibold text-base" id="audio-file-name"></p>
                                </div>
                            </div>
                        </div>
                        <div class="collapse collapse-arrow bg-base-300">
                            <input type="radio" name="my-accordion-2" />
                            <div class="collapse-title text-base font-medium">
                                <div class="flex h-full w-full items-center">Record</div>
                            </div>
                            <div class="collapse-content">
                                <div class="card-actions justify-center">
                                    <button
                                        onClick={recorder.start}
                                        disabled={recorder.isRecording()}
                                        class={`btn text-base btn-accent ${
                                            recorder.isRecording() ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        Start
                                    </button>
                                    <button
                                        onClick={recorder.stop}
                                        disabled={!recorder.isRecording()}
                                        class={`btn text-base btn-secondary ${
                                            !recorder.isRecording() ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        Stop
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={sendRecording}
                            disabled={recorder.audioChunks().length === 0 && uploadedAudio() === null}
                            class={`btn text-base btn-primary ${
                                recorder.audioChunks().length === 0 && uploadedAudio() === null
                                    ? 'opacity-50 cursor-not-allowed'
                                    : ''
                            }`}
                        >
                            Recognize
                        </button>
                    </div>
                </div>
            </div>
            <div class="flex pt-10 px-10 flex-col gap-4 w-96 hidden transition duration-300" id="results-container">
                <details
                    tabIndex={0}
                    id="original-audio"
                    class="collapse collapse-arrow bg-base-200 rounded border hidden border-base-300  transition duration-300"
                >
                    <summary class="collapse-title text-base font-medium min-h-0">
                        <div class="flex h-full w-full items-center">
                            <button
                                id="play-pause-original"
                                class="btn btn-primary btn-circle btn-sm"
                                onClick={() => {
                                    if (wavesurfer?.isPlaying()) {
                                        wavesurfer?.pause();
                                    } else {
                                        wavesurfer?.play();
                                    }
                                }}
                            >
                                {isPlayingOriginal() ? '❚❚' : '▷'}
                            </button>
                            <p class="pl-4">Original audio</p>
                        </div>
                    </summary>
                    <div class="collapse-content">
                        <div id="waveform"></div>
                        <div class="pt-4 justify-end card-actions">
                            <a id="original-download" href="#" class="text-base">
                                Download
                            </a>
                        </div>
                    </div>
                </details>
                <details
                    tabIndex={0}
                    id="cleaned-audio"
                    class="collapse collapse-arrow bg-base-200 rounded border hidden border-base-300  transition duration-300"
                >
                    <summary class="collapse-title text-base font-medium min-h-0">
                        <div class="flex h-full w-full items-center">
                            <button
                                id="play-pause-cleaned"
                                class="btn btn-primary btn-circle btn-sm"
                                onClick={() => {
                                    if (wavesurferCleaned?.isPlaying()) {
                                        wavesurferCleaned?.pause();
                                    } else {
                                        wavesurferCleaned?.play();
                                    }
                                }}
                            >
                                {isPlayingCleaned() ? '❚❚' : '▷'}
                            </button>
                            <p class="pl-4">Cleaned audio</p>
                        </div>
                    </summary>
                    <div class="collapse-content">
                        <div id="waveform-cleaned"></div>
                        <div class="justify-end card-actions">
                            <a id="cleaned-download" href="#" class="text-base">
                                Download
                            </a>
                        </div>
                    </div>
                </details>
                <details
                    tabIndex={0}
                    id="transcription-audio"
                    class="collapse collapse-arrow bg-base-200 rounded border hidden border-base-300  transition duration-300"
                >
                    <summary class="collapse-title text-base font-medium min-h-0">
                        <div>
                            <div class="flex h-full w-full items-center">Transcription</div>
                        </div>
                    </summary>
                    <div class="collapse-content">
                        <div class="justify-end card-actions">
                            <a id="transcription-download" href="#" class="text-base">
                                Download
                            </a>
                        </div>
                    </div>
                </details>
            </div>
        </div>
    );
}
