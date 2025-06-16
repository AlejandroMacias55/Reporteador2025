import { ChevronDown, ChevronUp, Search, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { SavedConnection } from "../types/database";

interface SavedConnectionsProps {
  connections: SavedConnection[];
  onSelect: (connection: SavedConnection) => void;
  onDelete: (id: string) => void;
}

export const SavedConnections: React.FC<SavedConnectionsProps> = ({
  connections,
  onSelect,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConnections = connections.filter((conn) =>
    conn.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-md">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full p-4 text-left"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-800">
            Conexiones Guardadas ({connections.length})
          </h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4 border-t border-gray-200">
          <div className="relative mb-4">
            <Search className="absolute w-5 h-5 text-gray-400 left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar conexiones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {filteredConnections.length > 0 ? (
            <div className="space-y-2 overflow-y-auto max-h-60">
              {filteredConnections.map((connection) => (
                <div
                  key={connection.id}
                  className="flex items-center justify-between p-3 transition-colors border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">
                      {connection.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {connection.config.type.toUpperCase()} •{" "}
                      {new Date(connection.lastUsed).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelect(connection)}
                      className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Usar
                    </button>
                    <button
                      onClick={() => onDelete(connection.id)}
                      className="p-1 text-red-600 rounded-md hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              {searchTerm
                ? "No se encontraron conexiones"
                : "No hay conexiones guardadas"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
