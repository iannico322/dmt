import React from 'react'
import ReactDOM from 'react-dom/client'
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import App from './App.tsx'
import './index.css'
import { Suspense, lazy } from "react";

import NotFound from "./screens/notFound";
import Loader from './components/loader/loader.tsx';

const Page1= lazy(() =>
  wait(1300).then(() => import("./screens/page1.tsx"))
);

const Central= lazy(() =>
  wait(300).then(() => import("./screens/centralOffice/centralDashboard.tsx"))
);

const CentralF= lazy(() =>
  wait(300).then(() => import("./screens/centralOffice/Central.tsx"))
);

const router = createBrowserRouter([
  {
    path: "/dmt/",
    element: <CentralF />,
    
    children: [
      {
        path: "/dmt/", 
        element: <Navigate to="/dmt/dashboard" />, 
      },
      {
        path: "/dmt/dashboard",
        element: <>
        <Suspense fallback={<Loader />}>
          <CentralF/>
        </Suspense>
      </>,
      },
      {
        path: "/dmt/page2",
        element: <>
        <Suspense fallback={<Loader />}>
          <Page1 />
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
