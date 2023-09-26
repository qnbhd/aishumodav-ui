import { JSX } from 'solid-js';

export default function Container(props: { children: JSX.Element }) {
    return (
        <>
            <div class="container mx-16 mt-10 p-2 w-auto h-screen max-w-none">{props.children}</div>
        </>
    );
}
