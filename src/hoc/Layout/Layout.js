import React, {useState} from 'react';
import Aux from '../Aux/Aux';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import {connect} from 'react-redux';

const layout  = props => {
	const [sideDrawerIsVisible, setSideDrawerIsVisible] = useState(false);

	const sideDrawerClosedHandler = () => {
		setSideDrawerIsVisible(false);
	}

	const sideDrawerToggleHandler = () => {
		setSideDrawerIsVisible(!sideDrawerIsVisible)
	};

	return (
		<Aux>
			<Toolbar drawerToggleClicked={sideDrawerToggleHandler} 
				isAuth={props.isAuthenticated}/>
			<SideDrawer
			isAuth={props.isAuthenticated}
			closed={sideDrawerClosedHandler}
			open={sideDrawerIsVisible}/>
			<main className={classes.Content}>
				{props.children}
			</main>
		</Aux>	
	);
};

const mapStateToProps = state => {
	return {
		isAuthenticated: state.auth.token !== null
	};
};

export default connect(mapStateToProps)(layout);