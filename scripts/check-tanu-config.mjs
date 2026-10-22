import 'dotenv/config';
import {aiConfiguration} from '../src/services/aiConfig.js';
const config=aiConfiguration();
// Intentionally never print keys or all process.env values.
console.log(JSON.stringify({ready:config.ready,provider:config.provider||null,model:config.model||null,missing:config.missing},null,2));
if(!config.ready)process.exitCode=1;
