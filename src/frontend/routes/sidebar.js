

const routes = [
  {
    path: '/app/dashboard',
    icon: 'HomeIcon',
    name: 'INICIO',
  },
  {
    icon: 'PeopleIcon',
    name: 'DATOS',
    routes: [
      { 
        path: '/app/Cargo',
        name: 'Cargo',

      },
      {
        path: '/app/Persona',
        name: 'Persona',
      },
      {
        path: '/app/Usuario',
        name: 'Usuario',
      },
    ],
  },
  {
    icon: 'MenuIcon',
    name: 'MENU',
    routes: [
     {
        path: '/app/Complejo',
        name: 'Complejo Educativo',
      },
      {
        path: '/app/Marca',
        name: 'Marca Producto',
      },
      {
        path: '/app/Tipo',
        name: 'Tipo Producto',
      },
      {
        path: '/app/Producto',
        name: 'Producto',
      }, 
      {
        path: '/app/Grado',
        name: 'Grado',
      }, 
      {
        path: '/app/Plato',
        name: 'Plato',
      },
      {
        path: '/app/Menu',
        name: 'Menú',
      }
    ],
  },
  /*
  {
    icon: 'PagesIcon',
    name: 'Pages',
    routes: [
      {
        path: '/login',
        name: 'Login',
      },
      {
        path: '/create-account',
        name: 'Create account',
      },
      {
        path: '/forgot-password',
        name: 'Forgot password',
      },
      {
        path: '/app/404',
        name: '404',
      },
      {
        path: '/app/blank',
        name: 'Blank',
      },
    ],
  },
  */
]

export default routes

