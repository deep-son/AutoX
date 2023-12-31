export async function postData(url, formData) {
    const response = await fetch(url, { method: 'POST', body: formData });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};