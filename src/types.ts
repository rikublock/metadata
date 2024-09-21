export enum TableType {
  COMMON,
}

export type Row = {
  key: string;
  value: string;
  type?: "string" | "json" | "code";
};

export type Section = {
  title: string;
  rows: Row[];
  type: TableType;
};
