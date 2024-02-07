
export async function createReply(
    token: string,
    host: string,
    noteId: string,
    content: string
) {
    return await (await fetch(
        `https://${host}/api/notes/create`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                text: content,
                renoteId: noteId
            })
        }
    )).json()
}