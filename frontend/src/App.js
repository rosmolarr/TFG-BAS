import React, { useState, useEffect } from 'react';
import '@ionic/react/css/core.css';
import { setupIonicReact } from '@ionic/react';
import { Route, Routes, useNavigate } from "react-router-dom";
import { RollbackOutlined } from '@ant-design/icons';
import jwt_decode from "jwt-decode";
import { FloatButton } from 'antd';
import { ErrorBoundary } from "react-error-boundary";
import AppNavbar from "./AppNavbar";
import Home from "./home";
import PrivateRoute from "./privateRoute";
import Register from "./auth/register";
import Login from "./auth/login";
import Logout from "./auth/logout";
import tokenService from "./services/token.service";
import EntidadListAdmin from "./admin/entidades/EntidadListAdmin";
import EntidadViewAdmin from "./admin/entidades/EntidadViewAdmin";
import EntidadEditAdmin from "./admin/entidades/EntidadEditAdmin";
import EntidadProfile from "./entidad/profile/EntidadProfile";
import EntidadEdit from "./entidad/profile/EntidadEdit";
import ProfileError from "./components/errorPage/profileError";
import UserEdit from "./entidad/profile/UserEdit";
import CommunicationList from "./entidad/communications/CommunicationList";
import CommunicationListAdmin from "./admin/communications/CommunicationListAdmin";
import CommunicationViewAdmin from "./admin/communications/CommunicationViewAdmin";
import CommunicationListEntidadesAdmin from "./admin/communications/CommunicationListEntidadesAdmin";
import CommunicationNew from "./entidad/communications/CommunicationNew";
import CommunicationView from "./entidad/communications/CommunicationView";
import DashboardAdmin from "./admin/dashboard/DashboardAdmin";
import NotificationAdmin from "./util/notificationAdmin";

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

  /* Notificaciones*/
  const storedCount = parseInt(localStorage.getItem('notificacionesCount')) || 0;
  const [notificacionesCount, setNotificacionesCount] = useState(storedCount);

  const handleNuevaNotificacion = () => {
    // Incrementa el contador de notificaciones
    setNotificacionesCount(notificacionesCount + 1);
  };

  const navigate = useNavigate();

  const abrirNotificacion = () => {
    navigate(`/comunicaciones`);
    setNotificacionesCount(0);
  };

  useEffect(() => {
    localStorage.setItem('notificacionesCount', notificacionesCount.toString());
  }, [notificacionesCount]);

  let adminRoutes = <></>;
  let entidadRoutes = <></>;
  let publicRoutes = <></>;
  let userRoutes = <></>;

  roles.forEach((role) => {
    if (role === "ADMIN") {
      adminRoutes = (
        <>
          <Route path="/comunicaciones" exact={true} element={<PrivateRoute><CommunicationListAdmin /></PrivateRoute>} />
          <Route path="/comunicaciones/:id" exact={true} element={<PrivateRoute><CommunicationViewAdmin /></PrivateRoute>} />
          <Route path="/comunicaciones/entidad/:id" exact={true} element={<PrivateRoute><CommunicationListEntidadesAdmin /></PrivateRoute>} />
          <Route path="/entidades" exact={true} element={<PrivateRoute><EntidadListAdmin /></PrivateRoute>} />
          <Route path="/entidades/:id" exact={true} element={<PrivateRoute><EntidadViewAdmin /></PrivateRoute>} />
          <Route path="/entidades/new" exact={true} element={<PrivateRoute><EntidadEditAdmin /></PrivateRoute>} />
          <Route path="/entidades/:id/edit" exact={true} element={<PrivateRoute><EntidadEditAdmin /></PrivateRoute>} />
          <Route path="/dashboard" exact={true} element={<PrivateRoute><DashboardAdmin /></PrivateRoute>} />
          </>)
    }
    if (role === "ENTIDAD") {
      entidadRoutes = (
        <>
          <Route path="/entidades/:id/profile" exact={true} element={<PrivateRoute><EntidadProfile /></PrivateRoute>} />
          <Route path="/entidades/:id/profile/edit" exact={true} element={<PrivateRoute><EntidadEdit /></PrivateRoute>} />
          <Route path="/comunicaciones/:id" exact={true} element={<PrivateRoute><CommunicationList /></PrivateRoute>} />
          <Route path="/comunicaciones/new" exact={true} element={<PrivateRoute><CommunicationNew handleNuevaNotificacion={handleNuevaNotificacion}/></PrivateRoute>} />
          <Route path="/comunicaciones/:id/view" exact={true} element={<PrivateRoute><CommunicationView /></PrivateRoute>} />
          <Route path="/users/:id" exact={true} element={<PrivateRoute><UserEdit /></PrivateRoute>} />
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
        <Route path="/error/profile" exact={true} element={<ProfileError />} />
      </>
    )
  }

  const goBack = () => {
    navigate(-1);
  };

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
        <FloatButton.Group shape="circle">
            <FloatButton.BackTop />
            {roles.includes('ADMIN') && (
              <NotificationAdmin notificacionesCount={notificacionesCount} abrirNotificacion={abrirNotificacion} />
            )}
            {jwt && (
              <FloatButton icon={<RollbackOutlined />} onClick={goBack} />
            )}
            </FloatButton.Group>
      </ErrorBoundary>
    </div>
  );
}

export default App;
