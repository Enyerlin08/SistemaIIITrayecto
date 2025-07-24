import React, { lazy } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import AccessibleNavigationAnnouncer from './components/AccessibleNavigationAnnouncer';

const Layout = lazy(() => import('./containers/Layout'));
const Login = lazy(() => import('./pages/Login'));
const CreateAccount = lazy(() => import('./pages/CreateAccount'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Cargo = lazy(() => import('./pages/Cargo'));
const Form = lazy(() => import('./components/FormRegistro'));
const Marca = lazy(() => import('./pages/Marca'));
const Tipo = lazy(() => import('./pages/Tipo'));
const Usuario = lazy(() => import('./pages/Usuario'));
const Complejo = lazy(() => import('./pages/Complejo')); 
const Producto = lazy(() => import('./pages/Producto')); 
const Grado = lazy(() => import('./pages/Grado')); 

function App() {
  return (
    <Router>
      <AccessibleNavigationAnnouncer />
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/create-account" component={CreateAccount} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/cargo" component={Cargo} />
        <Route path="/marca" component={Marca} />
        <Route path="/tipo" component={Tipo} />
        <Route path="/usuario" component={Usuario} />
        <Route path="/complejo" component={Complejo} /> 
        <Route path="/producto" component={Producto} /> 
        <Route path="/app" component={Layout} />
        <Route path="/grado" component={Grado} />
        <Redirect exact from="/" to="/login" />
      </Switch>
    </Router>
  );
}

export default App;
