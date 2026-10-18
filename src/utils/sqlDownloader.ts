import { KOPERASI_ELBAYAN_SQL } from '../data/sqlContent';

/**
 * Downloads the pure SQL file as a direct in-memory Blob.
 * This guarantees the browser will NEVER download an HTML page (<!doctype html>)
 * even if running inside an iframe, preview sandbox, or single-page app.
 */
export function downloadPureSqlFile(filename: string = 'koperasi_elbayan.sql'): void {
  try {
    const blob = new Blob([KOPERASI_ELBAYAN_SQL], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (err) {
    console.error('Gagal mengunduh file SQL via Blob:', err);
    // Fallback: window navigation
    window.location.href = '/koperasi_elbayan.sql';
  }
}

/**
 * Copies the entire raw SQL database script to clipboard.
 */
export async function copySqlToClipboard(): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(KOPERASI_ELBAYAN_SQL);
      return true;
    }
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = KOPERASI_ELBAYAN_SQL;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Gagal menyalin query SQL ke clipboard:', err);
    return false;
  }
}
