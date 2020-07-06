import {useState, useEffect} from 'react';

export default httpClient => {
    const [error, setError] = useState(null);

    const reqInterceptor = httpClient.interceptors.request.use(req => {
        setError(null);
        return req;
    });

    const respInterceptor = httpClient.interceptors.response.use(resp => resp, err => {
        setError(err);
    });

    useEffect(() => {
        return() => {
            //Remove interceptor when WrappedComponent is destroy
            // To prevent memory leak
            httpClient.interceptors.request.eject(reqInterceptor);
            httpClient.interceptors.request.eject(respInterceptor);
        };
    }, [reqInterceptor,respInterceptor]);

    const errorConfirmHandler = () => {
        setError(null);
    }

    return [error, errorConfirmHandler];
}