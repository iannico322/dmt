import React from 'react'
import ReactDOM from 'react-dom/client'
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import './index.css'
import { Suspense, lazy } from "react";

import NotFound from "./screens/notFound";
import Loader from './components/loader/loader.tsx';



const UtiStatus= lazy(() =>
  wait(300).then(() => import('./screens/centralOffice/utistatus/UtiStatus.tsx'))
);

const CentralF= lazy(() =>
  wait(300).then(() => import("./screens/centralOffice/Central.tsx"))
);

const App= lazy(() =>
  wait(300).then(() => import("./App.tsx"))
);
const router = createBrowserRouter([
  {
    path: "/dmt/",
    element: <App/>,
    
    children: [
      {
        path: "/dmt/", 
        element: <Navigate to="/dmt/reports" />, 
      },
      {
        path: "/dmt/reports",
        element: <>
        <Suspense fallback={<Loader />}>
          <CentralF/>
        </Suspense>
      </>,
      },
      {
        path: "/dmt/utilization",
        element: <>
        <Suspense fallback={<Loader />}>
          <UtiStatus />
        </Suspense>
      </>,
      },



      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function wait( time:number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
