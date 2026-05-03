/** Gabungkan 4 JPG data URL jadi satu kolase (kiri atas → kanan atas → kiri bawah → kanan bawah). */
export function composeQuadPhotos(
  dataUrls: readonly [string, string, string, string]
): Promise<string | null> {
  const images = [new Image(), new Image(), new Image(), new Image()];

  return new Promise((resolve) => {
    let pending = 4;
    const doneOne = () => {
      pending -= 1;
      if (pending > 0) return;

      try {
        if (
          images.some((img) => !(img.naturalWidth > 0 && img.naturalHeight > 0))
        ) {
          resolve(null);
          return;
        }

        const w0 = images[0].naturalWidth;
        const h0 = images[0].naturalHeight;

        const out = document.createElement('canvas');
        out.width = w0 * 2;
        out.height = h0 * 2;
        const ctx = out.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }

        const positions = [
          { dx: 0, dy: 0 },
          { dx: w0, dy: 0 },
          { dx: 0, dy: h0 },
          { dx: w0, dy: h0 },
        ] as const;

        for (let i = 0; i < 4; i += 1) {
          ctx.drawImage(images[i], positions[i].dx, positions[i].dy, w0, h0);
        }

        resolve(out.toDataURL('image/jpeg', 0.92));
      } catch {
        resolve(null);
      }
    };

    images.forEach((img, i) => {
      img.onload = () => doneOne();
      img.onerror = () => doneOne();
      img.src = dataUrls[i];
    });
  });
}
