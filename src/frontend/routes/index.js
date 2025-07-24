
import { lazy } from 'react'

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Forms = lazy(() => import('../pages/Forms'))
const Cards = lazy(() => import('../pages/Cards'))
const Charts = lazy(() => import('../pages/Charts'))
const Buttons = lazy(() => import('../pages/Buttons'))
const Modals = lazy(() => import('../pages/Modals'))
const Tables = lazy(() => import('../pages/Tables'))
const Page404 = lazy(() => import('../pages/404'))
const Blank = lazy(() => import('../pages/Blank'))
const Cargo = lazy(() => import('../pages/Cargo'))
const Form = lazy(() => import('../components/FormRegistro'))
const Marca = lazy(() => import('../pages/Marca'))
const Persona = lazy(() => import('../pages/Persona'))
const Tipo = lazy(() => import('../pages/Tipo'))
const Usuario = lazy(() => import('../pages/Usuario'))
const Complejo = lazy(() => import('../pages/Complejo'))
const Producto = lazy(() => import('../pages/Producto'))
const Grado = lazy(() => import('../pages/Grado'))
const Plato = lazy(() => import('../pages/Plato'))
const Menu = lazy(() => import('../pages/Menu'))

const routes = [
  {
    path: '/dashboard', // the url
    component: Dashboard, // view rendered
  },
  {
    path: '/cargo',
    component: Cargo,
  },
  {
    path: '/marca',
    component: Marca,
  },
  {
    path: '/persona',
    component: Persona,
  },
  {
    path: '/Tipo',
    component: Tipo,
  },
  {
    path: '/Usuario',
    component: Usuario,
  },
  {
    path: '/Complejo',
    component: Complejo,
  },
  {
    path: '/Producto',
    component: Producto,
  },
  {
    path: '/Grado',
    component: Grado,
  }, 
  {
    path: '/form',
    component: Form,
  },
  {
    path: '/forms',
    component: Forms,
  },
  {
    path: '/cards',
    component: Cards,
  },
  {
    path: '/charts',
    component: Charts,
  },
  {
    path: '/buttons',
    component: Buttons,
  },
  {
    path: '/modals',
    component: Modals,
  },
  {
    path: '/tables',
    component: Tables,
  },
  {
    path: '/404',
    component: Page404,
  },
  {
    path: '/blank',
    component: Blank,
  },
  {
    path: '/plato',
    component: Plato,
  },
  {
    path: '/menu',
    component: Menu,
  }

]

export default routes
