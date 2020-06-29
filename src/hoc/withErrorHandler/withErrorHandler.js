import React, {useState, useEffect} from "react";
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Aux';

const withErrorHandler = (WrappedComponent, axios) => {
	return props => {
		const [error, setError] = useState(null);

		const reqInterceptor = axios.interceptors.request.use(req => {
			setError(null);
			return req;
		});

		const respInterceptor = axios.interceptors.response.use(resp => resp, err => {
			setError(err);
		});

		useEffect(() => {
			return() => {
				//Remove interceptor when WrappedComponent is destroy
				// To prevent memory leak
				axios.interceptors.request.eject(reqInterceptor);
				axios.interceptors.request.eject(respInterceptor);
			};
		}, [reqInterceptor,respInterceptor]);

		const errorConfirmHandler = () => {
			setError(null);
		}

		return (
			<Aux>
				<Modal 
					show={error}
					modalClosed={errorConfirmHandler}>
					{error ? error.message : null}
				</Modal>
				<WrappedComponent {...props}/>
			</Aux>
		);
	}
}

export default withErrorHandler;