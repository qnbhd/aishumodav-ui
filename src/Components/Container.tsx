import { createSignal, JSX} from 'solid-js';

export default function Container(props: { children: number | boolean | Node | JSX.ArrayElement | (string & {}) | null | undefined; }) {
    const [isOpen, setIsOpen] = createSignal(true);
    return (
        <>
          {isOpen() ? (
            <div className="container mx-16 mt-10 p-2 w-auto h-screen max-w-none">
              {props.children}
            </div>
          ) : null}
        </>
  );
}