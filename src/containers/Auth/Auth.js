import React, {useState, useEffect} from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';
import {connect} from 'react-redux';
import Spinner from '../../components/UI/Spinner/Spinner';
import {Redirect} from 'react-router-dom';
import {updateObject, checkValidity} from '../../share/utility';
 
const auth = props => {
	const [controls, setControls] = useState(
		{
			email: {
				elementType: 'input',
				elementConfig: {
					type:'email',
					placeholder: 'Your Email'
				},
				value: '',
				validation: {
					required: true
				},
				valid: false,
				touched: false
			},
			password: {
				elementType: 'input',
				elementConfig: {
					type:'password',
					placeholder: 'Password'
				},
				value: '',
				validation: {
					required: true,
					minLength: 6
				},
				valid: false,
				touched: false
			}
		}
	);
	const [isSignup, setIsSignup] = useState(true);
	const {buildingBurger, authRedirectPath, onSetAuthRedirectPath} = props;

	useEffect(() => {
		if(!buildingBurger && authRedirectPath !== '/') {
			onSetAuthRedirectPath();
		}
	}, [buildingBurger, authRedirectPath, onSetAuthRedirectPath]);

	const inputChangedHandler = (event, inputIdentifier) => {
		const updatedControls = updateObject(controls,{
			[inputIdentifier]: updateObject(controls[inputIdentifier], {
				value: event.target.value,
				valid: checkValidity(event.target.value, controls[inputIdentifier].validation),
				touched: true
			})
		});

		setControls(updatedControls);
	}

	const submitHandler = (event) => {
		event.preventDefault();
		props.onAuth(controls.email.value, controls.password.value, isSignup)
	}

	const switchAuthModeHandler = () => {
		setIsSignup(!isSignup);
	}

	const formElementsArray = [];
	for(let key in controls) {
		formElementsArray.push({
			id: key,
			config: controls[key]
		});
	}

	let form = formElementsArray.map(formElement => (
		<Input
		key={formElement.id}
		inputType={formElement.config.elementType} 
		elementConfig={formElement.config.elementConfig} 
		value={formElement.config.value}
		invalid={!formElement.config.valid}
		shouldValidate={formElement.config.validation}
		touched={formElement.config.touched}
		changed={(event) => inputChangedHandler(event, formElement.id)}/>
	));

	if(props.loading) {
		form = <Spinner/>;
	}

	let errorMessage = null;
	if(props.error) {
		errorMessage = (
			<p>{props.error.message}</p>
		);
	}

	let authRedirect = null;
	if(props.isAuthenticated) {
		authRedirect = <Redirect to={props.authRedirectPath}/>
	}

	return (
		<div className={classes.Auth}>
			{authRedirect}
			{errorMessage}
			<form onSubmit={submitHandler}>
				{form}
				<Button buttonType="Success">SUBMIT</Button>
			</form>
			<Button 
			buttonType="Danger"
			clicked={switchAuthModeHandler}
			>SWITCH TO {isSignup ? 'SIGNIN' : 'SIGNUP'}</Button>
		</div>
	);
}

const mapStateToProps = (state) => {
	return {
		loading: state.auth.loading,
		error: state.auth.error,
		isAuthenticated: state.auth.token != null,
		buildingBurger: state.burgerBuilder.building,
		authRedirectPath: state.auth.authRedirectPath
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
		onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(auth);