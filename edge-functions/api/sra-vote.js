export async function onRequestPost({ request }) {
    try {
        const data = await request.json();

        const pollId = String(data.pollId || "").trim();
        const option = Number(data.option);

        if (!pollId) {
            return new Response(
                JSON.stringify({
                    status: "error",
                    message: "Missing poll ID."
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        if (!Number.isInteger(option) || option < 0) {
            return new Response(
                JSON.stringify({
                    status: "error",
                    message: "Invalid option."
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        const key = `poll_${pollId}`;

        const storedPoll = await SRA_KV.get(key);

        if (!storedPoll) {
            return new Response(
                JSON.stringify({
                    status: "error",
                    message: "Poll not found."
                }),
                {
                    status: 404,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        const poll = JSON.parse(storedPoll);

        if (option >= poll.options.length) {
            return new Response(
                JSON.stringify({
                    status: "error",
                    message: "Invalid poll option."
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        poll.votes[option]++;

        await SRA_KV.put(
            key,
            JSON.stringify(poll)
        );

        return new Response(
            JSON.stringify({
                status: "ok",
                votes: poll.votes
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({
                status: "error",
                message: error.message
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
}
