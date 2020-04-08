import React from 'react';
import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = props => {
	let transfIngredients = Object.keys(props.ingredients)
								.map(igKey => {
									return [...Array(props.ingredients[igKey])].map((_, i) => {
										return <BurgerIngredient key={igKey+i} type={igKey}/>
									});
								})
								.reduce((arr, el) => {
									return arr.concat(el)
								}, []);
	if(transfIngredients.length === 0) {
		transfIngredients = <p>Please start adding ingredients</p>
	}
	return (
		<div className={classes.Burger}>
			<BurgerIngredient type="bread-top"></BurgerIngredient>
			{transfIngredients}
			<BurgerIngredient type="bread-bottom"></BurgerIngredient>
		</div>
	);
};

export default burger;