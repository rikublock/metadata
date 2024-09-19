/**
 * Compute the sha256 checksum.
 *
 * @param file input file
 * @returns hash hex string
 */
export async function computeSha256sum(file: File): Promise<string> {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      const hash = await crypto.subtle.digest(
        "SHA-256",
        reader.result as ArrayBuffer,
      );
      const hex = Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      resolve(hex);
    };

    reader.onerror = () => {
      reader.abort();
      reject(new DOMException("Problem parsing input file"));
    };

    reader.readAsArrayBuffer(file);
  });
}
