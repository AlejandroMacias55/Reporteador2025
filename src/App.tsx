import { AlertCircle, Database } from "lucide-react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { DatabaseConfig } from "./components/DatabaseConfig";
import { QueryEditor } from "./components/QueryEditor";
import { ResultsTable } from "./components/ResultsTable";
import { SavedConnections } from "./components/SavedConnections";
import { ShareDialog } from "./components/ShareDialog";
import { useDatabase } from "./hooks/useDatabase";
import { useSavedConnections } from "./hooks/useSavedConnections";
import {
  DatabaseConfig as DatabaseConfigType,
  SavedConnection,
  ShareableQuery,
} from "./types/database";
import { getSharedQueryFromUrl } from "./utils/urlSharing";

function App() {
  const [config, setConfig] = useState<DatabaseConfigType | null>(null);
  const [query, setQuery] = useState("");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [isSharedView, setIsSharedView] = useState(false);
  const [customColumnNames, setCustomColumnNames] = useState<{
    [key: string]: string;
  }>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    isConnecting,
    isExecuting,
    connectionStatus,
    results,
    error,
    testConnection,
    executeQuery,
  } = useDatabase();

  const { savedConnections, saveConnection, deleteConnection } =
    useSavedConnections();

  // Check for shared query on mount
  useEffect(() => {
    const sharedQuery = getSharedQueryFromUrl();
    if (sharedQuery) {
      setConfig(sharedQuery.config);
      setQuery(sharedQuery.query);
      setIsSharedView(true);
      setCustomColumnNames(sharedQuery.customColumnNames || {});

      // Auto-execute the shared query
      testConnection(sharedQuery.config).then((success) => {
        if (success) {
          executeQuery(sharedQuery.config, sharedQuery.query);
        }
      });
    }
  }, [testConnection, executeQuery]);

  const handleExecuteQuery = async () => {
    if (config && query.trim()) {
      await executeQuery(config, query);
    }
  };

  const handleShare = () => {
    if (config && query) {
      setShowShareDialog(true);
    }
  };

  const handleRefresh = async () => {
    if (!config || !query) return;

    setIsRefreshing(true);
    try {
      await executeQuery(config, query);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getShareableQuery = (): ShareableQuery => ({
    config: config!,
    query,
    timestamp: Date.now(),
    customColumnNames,
  });

  // Add this function to handle saving connections
  const handleSaveConnection = () => {
    if (config) {
      const connection: SavedConnection = {
        id: uuidv4(),
        name: config.name,
        config,
        lastQuery: query,
        lastUsed: Date.now(),
      };
      saveConnection(connection);
    }
  };

  // Add this function to handle selecting a saved connection
  const handleSelectConnection = (connection: SavedConnection) => {
    setConfig(connection.config);
    if (connection.lastQuery) {
      setQuery(connection.lastQuery);
    }
    // Update last used timestamp
    saveConnection({
      ...connection,
      lastUsed: Date.now(),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isSharedView ? config?.name : "Reporteador de Consultas"}
              </h1>
              <p className="text-sm text-gray-600">
                {isSharedView
                  ? `Base de datos ${config?.type.toUpperCase()}`
                  : "Conéctate, consulta y analiza los datos de tu base de datos"}
              </p>
            </div>
            {isSharedView && (
              <div className="px-3 py-1 ml-auto text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                Vista de Consulta Compartida
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Error Display */}
          {error && (
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="font-medium text-red-800">Error</p>
              </div>
              <p className="mt-1 text-red-700">{error}</p>
            </div>
          )}

          {/* Only show Database Configuration and Query Editor if not in shared view */}
          {!isSharedView && (
            <>
              <SavedConnections
                connections={savedConnections}
                onSelect={handleSelectConnection}
                onDelete={deleteConnection}
              />
              <DatabaseConfig
                config={config}
                onConfigChange={setConfig}
                onTestConnection={testConnection}
                isConnecting={isConnecting}
                connectionStatus={connectionStatus}
                onSaveConnection={handleSaveConnection} // Add this prop
              />

              {connectionStatus === "connected" && (
                <QueryEditor
                  query={query}
                  onQueryChange={setQuery}
                  onExecute={handleExecuteQuery}
                  isExecuting={isExecuting}
                  executionTime={results?.executionTime}
                />
              )}
            </>
          )}

          {/* Results Table */}
          {results && (
            <ResultsTable
              results={results}
              onShare={!isSharedView ? handleShare : undefined}
              onRefresh={isSharedView ? handleRefresh : undefined}
              isRefreshing={isRefreshing}
              initialCustomColumnNames={customColumnNames}
              onCustomColumnNamesChange={setCustomColumnNames}
            />
          )}

          {/* Connection Status - Only show if not in shared view */}
          {!isSharedView && connectionStatus === "idle" && config && (
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 text-blue-600">ℹ️</div>
                <p className="font-medium text-blue-800">Ready to Connect</p>
              </div>
              <p className="mt-1 text-blue-700">
                Click "testear conexion" para establecer una conexión a tu base
                de datos.
              </p>
            </div>
          )}

          {/* No Results Message - Only show if not in shared view */}
          {!isSharedView &&
            connectionStatus === "connected" &&
            !results &&
            !isExecuting &&
            query && (
              <div className="p-8 text-center border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-gray-600">
                  Click ejecutar consulta para ejecutar tu consulta y ver los
                  resultados aquí.
                </p>
              </div>
            )}
        </div>
      </main>

      {/* Share Dialog - Only show if not in shared view */}
      {!isSharedView && config && query && (
        <ShareDialog
          isOpen={showShareDialog}
          onClose={() => setShowShareDialog(false)}
          shareableQuery={getShareableQuery()}
        />
      )}
    </div>
  );
}

export default App;
