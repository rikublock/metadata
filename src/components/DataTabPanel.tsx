import React from "react";

import ExifReader from "exifreader";

import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Box,
  CircularProgress,
  Table,
  TabPanel,
} from "@mui/joy";

import { useMediaInfo, makeReadChunk } from "../contexts/MediaInfoContext";
import { formatFileSize, formatKey } from "../utils/format";
import { computeSha256sum } from "../utils/hash";

type Props = {
  value: string | number;
  file: File;
};

type Row = {
  key: string;
  value: string;
  isJson?: boolean;
};

type Section = {
  title: string;
  rows: Row[];
};

export default function DataTabPanel({ value, file }: Props) {
  const mediaInfoRef = useMediaInfo();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [sections, setSections] = React.useState<Section[]>([]);

  React.useEffect(() => {
    let mounted = true;

    const load = async (): Promise<void> => {
      if (mediaInfoRef.current) {
        setLoading(true);
        const content: Section[] = [];

        try {
          // compute hash checksum
          const hash = await computeSha256sum(file);

          // extract general file info
          content.push({
            title: "General",
            rows: [
              {
                key: "file_name",
                value: file.name,
              },
              {
                key: "file_size",
                value: formatFileSize(file.size),
              },
              {
                key: "mime_type",
                value: file.type,
              },
              {
                key: "hash_sha256",
                value: hash,
              },
            ],
          });

          // attempt to extract image metadata
          try {
            const t = await ExifReader.load(file, {
              includeUnknown: true,
              async: true,
            });

            delete t["MakerNote"];

            const r: Row[] = [];
            for (const [key, value] of Object.entries(t)) {
              let v = value.description.toString();
              let isJson = false;

              if (v == "[Unicode encoded text]") {
                if (Array.isArray(value.value)) {
                  v = String.fromCharCode(...(value.value as any));
                }
              } else if (v.startsWith("{")) {
                try {
                  const data = JSON.parse(value.description);
                  v = JSON.stringify(data, undefined, 2);
                  isJson = true;
                } catch (e) {
                  // okay, attempted to parse JSON, but didn't work
                }
              }

              r.push({
                key: formatKey(key),
                value: v,
                isJson,
              });
            }

            content.push({
              title: "Details",
              rows: r,
            });
            return;
          } catch (e) {
            if ((e as Error).message != "Invalid image format") {
              throw e;
            }
          }

          // attempt to extract video metadata
          const result = await mediaInfoRef.current.analyzeData(
            file.size,
            makeReadChunk(file),
          );

          result.media?.track.map((t) => {
            content.push({
              title: t["@type"],
              rows: Object.entries(t)
                .filter(([k]) => !k.startsWith("@"))
                .map(([k, v]) => {
                  let value = v.toString();
                  let isJson = false;
                  if (typeof v == "object") {
                    value = JSON.stringify(v, undefined, 2);
                    isJson = true;
                  }
                  return {
                    key: formatKey(k),
                    value,
                    isJson,
                  };
                }),
            });
          });
        } finally {
          if (mounted) {
            setSections(content);
            setLoading(false);
          }
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [file, mediaInfoRef]);

  return (
    <TabPanel value={value}>
      <AccordionGroup disableDivider>
        {!loading ? (
          <React.Fragment>
            {sections.map((section, index) => (
              <Accordion key={index} defaultExpanded>
                <AccordionSummary
                  sx={(theme) => ({
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    "& .MuiAccordionSummary-button": {
                      fontWeight: theme.fontWeight.lg,
                    },
                  })}
                >
                  {section.title}
                </AccordionSummary>
                <AccordionDetails>
                  <Table>
                    <tbody>
                      {section.rows.map((row, index) => (
                        <tr key={index}>
                          <th
                            style={{ width: "28%", verticalAlign: "top" }}
                            scope="row"
                          >
                            {row.key}
                          </th>
                          <td>
                            {row.isJson ? (
                              <Box
                                component="pre"
                                sx={{
                                  margin: 0,
                                  overflow: "hidden",
                                  whiteSpace: "break-spaces",
                                }}
                              >
                                {row.value}
                              </Box>
                            ) : (
                              <React.Fragment>{row.value}</React.Fragment>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </AccordionDetails>
              </Accordion>
            ))}
          </React.Fragment>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </AccordionGroup>
    </TabPanel>
  );
}
