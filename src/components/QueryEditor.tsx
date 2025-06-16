import { Clock, Code, Play } from "lucide-react";
import React, { useState } from "react";

interface QueryEditorProps {
  query: string;
  onQueryChange: (query: string) => void;
  onExecute: () => void;
  isExecuting: boolean;
  executionTime?: number;
}

export const QueryEditor: React.FC<QueryEditorProps> = ({
  query,
  onQueryChange,
  onExecute,
  isExecuting,
  executionTime,
}) => {
  const [localQuery, setLocalQuery] = useState(query);

  const handleExecute = () => {
    onQueryChange(localQuery);
    onExecute();
  };

  const insertSampleQuery = () => {
    const sampleQuery = `SELECT 
  ID,
  Name,
  Email,
  Department,
  Salary,
  Join_Date,
  Status
FROM Employees
WHERE Status = 'Active'
ORDER BY Salary DESC;`;
    setLocalQuery(sampleQuery);
    onQueryChange(sampleQuery);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            Ingrese la consulta
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {executionTime && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{executionTime.toFixed(0)}ms</span>
            </div>
          )}

          <button
            onClick={insertSampleQuery}
            className="px-3 py-1 text-sm transition-colors border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Sample Query
          </button>

          <button
            onClick={handleExecute}
            disabled={isExecuting || !localQuery.trim()}
            className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExecuting ? (
              <>
                <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Execute
              </>
            )}
          </button>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="w-full h-48 px-4 py-3 font-mono text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ejemplo: SELECT * FROM table_name WHERE condition;"
          spellCheck={false}
        />

        <div className="absolute text-xs text-gray-400 bottom-2 right-2">
          Lines: {localQuery.split("\n").length} | Characters:{" "}
          {localQuery.length}
        </div>
      </div>
    </div>
  );
};
