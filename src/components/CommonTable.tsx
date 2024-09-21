import React from "react";

import { Box, Table } from "@mui/joy";

import { Section } from "../types";

type Props = {
  section: Section;
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
            <td>
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
