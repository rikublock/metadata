import React from "react";

import {
  Box,
  Button,
  IconButton,
  Tab,
  TabList,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/joy";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import DataTabPanel from "./DataTabPanel";
import { formatFileName } from "../utils/format";
import { useFiles } from "../contexts/FilesContext";

const DataTabPanelMemo = React.memo(DataTabPanel);

// TODO add tab scroll buttons: https://mui.com/material-ui/react-tabs/#scrollable-tabs
export default function DataTabs() {
  const { files, removeFile, reset } = useFiles();
  const [value, setValue] = React.useState<number | string | null>(0);

  const onChange = React.useCallback(
    (
      event: React.SyntheticEvent | null,
      newValue: number | string | null,
    ): void => {
      console.debug("onChange", newValue);
      setValue(newValue);
    },
    [],
  );

  // TODO select new tab
  const onClickClose = React.useCallback(
    (index: number) => {
      console.debug("onClickClose", index);
      removeFile(index);
    },
    [removeFile],
  );

  const onClickClear = React.useCallback(() => {
    reset();
    setValue(0);
  }, [reset]);

  return (
    <React.Fragment>
      <Box>
        <Button
          sx={{ float: "right" }}
          onClick={onClickClear}
          disabled={files.length == 0}
          size="sm"
        >
          Clear
        </Button>
      </Box>
      <Tabs
        sx={(theme) => ({
          border: `1px solid ${theme.palette.neutral[200]}`,
          "--Tab-indicatorThickness": "1px",
        })}
        value={value}
        onChange={onChange}
      >
        <TabList
          sx={{
            overflow: "auto",
            scrollSnapType: "x mandatory",
            // "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {files.map((info, index) => (
            <Tooltip key={index} title={info.file.name} enterDelay={800}>
              <Tab
                sx={{ flex: "none", scrollSnapAlign: "start" }}
                variant="soft"
              >
                <IconButton
                  sx={{
                    position: "absolute",
                    right: "5px",
                    top: "50%",
                    transform: "translate(0%, -50%)",
                    "--IconButton-size": "1.5rem",
                  }}
                  component="span"
                  onClick={() => onClickClose(index)}
                >
                  <CloseRoundedIcon />
                </IconButton>
                <Box sx={{ marginRight: "0.75rem" }}>
                  {formatFileName(info.file.name, 16)}
                </Box>
              </Tab>
            </Tooltip>
          ))}
        </TabList>
        {files.length == 0 && (
          <Box
            sx={{
              minHeight: "10rem",
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                margin: "2rem",
                fontStyle: "italic",
              }}
              level="body-sm"
            >
              No Files
            </Typography>
          </Box>
        )}
        {files.map((info, index) => (
          <DataTabPanelMemo key={info.id} value={index} file={info.file} />
        ))}
      </Tabs>
    </React.Fragment>
  );
}
