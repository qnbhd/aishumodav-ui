import { Accessor, Setter, createSignal } from 'solid-js';

export class AudioRecorder {
    isRecording: Accessor<boolean>;
    setIsRecording: Setter<boolean>;
    audioChunks: Accessor<Blob[]>;
    setAudioChunks: Setter<Blob[]>;
    lastAudioIssuer: Accessor<string | null>;
    setLastAudioIssuer: Setter<string | null>;
    mediaRecorder: MediaRecorder | null;
    audioStream: MediaStream | null;

    constructor() {
        [this.isRecording, this.setIsRecording] = createSignal(false);
        [this.audioChunks, this.setAudioChunks] = createSignal<Blob[]>([]);
        [this.lastAudioIssuer, this.setLastAudioIssuer] = createSignal<string | null>(null);
        this.mediaRecorder = null;
        this.audioStream = null;
    }

    start = () => {
        this.setLastAudioIssuer('record');
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                this.audioStream = stream;
                this.mediaRecorder = new MediaRecorder(stream);
                this.mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        this.setAudioChunks((prevChunks) => [...prevChunks, event.data]);
                    }
                };
                this.mediaRecorder.start();
                this.setIsRecording(true);
            })
            .catch((error) => {
                console.error('Error accessing microphone:', error);
            });
    };

    stop = () => {
        if (this.mediaRecorder && this.isRecording()) {
            this.mediaRecorder.stop();
            this.audioStream?.getTracks().forEach((track) => track.stop());
            this.setIsRecording(false);
        }
    };
}
