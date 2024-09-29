import React from "react";

import GithubCorner from "react-github-corner";

import { Alert, Box, Stack, Typography } from "@mui/joy";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { useFilesApi } from "./contexts/FilesContext";
import DataTabs from "./components/DataTabs";
import Dropzone from "./components/Dropzone";
import ScrollTopButton from "./components/ScrollTopButton";

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
      id="anchor-back-to-top"
      sx={{
        padding: "2rem",
        margin: "auto",
        maxWidth: "60rem",
        minHeight: "100dvh",
      }}
    >
      <GithubCorner href="https://github.com/rikublock/metadata-reader" />
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
      <ScrollTopButton />
    </Box>
  );
}
