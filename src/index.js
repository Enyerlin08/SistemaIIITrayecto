import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import './frontend/assets/css/tailwind.output.css'; // Ruta correcta a tailwind
import './frontend/assets/css/tailwind.css'; // Ruta correcta a tailwind
import App from './frontend/App'; // Ruta correcta a App.js
import { SidebarProvider } from './frontend/context/SidebarContext'; // Ruta correcta a SidebarContext.js
import ThemedSuspense from './frontend/components/ThemedSuspense'; // Ruta correcta a ThemedSuspense.js
import { Windmill } from '@windmill/react-ui'; // Importación correcta de Windmill
import * as serviceWorker from './frontend/serviceWorker'; // Ruta correcta a serviceWorker.js

ReactDOM.render(
  <SidebarProvider>
    <Suspense fallback={<ThemedSuspense />}>
      <Windmill usePreferences>
        <App />
      </Windmill>
    </Suspense>
  </SidebarProvider>,
  document.getElementById('root')
);

serviceWorker.register();
