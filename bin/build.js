/* eslint-disable no-console */
import * as esbuild from 'esbuild';

// Config output
const BUILD_DIRECTORY = 'dist';
const PRODUCTION = process.env.NODE_ENV === 'production';

// Config entrypoint files
const ENTRY_POINTS = ['src/index.ts'];

// Config dev serving
const LIVE_RELOAD = !PRODUCTION;
const SERVE_PORT = 3000;

// Create context
const context = await esbuild.context({
  bundle: true,
  entryPoints: ENTRY_POINTS,
  outdir: BUILD_DIRECTORY,
  minify: PRODUCTION,
  sourcemap: !PRODUCTION,
  target: PRODUCTION ? 'es2019' : 'esnext',
  inject: LIVE_RELOAD ? ['./bin/live-reload.js'] : undefined,
  define: {
    SERVE_PORT: `${SERVE_PORT}`,
  },
});

// Build files in prod
if (PRODUCTION) {
  await context.rebuild();
  context.dispose();
}

// Watch and serve files in dev
else {
  await context
    .serve({
      servedir: BUILD_DIRECTORY,
      port: SERVE_PORT,
      onRequest: (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        // Special headers for EventSource to prevent CORS errors in live-reload
        if (req.url.includes('/esbuild')) {
          res.setHeader('Content-Type', 'text/event-stream');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Connection', 'keep-alive');
        }
      },
    })
    .then(async ({ port }) => {
      // Log all served files for easy reference
      const origin = `http://localhost:${port}`;
      const files = ENTRY_POINTS.map(
        (path) => `${origin}/${path.replace('src/', '').replace('.ts', '.js')}`
      );

      console.log('Serving at:', origin);
      console.log('Built files:', files);
    });
}
