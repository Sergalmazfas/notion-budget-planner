import React from 'react';
import './login.scss';
import { ReactComponent as NodgetLogo } from '../../resources/icons/nodget-logo.svg';

const Login = () => {
	return (
		<div className="login">
			<div className="login__content">
				<NodgetLogo className="login__logo" />
				<p className="login__subline">Notion Budget Planner</p>
				<p className="login__text">Please log in to continue.</p>
			</div>
		</div>
	)
};

export { Login }