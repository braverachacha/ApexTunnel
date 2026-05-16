import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync, statSync, existsSync } from 'fs';

// Explicitly define root pages that aren't in folders
const entries = { 
  main: resolve(__dirname, 'index.html'),
  404: resolve(__dirname, '404.html') 
};

const skip = ['node_modules', 'dist', 'public', 'styles', 'scripts', 'favicon'];

// Auto-discover pages in subdirectories
readdirSync('.').forEach(name => {
  const dir = resolve(__dirname, name);
  
  // Skip if it's in our restricted list or not a directory
  if (skip.includes(name) || !statSync(dir).isDirectory()) return;

  const htmlPath = resolve(dir, 'index.html');
  if (existsSync(htmlPath)) {
    entries[name] = htmlPath;
  }
});

export default defineConfig({
  plugins: [{
    name: 'auto-routes',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.url.split('?')[0].replace(/\/$/, '');
        const page = path.slice(1);
        
        // Handle folder-based routes
        if (entries[page] && !path.endsWith('.html')) {
          // If it's a folder-based entry (like /auth), serve its index.html
          if (entries[page].endsWith('index.html')) {
            req.url = path + '/index.html';
          }
        }
        next();
      });
    }
  }],

  css: {
    preprocessorOptions: { 
      scss: { silenceDeprecations: ['import'] } 
    }
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: { 
      input: entries 
    }
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, './scripts'),
      '@styles': resolve(__dirname, './styles'),
    }
  }
});
