import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Search,
  Share2,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { Filter as FilterType, QueryResult } from "../types/database";

interface ResultsTableProps {
  results: QueryResult;
  onShare?: () => void; // Make onShare optional
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  results,
  onShare,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const filteredAndSortedData = useMemo(() => {
    let data = results.rows;

    // Apply search
    if (searchTerm) {
      data = data.filter((row) =>
        row.some((cell) =>
          cell?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply filters
    filters.forEach((filter) => {
      const columnIndex = results.columns.indexOf(filter.column);
      if (columnIndex !== -1) {
        data = data.filter((row) => {
          const cellValue = row[columnIndex]?.toString().toLowerCase() || "";
          const filterValue = filter.value.toLowerCase();

          switch (filter.operator) {
            case "equals":
              return cellValue === filterValue;
            case "contains":
              return cellValue.includes(filterValue);
            case "startsWith":
              return cellValue.startsWith(filterValue);
            case "endsWith":
              return cellValue.endsWith(filterValue);
            case "greaterThan":
              return parseFloat(cellValue) > parseFloat(filterValue);
            case "lessThan":
              return parseFloat(cellValue) < parseFloat(filterValue);
            default:
              return true;
          }
        });
      }
    });

    // Apply sorting
    if (sortColumn) {
      const columnIndex = results.columns.indexOf(sortColumn);
      if (columnIndex !== -1) {
        data = [...data].sort((a, b) => {
          const aVal = a[columnIndex];
          const bVal = b[columnIndex];

          if (aVal === bVal) return 0;

          const comparison = aVal < bVal ? -1 : 1;
          return sortDirection === "asc" ? comparison : -comparison;
        });
      }
    }

    return data;
  }, [results, searchTerm, filters, sortColumn, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(start, start + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column)
      return <ArrowUpDown className="w-4 h-4 opacity-40" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ArrowDown className="w-4 h-4 text-blue-600" />
    );
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([
      results.columns,
      ...filteredAndSortedData,
    ]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Query Results");

    const fileName = `query_results_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const addFilter = () => {
    setFilters([
      ...filters,
      { column: results.columns[0], operator: "contains", value: "" },
    ]);
  };

  const updateFilter = (index: number, filter: FilterType) => {
    const newFilters = [...filters];
    newFilters[index] = filter;
    setFilters(newFilters);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Query Results ({filteredAndSortedData.length} rows)
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="flex items-center gap-2 px-3 py-2 transition-colors border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-3 py-2 transition-colors border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              Excel
            </button>

            {onShare && ( // Only show share button if onShare is provided
              <button
                onClick={onShare}
                className="flex items-center gap-2 px-3 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Search in results..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Panel */}
        {showFilterPanel && (
          <div className="p-4 mt-4 rounded-md bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-700">Filters</h3>
              <button
                onClick={addFilter}
                className="px-3 py-1 text-sm text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Add Filter
              </button>
            </div>

            {filters.map((filter, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <select
                  value={filter.column}
                  onChange={(e) =>
                    updateFilter(index, { ...filter, column: e.target.value })
                  }
                  className="px-2 py-1 text-sm border border-gray-300 rounded"
                >
                  {results.columns.map((column) => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  ))}
                </select>

                <select
                  value={filter.operator}
                  onChange={(e) =>
                    updateFilter(index, {
                      ...filter,
                      operator: e.target.value as FilterType["operator"],
                    })
                  }
                  className="px-2 py-1 text-sm border border-gray-300 rounded"
                >
                  <option value="contains">Contains</option>
                  <option value="equals">Equals</option>
                  <option value="startsWith">Starts with</option>
                  <option value="endsWith">Ends with</option>
                  <option value="greaterThan">Greater than</option>
                  <option value="lessThan">Less than</option>
                </select>

                <input
                  type="text"
                  value={filter.value}
                  onChange={(e) =>
                    updateFilter(index, { ...filter, value: e.target.value })
                  }
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                  placeholder="Filter value..."
                />

                <button
                  onClick={() => removeFilter(index)}
                  className="px-2 py-1 text-sm text-red-600 rounded hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            ))}

            {filters.length === 0 && (
              <p className="text-sm text-gray-500">No filters applied</p>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {results.columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase transition-colors cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column}</span>
                    {getSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="transition-colors hover:bg-gray-50">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap"
                  >
                    {cell?.toString() || ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 text-sm border border-gray-300 rounded"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-700">entries</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 transition-colors border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="p-2 transition-colors border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
