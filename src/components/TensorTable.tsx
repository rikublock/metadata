import React from "react";

import { Table } from "@mui/joy";

import { Section, TableType } from "../types";

type Props = {
  section: Section<TableType.TENSOR>;
};

export default function TensorTable({ section }: Props) {
  return (
    <Table stripe="odd">
      <thead>
        <tr>
          <th>Identifier</th>
          <th style={{ width: "20%" }}>Shape</th>
          <th style={{ width: "10%" }}>Precision</th>
        </tr>
      </thead>
      <tbody>
        {section.rows.map((row, index) => (
          <tr key={index}>
            <td>{row.name}</td>
            <td>[{row.shape.join(", ")}]</td>
            <td>{row.dtype}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
