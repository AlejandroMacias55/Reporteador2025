import mysql from 'mysql2/promise';
import pg from 'pg';
import sql from 'mssql';
// import oracledb from 'oracledb'; // Uncomment if using Oracle

export class DatabaseManager {
  constructor() {
    this.connections = new Map();
  }

  async testConnection(config) {
    try {
      switch (config.type) {
        case 'mysql':
          return await this.testMySQLConnection(config);
        case 'postgresql':
          return await this.testPostgreSQLConnection(config);
        case 'sqlserver':
          return await this.testSQLServerConnection(config);
        case 'oracle':
          return await this.testOracleConnection(config);
        default:
          return { success: false, error: 'Unsupported database type' };
      }
    } catch (error) {
      console.error('Database connection test failed:', error);
      return { success: false, error: error.message };
    }
  }

  async executeQuery(config, query) {
    try {
      switch (config.type) {
        case 'mysql':
          return await this.executeMySQLQuery(config, query);
        case 'postgresql':
          return await this.executePostgreSQLQuery(config, query);
        case 'sqlserver':
          return await this.executeSQLServerQuery(config, query);
        case 'oracle':
          return await this.executeOracleQuery(config, query);
        default:
          return { success: false, error: 'Unsupported database type' };
      }
    } catch (error) {
      console.error('Query execution failed:', error);
      return { success: false, error: error.message };
    }
  }

  // MySQL Implementation
  async testMySQLConnection(config) {
    let connection;
    try {
      connection = await mysql.createConnection(config.connectionString);
      await connection.ping();
      return { success: true };
    } catch (error) {
      return { success: false, error: `MySQL connection failed: ${error.message}` };
    } finally {
      if (connection) await connection.end();
    }
  }

  async executeMySQLQuery(config, query) {
    let connection;
    try {
      connection = await mysql.createConnection(config.connectionString);
      const [rows, fields] = await connection.execute(query);
      
      const columns = fields.map(field => field.name);
      const data = rows.map(row => columns.map(col => row[col]));
      
      return { success: true, columns, rows: data };
    } catch (error) {
      return { success: false, error: `MySQL query failed: ${error.message}` };
    } finally {
      if (connection) await connection.end();
    }
  }

  // PostgreSQL Implementation
  async testPostgreSQLConnection(config) {
    const client = new pg.Client(config.connectionString);
    try {
      await client.connect();
      await client.query('SELECT 1');
      return { success: true };
    } catch (error) {
      return { success: false, error: `PostgreSQL connection failed: ${error.message}` };
    } finally {
      await client.end();
    }
  }

  async executePostgreSQLQuery(config, query) {
    const client = new pg.Client(config.connectionString);
    try {
      await client.connect();
      const result = await client.query(query);
      
      const columns = result.fields.map(field => field.name);
      const rows = result.rows.map(row => columns.map(col => row[col]));
      
      return { success: true, columns, rows };
    } catch (error) {
      return { success: false, error: `PostgreSQL query failed: ${error.message}` };
    } finally {
      await client.end();
    }
  }

  // SQL Server Implementation
  async testSQLServerConnection(config) {
    try {
      const pool = await sql.connect(config.connectionString);
      await pool.request().query('SELECT 1');
      await pool.close();
      return { success: true };
    } catch (error) {
      return { success: false, error: `SQL Server connection failed: ${error.message}` };
    }
  }

  async executeSQLServerQuery(config, query) {
    try {
      const pool = await sql.connect(config.connectionString);
      const result = await pool.request().query(query);
      await pool.close();
      
      const columns = result.recordset.columns ? 
        Object.keys(result.recordset.columns) : 
        (result.recordset[0] ? Object.keys(result.recordset[0]) : []);
      
      const rows = result.recordset.map(row => columns.map(col => row[col]));
      
      return { success: true, columns, rows };
    } catch (error) {
      return { success: false, error: `SQL Server query failed: ${error.message}` };
    }
  }

  // Oracle Implementation (requires Oracle Instant Client)
  async testOracleConnection(config) {
    try {
      // Uncomment and configure if using Oracle
      // const connection = await oracledb.getConnection(config.connectionString);
      // await connection.execute('SELECT 1 FROM DUAL');
      // await connection.close();
      return { success: false, error: 'Oracle support not configured. Please install Oracle Instant Client and uncomment Oracle code.' };
    } catch (error) {
      return { success: false, error: `Oracle connection failed: ${error.message}` };
    }
  }

  async executeOracleQuery(config, query) {
    try {
      // Uncomment and configure if using Oracle
      // const connection = await oracledb.getConnection(config.connectionString);
      // const result = await connection.execute(query);
      // await connection.close();
      // 
      // const columns = result.metaData.map(col => col.name);
      // const rows = result.rows;
      // 
      // return { success: true, columns, rows };
      return { success: false, error: 'Oracle support not configured. Please install Oracle Instant Client and uncomment Oracle code.' };
    } catch (error) {
      return { success: false, error: `Oracle query failed: ${error.message}` };
    }
  }
}