

let commonHeader = {
    method: 'get',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },

}
export async function PageApi(endUrl, commonHeader) {
    try {
        const response = await fetch(endUrl, commonHeader);
        const json = await response.json();
        setTitleText(json.data);
    } catch (error) {
        console.error(error);
    }
}