import React, {Component} from "react";
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Aux';

const withErrorHandler = (WrappedComponent, axios) => {
	return class extends Component {
		state = {
			error: null
		}


		componentWillMount() { //Because this method will disappear set the interceptor in the constructor
			this.reqInterceptor = axios.interceptors.request.use(req => {
				this.setState({error: null});
				return req;
			});

			this.respInterceptor = axios.interceptors.response.use(resp => resp, error => {
				this.setState({error: error});
			});
		}

		componentWillUnmount() {
			//Remove interceptor when WrappedComponent is destroy
			// To prevent memory leak
			axios.interceptors.request.eject(this.reqInterceptor);
			axios.interceptors.request.eject(this.respInterceptor);
		}

		errorConfirmHandler = () => {
			this.setState({error: null});
		}

		render() {
			return (
				<Aux>
					<Modal 
						show={this.state.error}
						modalClosed={this.errorConfirmHandler}>
						{this.state.error ? this.state.error.message : null}
					</Modal>
					<WrappedComponent {...this.props}/>
				</Aux>
			);
		}
	}
}

export default withErrorHandler;