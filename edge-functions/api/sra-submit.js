export async function onRequestPost({ request }) {
    try {
        const data = await request.json();

        const type = String(data.type || "").trim();
        const nickname = String(data.nickname || "").trim();
        const message = String(data.message || "").trim();

        const allowedTypes = [
            "feedback",
            "meme_idea",
            "poll_idea",
            "observation"
        ];

        if (!allowedTypes.includes(type)) {
            return new Response(
                JSON.stringify({
                    status: "error",
                    message: "Invalid submission type."
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        if (!message || message.length > 600) {
            return new Response(
                JSON.stringify({
                    status: "error",
                    message: "Message must contain 1–600 characters."
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        if (nickname.length > 40) {
            return new Response(
                JSON.stringify({
                    status: "error",
                    message: "Nickname is too long."
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        }

        const id = `${Date.now()}_${crypto.randomUUID()}`;

        const submission = {
            id,
            type,
            nickname: nickname || "Anonymous",
            message,
            createdAt: new Date().toISOString(),
            status: "pending"
        };

        await SRA_KV.put(
            `submission_${id}`,
            JSON.stringify(submission)
        );

        const totalIdeas = Number(
            await SRA_KV.get("totalIdeas") || 0
        );

        await SRA_KV.put(
            "totalIdeas",
            String(totalIdeas + 1)
        );

        return new Response(
            JSON.stringify({
                status: "ok",
                message: "Submission received."
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
