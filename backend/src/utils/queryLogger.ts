import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, 'query.log');

export function logQuery(message: string) {
  if (process.env.NODE_ENV === 'production') return;
  fs.appendFileSync(logFile, `${new Date().toISOString()} ${message}\n\n`);
}
