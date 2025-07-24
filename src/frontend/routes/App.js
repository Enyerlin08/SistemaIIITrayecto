import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ComplejoLista from './components/ComplejoLista';
import ComplejoDetalle from './components/ComplejoDetalle';

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/complejos" component={ComplejoLista} />
                <Route path="/complejos/:id" component={ComplejoDetalle} />
            </Switch>
        </Router>
    );
}

export default App;