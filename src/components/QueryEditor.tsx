import React, { useState } from 'react';
import { Play, Code, Clock } from 'lucide-react';

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
  executionTime
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">SQL Query Editor</h2>
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
            className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Sample Query
          </button>
          
          <button
            onClick={handleExecute}
            disabled={isExecuting || !localQuery.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isExecuting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
          className="w-full h-48 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          placeholder="Enter your SQL query here..."
          spellCheck={false}
        />
        
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          Lines: {localQuery.split('\n').length} | 
          Characters: {localQuery.length}
        </div>
      </div>
    </div>
  );
};