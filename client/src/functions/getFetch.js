

export default async function getFetch({ url, setError = () => { }, setLoading = () => { }, userId }) {
    const controller = new AbortController();  // Create an instance of AbortController
    const signal = controller.signal;
    const token = localStorage.getItem('token');

    try {

        setLoading(true);
        const res = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'userId': userId // Include userId in the headers

            },

        }, { signal })
        const json = await res.json();
        json.status === 'error' ? setError(json.message) : setError(false);
        return json;

    }
    catch (err) {
        setError('failed to fatch data 😣');
    }
    finally {

        setLoading(false);
    }
    return () => {
        controller.abort();  // Abort the fetch request if the component unmounts
    };

}