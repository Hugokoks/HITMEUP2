import API_URLS from "../config";
const { VERIFYJWT_URL } = API_URLS;

export default async function userVerify({ userId }) {
    const controller = new AbortController();  // Create an instance of AbortController
    const signal = controller.signal;
    const token = localStorage.getItem('token');
    try {

        const response = await fetch(VERIFYJWT_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'userId': userId // Include userId in the headers

            },
            signal
        });

        const json = await response.json();
        if (json.status === 'error') throw new Error(json.message);

        return json;
    }
    catch {


    }
    return () => {
        controller.abort();  // Abort the fetch request if the component unmounts
    }
}