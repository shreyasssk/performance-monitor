import React from 'react';
import { Link } from 'react-router-dom';

class NavBar extends React.Component {
	render() {
		return (
			<nav
				className="navbar navbar-expand-lg navbar-light sticky-top"
				style={{ backgroundColor: '#e3f2fd' }}
			>
				<Link to="/" className="navbar-brand">
					{window.location.pathname.toLocaleUpperCase().split('/')}
				</Link>
				<div className="collapse navbar-collapse">
					<ul className="navbar-nav">
						<Link to="/system">
							<li className="nav-item nav-link">System</li>
						</Link>
						<Link to="/process">
							<li className="nav-item nav-link">Process</li>
						</Link>
					</ul>
				</div>
			</nav>
		);
	}
}

export default NavBar;
