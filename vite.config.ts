import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import pages from "vite-plugin-pages";
// import devtools from 'solid-devtools/vite';

export default defineConfig({
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    solidPlugin(),
    pages({
      pagesDir: 'src/Pages',
      extensions: ['tsx'], // Specify your page file extensions
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
