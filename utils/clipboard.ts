/**
 * Cross-platform clipboard utility that works on mobile, desktop, and all browsers
 */

export interface ClipboardOptions {
  fallbackMessage?: string;
  useWebShare?: boolean;
  shareTitle?: string;
  shareText?: string;
}

/**
 * Copy text to clipboard with cross-platform fallback support
 * @param text - Text to copy to clipboard
 * @param options - Additional options for clipboard operation
 * @returns Promise<boolean> - Success status
 */
export async function copyToClipboard(
  text: string, 
  options: ClipboardOptions = {}
): Promise<boolean> {
  const {
    fallbackMessage = "Please copy the link manually:",
    useWebShare = true,
    shareTitle = "Share Profile",
    shareText = "Check out this profile"
  } = options;

  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    console.warn('Clipboard operation attempted in non-browser environment');
    return false;
  }

  // Try Web Share API first on mobile devices (if enabled)
  if (useWebShare && navigator.share && isMobileDevice()) {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: text
      });
      console.log('Successfully shared via Web Share API');
      return true;
    } catch (err) {
      // User cancelled or share failed, continue to clipboard
      console.log('Web Share cancelled or failed, falling back to clipboard');
    }
  }

  // Method 1: Modern Clipboard API (preferred)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Successfully copied to clipboard via Clipboard API');
      return true;
    } catch (err) {
      console.warn('Clipboard API failed:', err);
    }
  }

  // Method 2: Legacy execCommand fallback
  try {
    const success = await legacyCopyToClipboard(text);
    if (success) {
      console.log('Successfully copied to clipboard via execCommand');
      return true;
    }
  } catch (err) {
    console.warn('execCommand fallback failed:', err);
  }

  // Method 3: Manual fallback - show text for user to copy
  showManualCopyFallback(text, fallbackMessage);
  return false;
}

/**
 * Legacy clipboard copy using execCommand
 */
function legacyCopyToClipboard(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    // Create a temporary textarea element
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make it invisible but accessible
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    textArea.setAttribute('aria-hidden', 'true');
    
    document.body.appendChild(textArea);
    
    try {
      // Select the text
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, text.length);
      
      // Try to copy
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      resolve(successful);
    } catch (err) {
      document.body.removeChild(textArea);
      resolve(false);
    }
  });
}

/**
 * Show manual copy fallback (select text for user to copy manually)
 */
function showManualCopyFallback(text: string, message: string): void {
  // Create a modal or alert with selectable text
  try {
    // Use prompt as a fallback - user can select and copy
    window.prompt(message, text);
  } catch (err) {
    // Last resort - just alert (in case prompt is blocked)
    alert(`${message}\n\n${text}`);
  }
}

/**
 * Detect if the device is likely mobile
 */
function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || (
    // Additional check for touch devices
    'ontouchstart' in window || 
    navigator.maxTouchPoints > 0
  );
}

/**
 * Check if clipboard operations are supported
 */
export function isClipboardSupported(): boolean {
  return !!(
    (navigator.clipboard && window.isSecureContext) ||
    (typeof document.queryCommandSupported === 'function' && document.queryCommandSupported('copy')) ||
    navigator.share
  );
}

/**
 * Get the best available clipboard method
 */
export function getClipboardMethod(): 'clipboard-api' | 'execCommand' | 'web-share' | 'manual' | 'none' {
  if (isMobileDevice()) {
    return 'web-share';
  }
  
  if (navigator.clipboard && window.isSecureContext) {
    return 'clipboard-api';
  }
  
  if (typeof document.queryCommandSupported === 'function' && document.queryCommandSupported('copy')) {
    return 'execCommand';
  }
  
  // Always available as last resort
  return 'manual';
}