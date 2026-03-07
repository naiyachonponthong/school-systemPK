const { Sequelize } = require('sequelize');
require('dotenv').config();

// ใช้ Render PostgreSQL URL หรือ MySQL config
const databaseUrl = process.env.DATABASE_URL;

let sequelize;

if (databaseUrl) {
  // PostgreSQL (Render)
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    timezone: '+07:00',
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });
} else {
  // MySQL (fallback)
  sequelize = new Sequelize(
    process.env.DB_NAME || 'school_personnel',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      timezone: '+07:00',
      define: {
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    }
  );
}

module.exports = sequelize;
