export default async function uploadImg({ url, userId, file, setError }) {

    const controller = new AbortController();  // Create an instance of AbortController
    const signal = controller.signal;
    const token = localStorage.getItem('token');
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'userId': userId // Include userId in the headers

            },
            body: formData,
            signal
        });
        const { status, uploadedImg } = await res.json();

        if (status === 'error') throw new Error();

        return { status, uploadedImg };
    }
    catch (err) {
        setError('failed to fatch data 😣');
    }
    return () => {
        controller.abort();  // Abort the fetch request if the component unmounts
    };
}
