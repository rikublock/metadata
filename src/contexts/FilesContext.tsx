import React from "react";

export type FileInfo = { id: string; file: File };

type FilesDataContextType = {
  files: FileInfo[];
};

type FilesApiContextType = {
  setFiles: React.Dispatch<React.SetStateAction<FileInfo[]>>;
  addFiles: (f: File[]) => void;
  removeFile: (index: number) => void;
  reset: () => void;
};

type Props = {
  children: React.ReactNode;
};

const FilesDataContext = React.createContext<FilesDataContextType | null>(null);

const FilesApiContext = React.createContext<FilesApiContextType | null>(null);

export default function FilesProvider({ children }: Props) {
  const [files, setFiles] = React.useState<FileInfo[]>([]);

  const addFiles = React.useCallback((f: File[]) => {
    setFiles((x) => [
      ...x,
      ...f.map((file) => ({
        id: crypto.randomUUID(),
        file,
      })),
    ]);
  }, []);

  const removeFile = React.useCallback((index: number) => {
    setFiles((x) => {
      return x.filter((_, i) => i != index);
    });
  }, []);

  const reset = React.useCallback(() => {
    setFiles(() => []);
  }, []);

  const onPaste = React.useCallback(
    (event: ClipboardEvent): void => {
      console.debug("onPaste", event);
      if (event.clipboardData) {
        addFiles(Array.from(event.clipboardData!.files));
      }
    },
    [addFiles],
  );

  // Note: Only works in Chrome. Supports data blobs.
  React.useEffect(() => {
    window.addEventListener("paste", onPaste);
    return () => {
      window.removeEventListener("paste", onPaste);
    };
  }, [onPaste]);

  const valueData = React.useMemo(() => {
    return {
      files,
    };
  }, [files]);

  const valueApi = React.useMemo(() => {
    return {
      setFiles,
      addFiles,
      removeFile,
      reset,
    };
  }, [addFiles, removeFile, reset]);

  return (
    <FilesDataContext.Provider value={valueData}>
      <FilesApiContext.Provider value={valueApi}>
        {children}
      </FilesApiContext.Provider>
    </FilesDataContext.Provider>
  );
}

export function useFiles(): FilesDataContextType & FilesApiContextType {
  const data = useFilesData();
  const api = useFilesApi();

  return React.useMemo(
    () => ({
      ...data,
      ...api,
    }),
    [data, api],
  );
}

export function useFilesData(): FilesDataContextType {
  const context = React.useContext(FilesDataContext);
  if (!context) {
    throw Error(
      "useFilesData can only be used within the FilesProvider component",
    );
  }
  return context;
}

export function useFilesApi(): FilesApiContextType {
  const context = React.useContext(FilesApiContext);
  if (!context) {
    throw Error(
      "useFilesApi can only be used within the FilesProvider component",
    );
  }
  return context;
}
