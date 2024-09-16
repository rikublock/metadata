import "@fontsource/inter";
import { CssBaseline } from "@mui/joy";
import { CssVarsProvider } from "@mui/joy/styles";

import FilesProvider from "./contexts/FilesContext";
import MediaInfoProvider from "./contexts/MediaInfoContext";
import Main from "./Main";

export default function App() {
  return (
    <CssVarsProvider>
      <CssBaseline />
      <FilesProvider>
        <MediaInfoProvider>
          <Main />
        </MediaInfoProvider>
      </FilesProvider>
    </CssVarsProvider>
  );
}
