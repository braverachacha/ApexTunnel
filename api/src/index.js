import { app } from './app.js';
import 'dotenv/config';

const PORT = process.env.PORT || 3000;

// app server
app.listen(PORT, ()=>{
  console.log(`Server running on: http://localhost:${PORT}`);
});