import app from './app';
import sequelize from './config/database';

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Authenticate database connection
    console.log('Connecting to PostgreSQL database...');
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start the application server:', error);
    process.exit(1);
  }
}

startServer();
