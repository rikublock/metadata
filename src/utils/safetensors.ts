const HEADER_MAX_SIZE = 10n * 1024n * 1024n;

/**
 * Extract header metadata from model.safetensors file.
 *
 * see: https://huggingface.co/docs/safetensors/en/index#format
 * see: https://github.com/huggingface/safetensors?tab=readme-ov-file#format
 *
 * @param file input file
 * @returns json string
 */
export async function readSafetensorsMetadata(file: File): Promise<string> {
  const bufferLength = await file.slice(0, 8).arrayBuffer();
  const length = new DataView(bufferLength).getBigUint64(0, true);
  if (length > HEADER_MAX_SIZE) {
    throw new DOMException("Invalid header length");
  }

  const reader = new FileReader();
  const decoder = new TextDecoder("utf-8");

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      const header = decoder.decode(reader.result as ArrayBuffer);
      if (!header.startsWith("{")) {
        reject(new DOMException("Malformed header"));
      }

      resolve(header);
    };

    reader.onerror = () => {
      reader.abort();
      reject(new DOMException("Problem parsing input file"));
    };

    const slice = file.slice(8, 8 + Number(length));
    reader.readAsArrayBuffer(slice);
  });
}
