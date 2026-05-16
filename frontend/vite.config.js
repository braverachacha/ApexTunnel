import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync, statSync } from 'fs';

// Auto-discover pages
const entries = { main: resolve(__dirname, 'index.html') };
const skip = ['node_modules', 'dist', 'public', 'styles', 'scripts', 'favicon'];

readdirSync('.').forEach(name => {
  const dir = resolve(__dirname, name);
  const html = resolve(dir, 'index.html');
  try {
    if (statSync(dir).isDirectory() && !skip.includes(name) && statSync(html).isFile()) {
      entries[name] = html;
    }
  } catch {}
});

export default defineConfig({
  plugins: [{
    name: 'auto-routes',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.url.split('?')[0].replace(/\/$/, '');
        const page = path.slice(1);
        if (entries[page] && !path.endsWith('.html')) {
          req.url = path + '/index.html';
        }
        next();
      });
    }
  }],

  css: {
    preprocessorOptions: { scss: { silenceDeprecations: ['import'] } }
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: { input: entries }
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, './scripts'),
      '@styles': resolve(__dirname, './styles'),
    }
  }
});
