import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import NavBar from './NavBar';
import SystemApp from './SystemApp';

const App = () => {
	return (
		<div>
			<BrowserRouter>
				<NavBar />
				<Route exact path="/">
					<Redirect to="/system" />
				</Route>
				<Route to="/system" exact component={SystemApp} />
				<Route to="/process" exact />
			</BrowserRouter>
		</div>
	);
};

export default App;
