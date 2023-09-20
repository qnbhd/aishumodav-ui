import {onCleanup} from 'solid-js';
import {createSignal} from 'solid-js';

export default function Recognize() {
    const [isRecording, setIsRecording] = createSignal(false);
    const [audioChunks, setAudioChunks] = createSignal<Blob[]>([]);

    let mediaRecorder: MediaRecorder | null = null;
    let audioStream: MediaStream | null = null;

    const startRecording = () => {
        navigator.mediaDevices
            .getUserMedia({audio: true})
            .then((stream) => {
                audioStream = stream;
                mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        setAudioChunks((prevChunks) => [...prevChunks, event.data]);
                    }
                };

                mediaRecorder.start();
                setIsRecording(true);
            })
            .catch((error) => {
                console.error('Error accessing microphone:', error);
            });
    };

    const stopRecording = () => {
        if (mediaRecorder && isRecording()) {
            mediaRecorder.stop();
            audioStream?.getTracks().forEach((track) => track.stop());
            setIsRecording(false);
        }
    };

    const sendAudioToService = async (audioBlob) => {
        try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.wav');

            const headers = new Headers({
                Accept: 'application/json',
            });

            // Add the 'Content-Type' header for multipart form data
            // headers.append('Content-Type', 'multipart/form-data');

            const response = await fetch('http://localhost:8000/api/v1/recognize', {
                method: 'POST',
                headers,
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            // Handle the response data as needed
            console.log(data);
            return data;
        } catch (error) {
            console.error('Error sending audio to the service:', error);
        }
    };

    const sendRecording = () => {
        if (audioChunks().length === 0) {
            console.error('No audio to save.');
            return;
        }

        const audioBlob = new Blob(audioChunks(), {type: 'audio/wav'});
        const audioUrl = URL.createObjectURL(audioBlob);

        sendAudioToService(audioBlob)
            .then((data: object) => {
                const resultElement = document.getElementById("recognition-result");
                if (resultElement) {
                    resultElement.textContent = JSON.stringify(data, null, 4);
                } else {
                    console.error("No result element in DOM");
                }
                // Clear recorded audio chunks
                setAudioChunks([]);
            })
            .catch((error) => {
                console.error('Error sending audio:', error);
            });

        // download audio in browser
        // const a = document.createElement('a');
        // a.href = audioUrl;
        // a.download = 'recording.wav';
        // a.click();

        // Clear recorded audio chunks
        setAudioChunks([]);
    };

    onCleanup(() => {
        stopRecording();
    });

    return (
        <div class="flex justify-center">
            <div class="pt-10 px-10">
                <div className="card w-96 bg-base-100 shadow-md border">
                <div className="card-body">
                    <h2 className="card-title">Recognize</h2>
                    <p id="recognition-result">
                    </p>
                    <div className="card-actions justify-center">
                        <button
                            onClick={startRecording}
                            disabled={isRecording()}
                            className={`btn btn-accent ${
                                isRecording() ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            Start
                        </button>
                        <button
                            onClick={stopRecording}
                            disabled={!isRecording()}
                            className={`btn btn-secondary ${
                                !isRecording() ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            Stop
                        </button>
                        <button
                            onClick={sendRecording}
                            disabled={audioChunks().length === 0}
                            className={`btn btn-primary ${
                                audioChunks().length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            Recognize
                        </button>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}

