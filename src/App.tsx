import { Route, Routes } from '@solidjs/router';
import { type Component, onMount } from 'solid-js';
import { Toaster } from 'solid-toast';

import Container from './Components/Container';
import NavBar from './Components/NavBar';
import Home from './Pages';
import Recognize from './Pages/Recognize';
import NotFound from './Pages/[...404]';
import Team from './Pages/team';

const App: Component = () => {
    onMount(() => {
        if (
            localStorage.getItem('color-theme') === 'dark' ||
            (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
        ) {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            document.documentElement.classList.remove('dark');
        }
    });

    return (
        <>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/recognize"
                    element={
                        <Container>
                            <Recognize />
                        </Container>
                    }
                />
                <Route
                    path="/team"
                    element={
                        <Container>
                            <Team />
                        </Container>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    className: 'bg-base-200 text-anti-base font-xs border border-base-300 rounded-md',
                    duration: 50000000,
                    style: {
                        background: '',
                        color: '',
                        'font-size': '0.8rem',
                    },
                }}
            />
        </>
    );
};

export default App;
