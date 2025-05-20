import mysql from "mysql2/promise"

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Helper function to execute queries
export async function query<T>(sql: string, params?: any[]): Promise<T> {
  try {
    const [rows] = await pool.execute(sql, params)
    return rows as T
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    await query("SELECT 1")
    return true
  } catch (error) {
    console.error("Database connection error:", error)
    return false
  }
}
