export interface DatabaseConfig {
  id: string;
  type: 'sqlserver' | 'mysql' | 'postgresql' | 'oracle';
  connectionString: string;
  name: string;
}

export interface QueryResult {
  columns: string[];
  rows: any[][];
  totalRows: number;
  executionTime: number;
}

export interface Filter {
  column: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
  value: string;
}

export interface ShareableQuery {
  config: DatabaseConfig;
  query: string;
  timestamp: number;
}