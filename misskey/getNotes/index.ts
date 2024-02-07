
export async function getNotes(token: string, host: string) {

    return await (await fetch(
        `https://${host}/api/notes/global-timeline`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                limit: 100,
                renote: true,
                reply: false,
                poll: false,
            })
        }
    )).json()
}