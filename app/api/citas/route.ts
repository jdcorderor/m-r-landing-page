 export async function GET() {
    // Fetch data from the database here.
    const dates = [
        {
            id: 1,
            clientName: 'John Doe',
        },
        {
            id: 2,
            clientName: 'Jane Smith',
        },
        {
            id: 3,
            clientName: 'Alice Johnson',
        }
    ];
    return new Response(JSON.stringify(dates), {
        status: 200,
        headers: { 'Content-Type': 'application/json'}
    });
}

export async function POST(request: Request) {
    // Parse the request body.
    const body = await request.json();
    const { name } = body;

    const newDate = { id: Date.now(), name };

    return new Response(JSON.stringify(newDate), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
    });
}