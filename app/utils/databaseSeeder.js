const fs = require('fs').promises;
const path = require('path');


const databaseSeedHandler = async (req, res) => {
    try {
        console.log(`[SEEDER] Starting database connection for seeding...`);
        
        // 1. Establish connection
        // We set multipleStatements: true to allow the client to execute 
        // the entire file contents which contains multiple CREATE and INSERT statements.
        connection = await mysql.createConnection(dbConfig);
        
        // 2. Read the entire SQL file content
        const sqlContent = await fs.readFile(SEED_FILE_PATH, 'utf8');
        
        console.log(`[SEEDER] Executing fresh dump from: ${SEED_FILE_PATH}`);

        // 3. Execute the entire SQL content as a single batch
        const [results] = await connection.query(sqlContent);
        
        console.log(`[SEEDER] Database seeding complete. Total queries executed.`);
        
        return "Database seeded successfully from the SQL dump file!";

    } catch (error) {
        console.error(`[SEEDER ERROR] Database Seeding Failed: ${error.message}`);
        
        // If the error code is related to an unknown database, provide specific instructions.
        if (error.code === 'ER_BAD_DB_ERROR') {
            return `ERROR: Database '${dbConfig.database}' does not exist. Please create it first.`;
        }
        
        return `ERROR: Database seeding failed. Details: ${error.message}`;
    } finally {
        if (connection) {
            await connection.end();
            console.log(`[SEEDER] Connection closed.`);
        }
    }
}

module.exports = {
    databaseSeedHandler
}