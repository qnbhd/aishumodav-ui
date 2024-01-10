import { JSX, Match, Switch } from 'solid-js';

import Footer from '../Components/Footer';

type HeroProps = {
    imgUrl?: string;
    title?: string;
    description?: string;
    children?: JSX.Element;
};

function Hero(props: HeroProps) {
    const heroContentClass = 'hero-content text-center' + (props.imgUrl ? ' text-neutral-content' : '');
    const content = (
        <>
            <div class={heroContentClass}>
                <div class="max-w-md">
                    <h1 class="mb-5 text-5xl font-bold">{props.title}</h1>
                    <p class="mb-5">{props.description}</p>
                    {props.children}
                </div>
            </div>
        </>
    );

    return (
        <Switch>
            <Match when={props.imgUrl}>
                <div class="hero min-h-screen" style={`background-image: url(${props.imgUrl});`}>
                    <div class="hero-overlay bg-opacity-60"></div>
                    {content}
                </div>
            </Match>
            <Match when={!props.imgUrl}>
                <div class="hero min-h-screen bg-base-100">{content}</div>
            </Match>
        </Switch>
    );
}

function Home() {
    return (
        <>
            <Hero
                title="Clear and Accurate Audio Transcription"
                description="Remove noise from your audio and get accurate transcriptions with AIShumodav"
            >
                <a class="btn btn-primary" href="/recognize">Get Started</a>
            </Hero>
            <Hero
                title="Remove background noise"
                imgUrl="/home-1.jpeg"
                description="AIShumodav uses advanced algorithms to effectively remove
            background noise from your audio recordings, ensuring clear
            and high-quality transcriptions."
            />
            <Hero
                title="Easy audio recording"
                imgUrl="/home-2.jpeg"
                description="With the AIShumodav, you can easily record audio directly
            from your microphone or attach a file for transcription. No additional software or tools required."
            />
            <Hero
                title="Fast and accurate transcriptions"
                description="“Thanks to AIShumodav, I can now focus on the content of my
                     recordings without worrying about background noise.
                    The transcriptions are always accurate and reliable.” - Grace Hill"
            >
                <div class="flex flex-row justify-center gap-2">
                    <input type="text" placeholder="Enter your email" class="w-96 input input-primary input-bordered" />
                    <button class="btn btn-primary">Get Started</button>
                </div>
            </Hero>
            <Footer />
        </>
    );
}

export default Home;
