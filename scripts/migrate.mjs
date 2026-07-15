import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, "..", "migrations");

function loadEnvLocal() {

    const envPath = path.join(__dirname, "..", ".env.local");

    if (!fs.existsSync(envPath))
        return;

    for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {

        const trimmed = line.trim();

        if (!trimmed || trimmed.startsWith("#"))
            continue;

        const eq = trimmed.indexOf("=");

        if (eq === -1)
            continue;

        const key = trimmed.slice(0, eq).trim();
        const value = trimmed.slice(eq + 1).trim();

        if (!(key in process.env))
            process.env[key] = value;
    }
}

async function main() {

    loadEnvLocal();

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        multipleStatements: true
    });

    await connection.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            filename VARCHAR(255) NOT NULL,
            applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (filename)
        )
    `);

    const [appliedRows] = await connection.query("SELECT filename FROM schema_migrations");
    const applied = new Set(appliedRows.map(row => row.filename));

    const files = fs.readdirSync(MIGRATIONS_DIR)
        .filter(file => file.endsWith(".sql"))
        .sort();

    let didWork = false;

    for (const file of files) {

        if (applied.has(file))
            continue;

        didWork = true;
        console.log(`Applying ${file} ...`);

        const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");

        await connection.query(sql);
        await connection.query(
            "INSERT INTO schema_migrations (filename) VALUES (?)",
            [file]
        );
    }

    console.log(didWork ? "Migrations applied." : "Already up to date.");

    await connection.end();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
