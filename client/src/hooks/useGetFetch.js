import { useEffect, useState } from "react"


export default function useGetFetch(url, trigger = null, userId) {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchData = async () => {
            try {
                setIsPending(true);
                const res = await fetch(
                    url,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                            'userId': userId // Include userId in the headers

                        }
                    },
                    { signal }
                );
                const json = await res.json();
                //console.log(json);
                if (json.status === 'error') throw new Error(json.message)

                setData(json);
                setError(null);
            }
            catch (err) {
                console.log(err.message);
                setError(err.message);
            }
            finally {
                setIsPending(false);
            }
        }
        fetchData();
        return () => {
            controller.abort();


        }
    }, [url, trigger])

    return { data, isPending, error };

};