export function downloadFile(
  base64: string,
  filename = 'document.pdf',
  mime = 'application/pdf'
): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false; 
  }
  if (!base64) return false;

  try {
    const cleanBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
    const binary = atob(cleanBase64);
    const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
    const blob = new Blob([bytes], { type: mime });
    const safeName = filename.replace(/[<>:"/\\|?*]+/g, '_');
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = safeName;
    document.body.appendChild(anchor);
    anchor.click();

    setTimeout(() => {
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    }, 0);

    return true;
  } catch {
    return false;
  }
}