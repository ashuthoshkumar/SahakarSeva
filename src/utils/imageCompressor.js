/**
 * Image compression utility using HTML5 Canvas
 * Resizes high-resolution phone camera photos to lightweight web-friendly images (< 150KB)
 * Prevents localStorage QuotaExceededError and Android WebView crashes.
 */
export const compressImage = (file, maxWidth = 1024, maxHeight = 1024, quality = 0.72) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided for compression'));
    }

    // If not an image, reject
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not an image'));
    }

    const reader = new FileReader();

    reader.onerror = (err) => {
      reject(new Error('Failed to read image file: ' + err.message));
    };

    reader.onload = (e) => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error('Failed to load image element for compression'));
      };

      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;

          // Calculate aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            // Fallback to original dataUrl if canvas context is unavailable
            return resolve(e.target.result);
          }

          // Draw image with smooth scaling
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Export compressed JPEG
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (err) {
          console.warn('Canvas compression error, falling back to original:', err);
          resolve(e.target.result);
        }
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });
};
