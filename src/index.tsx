/* @refresh reload */
import { Router } from '@solidjs/router';
import axios from 'axios';
import { render } from 'solid-js/web';

import App from './App';
import './index.css';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
    );
}

axios.defaults.withCredentials = false;
axios.defaults.baseURL = 'http://localhost:5001/';
if (import.meta.env.VITE_API_URL) {
    axios.defaults.baseURL = import.meta.env.VITE_API_URL;
}

render(
    () => (
        <Router>
            <App />
        </Router>
    ),
    root!,
);
