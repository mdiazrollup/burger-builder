import React from 'react';
import classes from './Toolbar.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';

const toolbar = (props) => (
	<header className={classes.Toolbar}>
		{/* <div>
			<button onClick={props.open}>MENU</button>
		</div> */}
		<DrawerToggle clicked={props.drawerToggleClicked}/>
		<div className={classes.Logo}><Logo/></div>
		<nav className={classes.DesktopOnly}>
			<NavigationItems/>
		</nav>
	</header>
);

export default toolbar;