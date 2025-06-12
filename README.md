# Database Query Application

A professional database query tool that supports multiple database types including SQL Server, MySQL, PostgreSQL, and Oracle.

## Features

- **Multi-Database Support**: Connect to SQL Server, MySQL, PostgreSQL, and Oracle databases
- **Real-time Query Execution**: Execute SELECT queries with real-time results
- **Advanced Filtering**: Filter and search through query results
- **Data Export**: Export results to Excel format
- **Query Sharing**: Generate shareable links for queries and results
- **Security**: Server-side query validation and connection handling

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Database drivers for your target databases

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Copy the environment file and configure:
```bash
cp .env.example .env
```

3. Configure your database connections in `.env` file

### Database-Specific Setup

#### SQL Server
- Install SQL Server or use Azure SQL Database
- Ensure TCP/IP connections are enabled
- Configure firewall rules if needed

#### MySQL
- Install MySQL Server or use cloud MySQL
- Create database and user with appropriate permissions

#### PostgreSQL
- Install PostgreSQL or use cloud PostgreSQL
- Create database and user with appropriate permissions

#### Oracle (Optional)
- Install Oracle Database or use Oracle Cloud
- Install Oracle Instant Client on your server
- Uncomment Oracle-related code in `server/database/DatabaseManager.js`

### Running the Application

#### Development Mode
```bash
npm run dev
```
This starts both the client (port 5173) and server (port 3001) concurrently.

#### Production Build
```bash
npm run build
```

### Connection String Examples

#### SQL Server
```
Server=localhost,1433;Database=mydb;User Id=sa;Password=mypassword;Encrypt=true;TrustServerCertificate=true;
```

#### MySQL
```
mysql://username:password@localhost:3306/database_name
```

#### PostgreSQL
```
postgresql://username:password@localhost:5432/database_name
```

#### Oracle
```
username/password@localhost:1521/XE
```

## Security Features

- **Query Validation**: Only SELECT queries are allowed
- **SQL Injection Protection**: Basic keyword filtering
- **Server-side Processing**: Connection strings never exposed to client
- **CORS Configuration**: Configurable cross-origin requests

## API Endpoints

- `POST /api/test-connection` - Test database connection
- `POST /api/execute-query` - Execute SELECT queries
- `GET /api/health` - Health check endpoint

## Deployment

### Environment Variables
Set the following environment variables in production:
- `PORT` - Server port (default: 3001)
- `VITE_API_URL` - API base URL for client

### Docker Deployment (Optional)
Create a Dockerfile for containerized deployment:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["node", "server/index.js"]
```

## Troubleshooting

### Common Issues

1. **Connection Timeout**: Check firewall settings and network connectivity
2. **Authentication Failed**: Verify credentials and user permissions
3. **Port Already in Use**: Change PORT in .env file
4. **Oracle Issues**: Ensure Oracle Instant Client is properly installed

### Logs
Check server logs for detailed error messages:
```bash
npm run dev:server
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.