import React from "react";

import { Box, CircularProgress, Table, Tooltip } from "@mui/joy";

import { Section, TableType } from "../types";

type Props = {
  section: Section<TableType.COMMON>;
};

export default function CommonTable({ section }: Props) {
  return (
    <Table>
      <tbody>
        {section.rows.map((row, index) => (
          <tr key={index}>
            <th style={{ width: "28%", verticalAlign: "top" }} scope="row">
              {row.key}
            </th>
            <td style={{ verticalAlign: "top" }}>
              {row.type == "json" ? (
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
              ) : row.type == "code" ? (
                <React.Fragment>{row.value}</React.Fragment>
              ) : row.type == "loader" ? (
                <Tooltip title={row.value}>
                  <CircularProgress
                    sx={{
                      "--CircularProgress-size": "20px",
                      "--CircularProgress-trackThickness": "3px",
                      "--CircularProgress-progressThickness": "3px",
                    }}
                  />
                </Tooltip>
              ) : (
                <React.Fragment>{row.value}</React.Fragment>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
