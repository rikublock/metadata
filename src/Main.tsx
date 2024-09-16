import React from "react";

import { Alert, Box, Stack, Typography } from "@mui/joy";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import DataTabs from "./components/DataTabs";
import Dropzone from "./components/Dropzone";
import { useFilesApi } from "./contexts/FilesContext";

export default function Main() {
  const { addFiles } = useFilesApi();

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      console.debug("onDrop", acceptedFiles);
      addFiles(acceptedFiles);
    },
    [addFiles],
  );

  return (
    <Box
      component="main"
      sx={{
        padding: "2rem",
        margin: "auto",
        maxWidth: "60rem",
        minHeight: "100dvh",
      }}
    >
      <Stack spacing="0.75rem">
        <Typography level="h3">Analyze Media File Metadata</Typography>
        <Alert startDecorator={<InfoOutlinedIcon />}>
          Operates entirely on the client side; no data is ever uploaded or
          shared. The app works best in the Chrome browser, which also offers
          additional support for copying and pasting files.
        </Alert>
        <Dropzone onDrop={onDrop} />
        <DataTabs />
      </Stack>
    </Box>
  );
}
