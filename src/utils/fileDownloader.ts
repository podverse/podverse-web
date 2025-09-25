async function downloadFile(url: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response);
      } else {
        reject(new Error(`Download failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during file download'));
    };

    xhr.send();
  });
}

function saveBlobToDisk(blob: Blob, filename: string): void {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export async function downloadAndSaveFile(url: string, filename: string): Promise<void> {
  const blob = await downloadFile(url);
  saveBlobToDisk(blob, filename);
}
