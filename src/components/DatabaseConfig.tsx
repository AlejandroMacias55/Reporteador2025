import React, { useState } from 'react';
import { Database, Server, TestTube, Check, X, Loader2, Info } from 'lucide-react';
import { DatabaseConfig as DatabaseConfigType } from '../types/database';

interface DatabaseConfigProps {
  config: DatabaseConfigType | null;
  onConfigChange: (config: DatabaseConfigType) => void;
  onTestConnection: (config: DatabaseConfigType) => Promise<boolean>;
  isConnecting: boolean;
  connectionStatus: 'idle' | 'connected' | 'error';
}

const DATABASE_TYPES = [
  { value: 'sqlserver', label: 'SQL Server', icon: Server },
  { value: 'mysql', label: 'MySQL', icon: Database },
  { value: 'postgresql', label: 'PostgreSQL', icon: Database },
  { value: 'oracle', label: 'Oracle', icon: Database }
] as const;

const CONNECTION_EXAMPLES = {
  sqlserver: 'Server=localhost,1433;Database=mydb;User Id=sa;Password=mypassword;Encrypt=true;TrustServerCertificate=true;',
  mysql: 'mysql://username:password@localhost:3306/database_name',
  postgresql: 'postgresql://username:password@localhost:5432/database_name',
  oracle: 'username/password@localhost:1521/XE'
};

export const DatabaseConfig: React.FC<DatabaseConfigProps> = ({
  config,
  onConfigChange,
  onTestConnection,
  isConnecting,
  connectionStatus
}) => {
  const [localConfig, setLocalConfig] = useState<DatabaseConfigType>(
    config || {
      id: crypto.randomUUID(),
      type: 'sqlserver',
      connectionString: '',
      name: ''
    }
  );
  const [showExample, setShowExample] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (localConfig.connectionString && localConfig.name) {
      onConfigChange(localConfig);
      await onTestConnection(localConfig);
    }
  };

  const getConnectionStatusIcon = () => {
    if (isConnecting) return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    if (connectionStatus === 'connected') return <Check className="w-4 h-4 text-green-500" />;
    if (connectionStatus === 'error') return <X className="w-4 h-4 text-red-500" />;
    return null;
  };

  const getConnectionStatusText = () => {
    if (isConnecting) return 'Connecting...';
    if (connectionStatus === 'connected') return 'Connected';
    if (connectionStatus === 'error') return 'Connection Failed';
    return '';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Database className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Database Configuration</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Connection Name
          </label>
          <input
            type="text"
            value={localConfig.name}
            onChange={(e) => setLocalConfig({ ...localConfig, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="My Production Database"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Database Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {DATABASE_TYPES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setLocalConfig({ ...localConfig, type: value })}
                className={`flex items-center gap-2 p-3 border rounded-md transition-colors ${
                  localConfig.type === value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Connection String
            </label>
            <button
              type="button"
              onClick={() => setShowExample(!showExample)}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
            >
              <Info className="w-3 h-3" />
              Example
            </button>
          </div>
          
          {showExample && (
            <div className="mb-2 p-2 bg-gray-50 border border-gray-200 rounded text-xs font-mono text-gray-600">
              {CONNECTION_EXAMPLES[localConfig.type]}
            </div>
          )}
          
          <textarea
            value={localConfig.connectionString}
            onChange={(e) => setLocalConfig({ ...localConfig, connectionString: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            rows={3}
            placeholder={CONNECTION_EXAMPLES[localConfig.type]}
            required
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 text-yellow-600 mt-0.5">⚠️</div>
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Security Notice</p>
              <p>Only SELECT queries are allowed for security. Connection strings are processed server-side.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            {getConnectionStatusIcon()}
            <span className="text-sm text-gray-600">{getConnectionStatusText()}</span>
          </div>
          
          <button
            type="submit"
            disabled={isConnecting || !localConfig.connectionString || !localConfig.name}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <TestTube className="w-4 h-4" />
            Test Connection
          </button>
        </div>
      </form>
    </div>
  );
};