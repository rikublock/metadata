import { DropzoneOptions, useDropzone } from "react-dropzone";

import { Box, Sheet, Typography } from "@mui/joy";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

type Props = {
  onDrop?: DropzoneOptions["onDrop"];
};

export default function Dropzone({ onDrop }: Props) {
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Sheet
      sx={(theme) => ({
        padding: "0.875rem",
        border: `1px solid ${theme.palette.neutral[200]}`,
        display: "inline-block",
      })}
    >
      <Box
        sx={(theme) => ({
          minHeight: "250px",
          border: `2px dashed ${theme.palette.neutral[300]}`,
          cursor: "pointer",
          overflow: "hidden",
        })}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <Typography sx={{ margin: "1.5rem 0rem" }} level="h4">
            Drag and drop some files here, or click to select files
          </Typography>
          <CloudUploadIcon sx={{ height: "3rem", width: "auto" }} />
        </Box>
      </Box>
    </Sheet>
  );
}
