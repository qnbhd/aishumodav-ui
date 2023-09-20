import type { Component } from 'solid-js';
import { Route, Routes } from '@solidjs/router';

import logo from './logo.svg';
import styles from './App.module.css';
import Home from "./Pages";
import Recognize from "./Pages/recognize";
import NotFound from "./Pages/[...404]";
import About from "./Pages/about";
import Container from "./Components/Container";
import NavBar from "./Components/NavBar";

const App: Component = () => {
    return (
      <Container>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recognize" element={<Recognize />}/>
          <Route path="/about" element={<About />}/>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    )
}

export default App;
