import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../utils/error.util';
import logger from '../utils/logger.util';

// Ensure uploads directory exists and is located outside of public-accessible root
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    // Sanitize and generate unique safe names
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (
  _req: Request,
  file: any,
  cb: any
) => {
  const allowedMimes = [
    'image/jpeg', 'image/jpg', 'image/png',
    'application/pdf',
  ];
  if (!allowedMimes.includes(file.mimetype)) {
    return cb(new BadRequestError(`File type not allowed: ${file.mimetype}. Only JPG, PNG, and PDF are accepted.`));
  }
  cb(null, true);
};

// Internal multer instance
const multerInstance = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB per file
  },
}).fields([
  { name: 'photo', maxCount: 1 },
  { name: 'signature', maxCount: 1 },
  { name: 'tenthMarksheet', maxCount: 1 },
  { name: 'twelfthMarksheet', maxCount: 1 },
  { name: 'cetScoreCard', maxCount: 1 },
  { name: 'aadhaar', maxCount: 1 },
  { name: 'casteCertificate', maxCount: 1 },
  { name: 'domicileCertificate', maxCount: 1 },
  { name: 'gapCertificate', maxCount: 1 },
]);

/**
 * Validates the first few bytes (magic bytes) of a file to check its actual type.
 */
const verifyMagicBytes = (filePath: string, mimeType: string): boolean => {
  try {
    const buffer = Buffer.alloc(4);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 4, 0);
    fs.closeSync(fd);

    const hex = buffer.toString('hex').toUpperCase();

    if (mimeType === 'application/pdf') {
      // PDF starts with 25 50 44 46 (%PDF)
      return hex === '25504446';
    }

    if (mimeType.startsWith('image/')) {
      const isJpeg = hex.startsWith('FFD8FF');
      const isPng = hex === '89504E47';
      const isWebp = hex === '52494646'; // RIFF (starts WebP containers)
      return isJpeg || isPng || isWebp;
    }

    return false;
  } catch (error) {
    logger.error(`Error reading magic bytes from file: ${filePath}`, error);
    return false;
  }
};

/**
 * Hardened upload middleware wrapper that handles multer uploads
 * and performs strict content-sniffing/magic byte checks to prevent macro/malware execution.
 */
export const uploadDocuments = (req: Request, res: Response, next: NextFunction): void => {
  multerInstance(req, res, (err: any) => {
    if (err) {
      return next(err);
    }

    if (req.files) {
      const filesObject = req.files as { [fieldname: string]: Express.Multer.File[] };
      for (const fieldName of Object.keys(filesObject)) {
        const filesList = filesObject[fieldName];
        for (const file of filesList) {
          // Double-check file signature against declared mime-type
          const isValid = verifyMagicBytes(file.path, file.mimetype);
          if (!isValid) {
            // Delete invalid disguised file immediately
            try {
              fs.unlinkSync(file.path);
            } catch (unlinkErr) {
              logger.error(`Failed to delete invalid upload: ${file.path}`, unlinkErr);
            }
            logger.warn(`Security alert: Upload blocked due to magic byte mismatch for ${file.originalname}`);
            return next(new BadRequestError(`File validation failed. Disguised files or macro scripts are not allowed.`));
          }
        }
      }
    }
    next();
  });
};

