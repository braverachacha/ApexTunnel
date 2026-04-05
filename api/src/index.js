import { createServer } from 'http';
import { app } from './app.js';
import { initWebSocket } from './ws/index.js';

import 'dotenv/config';

const PORT = process.env.PORT || 3000;

const server = createServer(app);

initWebSocket(server);

// app server
server.listen(PORT, () => {
  console.log(`Server running on: http://localhost:${PORT}`)
})