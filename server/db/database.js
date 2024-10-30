// database.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Carga las variables de entorno
dotenv.config();

// Configura la conexión a la base de datos usando DATABASE_URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  dialectOptions: {
    connectTimeout: 30000, // Aumenta el tiempo de espera a 30 segundos
    ssl: {
      require: true,
      rejectUnauthorized: false // Permite conexiones SSL
    }
  },
  logging: false // Desactiva logging
});

// Prueba la conexión a la base de datos
sequelize.authenticate()
  .then(() => console.log('Conectado exitosamente a la base de datos en Railway'))
  .catch(err => console.error('No se pudo conectar a la base de datos:', err));

// Exporta la instancia de Sequelize
export default sequelize;

