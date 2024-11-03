// database.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';


// Carga las variables de entorno
dotenv.config();


const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  dialectOptions: {
    connectTimeout: 30000, // aumenta el tiempo de espera a 30 segundos
    ssl: {
      require: true,
      rejectUnauthorized: false // Permite conexiones SSL
    }
  },
  logging: false // Desactiva logging
});

sequelize.authenticate()
  .then(() => console.log('Conectado exitosamente a la base de datos en Railway'))
  .catch(err => console.error('No se pudo conectar a la base de datos:', err));


export default sequelize;
