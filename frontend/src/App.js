import React from "react";
import '@ionic/react/css/core.css';
import { setupIonicReact } from '@ionic/react';
import { Route, Routes } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { ErrorBoundary } from "react-error-boundary";
import AppNavbar from "./AppNavbar";
import Home from "./home";
import PrivateRoute from "./privateRoute";
import Register from "./auth/register";
import Login from "./auth/login";
import Logout from "./auth/logout";
import tokenService from "./services/token.service";
import EntidadEdit from "./entidad/entidadEdit"
import EntidadListAdmin from "./admin/entidades/EntidadListAdmin";
import EntidadViewAdmin from "./admin/entidades/EntidadViewAdmin";
import CommunicationListAdmin from "./admin/communications/CommunicationListAdmin";
import CommunicationEditAdmin from "./admin/communications/CommunicationEditAdmin";
import DashboardAdmin from "./admin/dashboard/DashboardAdmin";

setupIonicReact();

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const jwt = tokenService.getLocalAccessToken();
  let roles = []
  if (jwt) {
    roles = getRolesFromJWT(jwt);
  }

  function getRolesFromJWT(jwt) {
    return jwt_decode(jwt).authorities;
  }

  let adminRoutes = <></>;
  let entidadRoutes = <></>;
  let publicRoutes = <></>;
  let userRoutes = <></>;


  roles.forEach((role) => {
    if (role === "ADMIN") {
      adminRoutes = (
        <>
          <Route path="/comunicaciones" exact={true} element={<PrivateRoute><CommunicationListAdmin /></PrivateRoute>} />
          <Route path="/comunicaciones/:id" exact={true} element={<PrivateRoute><CommunicationEditAdmin /></PrivateRoute>} />
          <Route path="/entidades" exact={true} element={<PrivateRoute><EntidadListAdmin /></PrivateRoute>} />
          <Route path="/entidades/:id" exact={true} element={<PrivateRoute><EntidadViewAdmin /></PrivateRoute>} />
          <Route path="/dashboard" exact={true} element={<PrivateRoute><DashboardAdmin /></PrivateRoute>} />
          </>)
    }
    if (role === "ENTIDAD") {
      entidadRoutes = (
        <>
          <Route path="/entidades/:id" exact={true} element={<PrivateRoute><EntidadEdit /></PrivateRoute>} />
        </>)
    }
  })
  if (!jwt) {
    publicRoutes = (
      <>        
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </>
    )
  } else {
    userRoutes = (
      <>        
        <Route path="/logout" element={<Logout />} />
        <Route path="/login" element={<Login />} />
      </>
    )
  }

  return (
    <div>
      <ErrorBoundary FallbackComponent={ErrorFallback} >
      {window.location.pathname !== "/login" && window.location.pathname !== "/home" && window.location.pathname !== "/" && <AppNavbar />}
        <Routes>
          <Route path="/" exact={true} element={<Home />} />
          {publicRoutes}
          {userRoutes}
          {adminRoutes}
          {entidadRoutes}
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;
