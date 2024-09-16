import React from "react";

import mediaInfoFactory from "mediainfo.js";
import type { ReadChunkFunc, MediaInfo } from "mediainfo.js";

type MediaInfoContextType = React.MutableRefObject<
  MediaInfo<"object"> | undefined
>;

type Props = {
  children: React.ReactNode;
};

export function makeReadChunk(file: File): ReadChunkFunc {
  return async (chunkSize: number, offset: number) =>
    new Uint8Array(await file.slice(offset, offset + chunkSize).arrayBuffer());
}

const MediaInfoContext = React.createContext<MediaInfoContextType | null>(null);

export default function MediaInfoProvider({ children }: Props) {
  const ref = React.useRef<MediaInfo<"object">>();

  React.useEffect(() => {
    const load = async () => {
      ref.current = await mediaInfoFactory({
        format: "object",
        locateFile: (filename) => filename,
      });
    };

    load();

    return () => {
      if (ref.current) {
        ref.current.close();
      }
    };
  }, []);

  return (
    <MediaInfoContext.Provider value={ref}>
      {children}
    </MediaInfoContext.Provider>
  );
}

export function useMediaInfo(): MediaInfoContextType {
  const context = React.useContext(MediaInfoContext);
  if (!context) {
    throw Error(
      "useMediaInfo can only be used within the MediaInfoProvider component",
    );
  }
  return context;
}
