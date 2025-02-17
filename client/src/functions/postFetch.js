


export default async function postFetch({ url, data = () => { }, setError = () => { }, setLoading = () => { }, userId }) {
    const controller = new AbortController();  // Create an instance of AbortController
    const signal = controller.signal;
    const token = localStorage.getItem('token');

    try {

        setLoading(true);
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'userId': userId // Include userId in the headers

            },
            body: JSON.stringify(data),
            signal
        });
        const json = await res.json();
        json.status === 'error' ? setError(json.message) : setError(false);
        setLoading(false);
        return json;
    }
    catch (err) {
        setLoading(false);
        setError(err.message);
    };
    return () => {
        controller.abort();  // Abort the fetch request if the component unmounts
    };

}