

let commonHeader = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },

}
export async function ApiRequest(endUrl, commonHeader) {
    try {
        const response = await fetch(endUrl, commonHeader);
        const json = await response.json();
        setTitleText(json.data);
    } catch (error) {
        console.error(error);
    }
}