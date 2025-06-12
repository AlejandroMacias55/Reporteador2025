import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { DatabaseManager } from './database/DatabaseManager.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Database manager instance
const dbManager = new DatabaseManager();

// Test database connection
app.post('/api/test-connection', async (req, res) => {
  try {
    const { config } = req.body;
    
    if (!config || !config.type || !config.connectionString) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid configuration provided' 
      });
    }

    const result = await dbManager.testConnection(config);
    
    if (result.success) {
      res.json({ success: true, message: 'Connection successful' });
    } else {
      res.status(400).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Connection test error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error during connection test' 
    });
  }
});

// Execute query
app.post('/api/execute-query', async (req, res) => {
  try {
    const { config, query } = req.body;
    
    if (!config || !query) {
      return res.status(400).json({ 
        success: false, 
        error: 'Configuration and query are required' 
      });
    }

    // Basic SQL injection protection
    const dangerousKeywords = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER', 'CREATE', 'INSERT', 'UPDATE'];
    const upperQuery = query.toUpperCase();
    
    for (const keyword of dangerousKeywords) {
      if (upperQuery.includes(keyword)) {
        return res.status(400).json({ 
          success: false, 
          error: `Query contains potentially dangerous keyword: ${keyword}. Only SELECT queries are allowed.` 
        });
      }
    }

    const startTime = Date.now();
    const result = await dbManager.executeQuery(config, query);
    const executionTime = Date.now() - startTime;
    
    if (result.success) {
      res.json({ 
        success: true, 
        data: {
          columns: result.columns,
          rows: result.rows,
          totalRows: result.rows.length,
          executionTime
        }
      });
    } else {
      res.status(400).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Query execution error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error during query execution' 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Database Query API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});