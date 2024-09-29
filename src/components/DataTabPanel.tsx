import React from "react";

import ExifReader from "exifreader";
import JSON5 from "json5";

import {
  Accordion,
  AccordionDetails,
  AccordionGroup,
  AccordionSummary,
  Box,
  CircularProgress,
  TabPanel,
} from "@mui/joy";

import { useMediaInfo, makeReadChunk } from "../contexts/MediaInfoContext";
import { formatFileSize, formatKey, formatNumber } from "../utils/format";
import { computeSha256sum } from "../utils/hash";
import { readSafetensorsMetadata } from "../utils/safetensors";
import { Row, Safetensors, Section, TableType } from "../types";
import CommonTable from "./CommonTable";
import TensorTable from "./TensorTable";

type Props = {
  value: string | number;
  file: File;
};

export default function DataTabPanel({ value, file }: Props) {
  const mediaInfoRef = useMediaInfo();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [hash, setHash] = React.useState<string>("");
  const [sections, setSections] = React.useState<Section<TableType>[]>([]);

  // compute hash checksum
  React.useEffect(() => {
    let mounted = true;

    const load = async (): Promise<void> => {
      const h = await computeSha256sum(file);
      if (mounted) {
        setHash(h);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [file]);

  // compute metadata
  React.useEffect(() => {
    let mounted = true;

    const load = async (): Promise<void> => {
      if (mediaInfoRef.current) {
        setLoading(true);
        const content: Section<TableType>[] = [];

        try {
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
                value: "Computing...",
                type: "loader",
              },
            ],
            type: TableType.COMMON,
          });

          // attempt to extract safetensors metadata
          try {
            if (file.name.toLowerCase().endsWith(".safetensors")) {
              const data = await readSafetensorsMetadata(file);
              const tensors = JSON5.parse<Safetensors>(data);

              const tensorTypes = new Set<string>();
              let paramCount = 0n;

              const rowsTensor: Row<TableType.TENSOR>[] = Object.entries(
                tensors,
              )
                .filter(([k]) => k != "__metadata__")
                .map(([k, v]) => {
                  tensorTypes.add(v.dtype);
                  paramCount += (v.shape as number[]).reduce(
                    (a, b) => a * BigInt(b),
                    1n,
                  );
                  return {
                    name: k,
                    dtype: v.dtype,
                    shape: v.shape as number[],
                  };
                });

              const rowsCommon: Row<TableType.COMMON>[] = [
                {
                  key: "parameter_count",
                  value: formatNumber(Number(paramCount)),
                },
                {
                  key: "tensor_dtypes",
                  value: [...tensorTypes].join(", "),
                },
              ];

              if (tensors.__metadata__) {
                Object.entries(tensors.__metadata__).forEach(([k, v]) => {
                  rowsCommon.push({
                    key: formatKey(k),
                    value: v,
                  });
                });
              }

              content.push({
                title: "Model",
                rows: rowsCommon,
                type: TableType.COMMON,
              });

              content.push({
                title: "Tensors",
                rows: rowsTensor,
                type: TableType.TENSOR,
              });

              // success, no need to try other extraction tools
              return;
            }
          } catch (e) {
            if (
              !["Invalid header length", "Malformed header"].includes(
                (e as Error).message,
              )
            ) {
              throw e;
            }
          }

          // attempt to extract image metadata
          try {
            const tags = await ExifReader.load(file, {
              includeUnknown: true,
              async: true,
            });

            delete tags["MakerNote"];

            const r: Row<TableType.COMMON>[] = [];
            for (const [key, value] of Object.entries(tags)) {
              let v = value.description.toString();
              let type: Row<TableType.COMMON>["type"] = "string";

              if (v == "[Unicode encoded text]") {
                if (Array.isArray(value.value) && value.value.length >= 8) {
                  let text = "";
                  const view = new DataView(
                    Uint8Array.from(value.value as any).slice(8).buffer,
                  );
                  for (let offset = 0; offset < view.byteLength; offset += 2) {
                    const code = view.getUint16(offset, false);
                    text += String.fromCodePoint(code);
                  }
                  v = text;
                }
              } else if (v.startsWith("{")) {
                try {
                  const data = JSON5.parse(value.description);
                  v = JSON5.stringify(data, { space: 2, quote: '"' });
                  type = "json";
                } catch (e) {
                  // okay, attempted to parse JSON, but didn't work
                }
              }

              r.push({
                key: formatKey(key),
                value: v,
                type,
              });
            }

            content.push({
              title: "Details",
              rows: r,
              type: TableType.COMMON,
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
                  let type: Row<TableType.COMMON>["type"] = "string";
                  if (typeof v == "object") {
                    value = JSON5.stringify(v, { space: 2, quote: '"' });
                    type = "json";
                  }
                  return {
                    key: formatKey(k),
                    value,
                    type,
                  };
                }),
              type: TableType.COMMON,
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

  // add checksum hash
  const sectionsUpdated = React.useMemo(() => {
    if (hash.length > 0 && sections.length > 0) {
      const row = sections[0].rows[3] as Row<TableType.COMMON>;
      row.value = hash;
      row.type = "string";
    }
    return sections;
  }, [sections, hash]);

  return (
    <TabPanel value={value}>
      <AccordionGroup disableDivider>
        {!loading ? (
          <React.Fragment>
            {sectionsUpdated.map((section, index) => (
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
                  {section.type == TableType.TENSOR ? (
                    <TensorTable
                      section={section as Section<TableType.TENSOR>}
                    />
                  ) : (
                    <CommonTable
                      section={section as Section<TableType.COMMON>}
                    />
                  )}
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
