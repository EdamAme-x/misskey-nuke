
export async function getChannels(token: string, host: string, searchValue: string) {
    return await (await fetch(
        `https://${host}/api/channels/search`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                query: searchValue,
                limit: 100
            })
        }
    )).json()
}