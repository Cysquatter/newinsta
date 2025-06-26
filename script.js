import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcrypt';

export const handler = async (event, context) => {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not defined');
    }

    const sql = neon(databaseUrl);

    const body = JSON.parse(event.body);
    const { username, password, 'full-name': fullName, dob, details } = body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO submissions (username, password, full_name, dob, details, submitted_at)
      VALUES (${username}, ${hashedPassword}, ${fullName}, ${dob}, ${details}, NOW())
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Submission saved successfully.' }),
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    console.error('Error saving submission:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error saving submission.' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};
