import { ReactNode } from "react";

export interface DatabaseConfig {
  [x: string]: ReactNode;
  id: string;
  type: "sqlserver" | "mysql" | "postgresql" | "oracle";
  connectionString: string;
  name: string;
}

export interface QueryResult {
  columns: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[][];
  totalRows: number;
  executionTime: number;
}

export interface Filter {
  column: string;
  operator:
    | "equals"
    | "contains"
    | "startsWith"
    | "endsWith"
    | "greaterThan"
    | "lessThan";
  value: string;
}

export interface ShareableQuery {
  config: DatabaseConfig;
  query: string;
  timestamp: number;
  customColumnNames?: { [key: string]: string }; // Add this line
}

export interface SavedConnection {
  id: string;
  name: string;
  config: DatabaseConfig;
  lastQuery?: string;
  lastUsed: number;
}
