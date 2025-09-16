// Input validation utilities
export const validateObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, "_");
};

export const validateImageFile = (
  file: File
): { valid: boolean; error?: string } => {
  const allowedTypes = [
    "image/jpeg", // JPEG (رایج در هر دو)
    "image/png", // PNG (رایج برای شفافیت)
    "image/gif", // GIF (برای تصاویر متحرک)
    "image/webp", // WebP (اندروید و iOS 14+)
    "image/heic", // HEIC (آیفون iOS 11+)
    "image/heif", // HEIF (آیفون و اندروید 10+)
    "image/tiff", // TIFF (اختیاری، کمتر رایج)
    "image/bmp", // BMP (اختیاری، کمتر رایج)
    "image/avif", // AVIF (اختیاری، اندروید 12+ و iOS 16+)
    
  ];
  const maxSize = 5 * 1024 * 1024; // 30MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "نوع فایل تصویر نامعتبر است" };
  }

  if (file.size > maxSize) {
    return { valid: false, error: "حجم فایل تصویر بیش از حد مجاز است" };
  }

  return { valid: true };
};

export const validateVideoFile = (
  file: File
): { valid: boolean; error?: string } => {
  const allowedTypes = [
    "video/mp4", // H.264, MPEG-4, HEVC
    "video/quicktime", // MOV با H.264 یا MJPEG
    "video/mov", // MOV (مشابه quicktime)
    "video/hevc",
    "video/HEVC",
    "video/x-matroska", // MKV با H.264 یا HEVC
    "video/webm", // VP8/VP9
    "video/avi", // AVI با کدک‌های مختلف
    "video/mpeg", // MPEG-2
  ];
  const maxSize = 10 * 1024 * 1024; // 100MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "نوع فایل ویدیو نامعتبر است" };
  }

  if (file.size > maxSize) {
    return { valid: false, error: "حجم فایل ویدیو بیش از حد مجاز است" };
  }

  return { valid: true };
};

export const validateUserId = (userId: string): boolean => {
  return /^[a-zA-Z0-9_-]+$/.test(userId) && userId.length <= 50;
};

export const sanitizeInput = (input: string): string => {
  return input.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );
};
