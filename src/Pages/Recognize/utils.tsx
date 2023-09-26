import axios from 'axios';
import toast from 'solid-toast';

export async function sendAudioToService(audioBlob: Blob) {
    try {
        const formData = new FormData();

        // toast.loading('Sending audio to the service...');
        formData.append('audio', audioBlob, 'recording.wav');

        const response = await axios.post('/api/v1/recognize', formData, {
            headers: { 'Content-Type': 'multipart/mixed' },
        });

        const parts = response.data.split('\n--boundary\n');

        if (parts.length !== 2) {
            throw new Error('Invalid response format');
        }

        const jsonData = JSON.parse(parts[0]);

        // The second part contains the audio data as-is
        const audioData = parts[1];

        return {
            originalAudio: b64toBlob(audioData, 'audio/wav'),
            cleanedAudio: b64toBlob(audioData, 'audio/wav'),
            transcription: jsonData,
        };
    } catch (error: any) {
        toast.error('Error sending audio to the service: ' + error.message);
    }
}

// Function to convert base64 to Blob
// Function to decode base64 data that may contain non-Latin1 characters
const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
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
};
