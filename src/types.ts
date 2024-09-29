export enum TableType {
  COMMON,
  TENSOR,
}

type RowCommon = {
  key: string;
  value: string;
  type?: "string" | "json" | "code" | "loader";
};

type RowTensor = {
  name: string;
  dtype: Tensor["dtype"];
  shape: Tensor["shape"];
};

type RowMap = {
  [TableType.COMMON]: RowCommon;
  [TableType.TENSOR]: RowTensor;
};

export type Row<T extends TableType> = RowMap[T];

export type Section<T extends TableType> = {
  title: string;
  rows: Row<T>[];
  type: T;
};

type Tensor = {
  dtype: string;
  shape: number[];
  data_offsets: [number, number];
};

type Metadata = Record<string, string>;

export type Safetensors = {
  __metadata__: Metadata;
  [key: string]: Tensor | Metadata;
};
