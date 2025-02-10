import pg from 'pg';
const { Client } = pg;


const client = new Client({
    user: 'postgres', 
    password: '270202',         
    host: 'localhost', 
    port: '5432', 
    database: 'demo'
});

export default client;