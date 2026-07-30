import sharp from 'sharp';
import fs from 'fs';
import logger from './logger.util';

export interface ValidationResult {
  success: boolean;
  reason?: 'BLACK_AND_WHITE_IMAGE' | 'BLURRY_IMAGE';
  message?: string;
}

export interface DocumentRule {
  checkColor: boolean;
  checkBlur: boolean;
}

/**
 * Normalizes document type strings or field names into standard keys.
 */
export function normalizeDocumentType(docType: string): string {
  if (!docType) return 'unknown';
  const clean = docType.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

  const map: Record<string, string> = {
    'photo': 'photo',
    'passportphoto': 'photo',
    'recentpassportphoto': 'photo',

    'aadhaar': 'aadhaar',
    'aadhaarcard': 'aadhaar',

    'tenthmarksheet': 'tenthMarksheet',
    '10thmarkscard': 'tenthMarksheet',
    'sslc10thmarkscard': 'tenthMarksheet',
    'sslcmarkscard': 'tenthMarksheet',
    'sslc': 'tenthMarksheet',

    'twelfthmarksheet': 'twelfthMarksheet',
    '12thmarkscard': 'twelfthMarksheet',
    'puc12thmarkscard': 'twelfthMarksheet',
    'pucmarkscard': 'twelfthMarksheet',
    'puc': 'twelfthMarksheet',

    'cetscorecard': 'cetScoreCard',
    'entrancescorecardcetdcet': 'cetScoreCard',
    'entrancescorecard': 'cetScoreCard',
    'cetdcet': 'cetScoreCard',
    'cet': 'cetScoreCard',

    'signature': 'signature',
    'esignature': 'signature',

    'incomecertificate': 'incomeCertificate',
    'incomecert': 'incomeCertificate',

    'castecertificate': 'casteCertificate',
    'castecert': 'casteCertificate',

    'domicilecertificate': 'domicileCertificate',
    '7yearsstudycertificate': 'domicileCertificate',
    'studycertificate': 'domicileCertificate',

    'gapcertificate': 'gapCertificate',
    'gapcert': 'gapCertificate',

    'feespaidreceipt': 'feesPaidReceipt',
    'feereceipt': 'feesPaidReceipt',
    'admissionfeereceipt': 'admissionFeeReceipt',
  };

  return map[clean] || docType;
}

/**
 * Configuration matrix specifying required quality validations per document type.
 */
export const DOCUMENT_VALIDATION_CONFIG: Record<string, DocumentRule> = {
  photo: { checkColor: true, checkBlur: true },
  aadhaar: { checkColor: true, checkBlur: true },
  tenthMarksheet: { checkColor: true, checkBlur: true },
  twelfthMarksheet: { checkColor: true, checkBlur: true },
  cetScoreCard: { checkColor: true, checkBlur: true },

  signature: { checkColor: false, checkBlur: true },
  incomeCertificate: { checkColor: false, checkBlur: true },
  casteCertificate: { checkColor: false, checkBlur: true },
  domicileCertificate: { checkColor: false, checkBlur: true },
  gapCertificate: { checkColor: false, checkBlur: true },
  feesPaidReceipt: { checkColor: false, checkBlur: true },
  admissionFeeReceipt: { checkColor: false, checkBlur: true },
};

/**
 * Validates if an image is in color (rejects Black & White or Grayscale images).
 */
export async function validateColor(input: string | Buffer): Promise<boolean> {
  try {
    const pipeline = typeof input === 'string' ? sharp(input) : sharp(input);

    const { data, info } = await pipeline
      .resize(250, 250, { fit: 'inside' })
      .toFormat('png')
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Single channel images are strictly monochrome / grayscale
    if (info.channels === 1) {
      return false;
    }

    const channels = info.channels;
    const totalPixels = info.width * info.height;
    let colorPixelCount = 0;

    for (let i = 0; i < data.length; i += channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const delta = max - min;

      // A pixel is considered colored if maximum channel divergence > 18
      if (delta > 18) {
        colorPixelCount++;
      }
    }

    const colorRatio = colorPixelCount / totalPixels;

    // Minimum color threshold: at least 2.5% of pixels must have distinct color
    return colorRatio >= 0.025;
  } catch (error) {
    logger.error('Error during color validation:', error);
    // If sharp cannot process non-image format, pass through safely
    return true;
  }
}

/**
 * Validates if an image is clear (rejects blurry images using Variance of Laplacian).
 */
export async function validateBlur(input: string | Buffer, blurThreshold: number = 85): Promise<boolean> {
  try {
    const pipeline = typeof input === 'string' ? sharp(input) : sharp(input);

    const { data, info } = await pipeline
      .resize(400, 400, { fit: 'inside' })
      .grayscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const width = info.width;
    const height = info.height;

    if (width < 3 || height < 3) return true;

    // 3x3 Laplacian Operator Kernel:
    // [  0,  1,  0 ]
    // [  1, -4,  1 ]
    // [  0,  1,  0 ]
    let sum = 0;
    const laplacianValues: number[] = [];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;

        const current = data[idx];
        const left = data[idx - 1];
        const right = data[idx + 1];
        const top = data[idx - width];
        const bottom = data[idx + width];

        const lap = left + right + top + bottom - 4 * current;
        laplacianValues.push(lap);
        sum += lap;
      }
    }

    const count = laplacianValues.length;
    if (count === 0) return true;

    const mean = sum / count;
    let varianceSum = 0;

    for (let i = 0; i < count; i++) {
      const diff = laplacianValues[i] - mean;
      varianceSum += diff * diff;
    }

    const variance = varianceSum / count;

    // Sharp images have high Laplacian variance; blurry images have low variance
    return variance >= blurThreshold;
  } catch (error) {
    logger.error('Error during blur validation:', error);
    return true;
  }
}

/**
 * Main entry point: Validates an uploaded document based on its type rules.
 */
export async function validateDocument(
  documentType: string,
  input: string | Buffer
): Promise<ValidationResult> {
  const normType = normalizeDocumentType(documentType);
  const rule = DOCUMENT_VALIDATION_CONFIG[normType] || { checkColor: false, checkBlur: true };

  // 1. Color Validation (if required for document type)
  if (rule.checkColor) {
    const isColor = await validateColor(input);
    if (!isColor) {
      return {
        success: false,
        reason: 'BLACK_AND_WHITE_IMAGE',
        message: 'Please upload a clear color photograph of the original document.',
      };
    }
  }

  // 2. Blur Validation (required for all specified documents)
  if (rule.checkBlur) {
    const isSharp = await validateBlur(input);
    if (!isSharp) {
      return {
        success: false,
        reason: 'BLURRY_IMAGE',
        message: 'Please upload a clearer image.',
      };
    }
  }

  return { success: true };
}
