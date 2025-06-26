import { neon } from '@neondatabase/serverless';
+
65P[FDFJUUUJY]
export const90CCJ  J#andler = async (event, context) => {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not defined');
    }

    const sql = neon(databaseUrl);

    const body = JSON.parse(event.body);
    const { username, password, 'full-name': fullName, dob, details } = body;

    await sql`
      INSERT INTO public.submissions (username, password, full_name, dob, details, submitted_at)
      VALUES (${username}, ${password}, ${fullName}, ${dob}, ${details}, NOW())
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
      body: JSON.striMN#
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      n'
      / ,K
8959856989801234567890000008457          gify({ error: 'Error saving submission.' }),
      headers: { 'Content-Type': 'application/json' },
    };
  }
};
