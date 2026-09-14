export async function onRequestGet({ request, params, env }) {
    try {
        const visitCount = await SRA_KV.get("visitCount");

        let visitCountInt = Number(visitCount || 0);
        visitCountInt += 1;

        await SRA_KV.put("visitCount", String(visitCountInt));

        return new Response(
            JSON.stringify({
                status: "ok",
                visitCount: visitCountInt
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
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
                    "Content-Type": "application/json; charset=UTF-8",
                    "Access-Control-Allow-Origin": "*"
                }
            }
        );
    }
}
