import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../pages/Home';
import AwardSearch from '../pages/AwardSearch';
import Pipeline from '../pages/Pipeline';
import Portfolio from '../pages/Portfolio';

const AppRouter = () => (
    <Router>
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/award-search" component={AwardSearch} />
            <Route path="/pipeline" component={Pipeline} />
            <Route path="/portfolio" component={Portfolio} />
            {/* Add more routes as needed */}
        </Switch>
    </Router>
);

export default AppRouter;
