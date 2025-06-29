import { neon } from '@neondatabase/serverless';

export const handler = async (event, context) => {
    try {
        console.log('Function invoked with event:', event);

        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
            console.error('DATABASE_URL is not defined');
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Server configuration error: DATABASE_URL missing.' }),
                headers: { 'Content-Type': 'application/json' },
            };
        }

        console.log('Event body:', event.body);

        if (!event.body) {
            console.error('No request body provided');
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'No data provided in request body.' }),
                headers: { 'Content-Type': 'application/json' },
            };
        }

        let body;
        try {
            body = JSON.parse(event.body);
            console.log('Parsed body:', body);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid JSON in request body.' }),
                headers: { 'Content-Type': 'application/json' },
            };
        }

        const { username, password, 'full-name': fullName, dob, details } = body;

        if (!username || !password || !fullName || !dob) {
            console.error('Missing required fields:', { username, password, fullName, dob });
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields.' }),
                headers: { 'Content-Type': 'application/json' },
            };
        }

        const sql = neon(databaseUrl);
        console.log('Attempting database insert');
        await sql`
            INSERT INTO public.submissions (username, password, full_name, dob, details, submitted_at)
            VALUES (${username}, ${password}, ${fullName}, ${dob}, ${details}, NOW())
        `;
        console.log('Database insert successful');

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Submission saved successfully.' }),
            headers: { 'Content-Type': 'application/json' },
        };
    } catch (error) {
        console.error('Error saving submission:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Error saving submission: ${error.message}` }),
            headers: { 'Content-Type': 'application/json' },
        };
    }
};
