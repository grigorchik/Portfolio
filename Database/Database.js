import { Sequelize } from 'sequelize';

const sequelize = new Sequelize
('myportfolio', 'portfolio', 'portfolio', {
    host: '192.168.10.103',
    dialect: 'postgres',
    logging: false,
});

export default sequelize;
