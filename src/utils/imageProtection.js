export function createBlobUrl(imageUrl) {
  return new Promise((resolve, reject) => {
    fetch(imageUrl, {
      mode: "cors",
      cache: "no-store",
      referrerPolicy: "no-referrer",
    })
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        resolve(blobUrl);
      })
      .catch((error) => {
        console.error("Error creating blob:", error);
        reject(error);
      });
  });
}

export function revokeUrl(url) {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}
