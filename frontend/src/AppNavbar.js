import React, { useState, useEffect } from 'react';
import { Navbar, NavbarBrand, NavLink, NavItem, Nav, NavbarText, NavbarToggler, Collapse } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';
import tokenService from './services/token.service';
import jwt_decode from 'jwt-decode';
import logo from './static/images/logo_banco.png';
import './App.css';

function AppNavbar() {
  const [roles, setRoles] = useState([]);
  const [username, setUsername] = useState("");
  const jwt = tokenService.getLocalAccessToken();
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();

  const toggleNavbar = () => setCollapsed(!collapsed);

  useEffect(() => {
    if (jwt) {
      setRoles(jwt_decode(jwt).authorities);
      setUsername(jwt_decode(jwt).sub);
    }
  }, [jwt]);

  let adminLinks = <></>;
  let userLogout = <></>;
  
  roles.forEach((role) => {
    if (role === "ADMIN") {
      adminLinks = (
        <>
          <NavItem>
            <NavLink tag={Link} to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>
              Dashboard
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/entidades" className={location.pathname === "/entidades" ? "active" : ""}>
              Entidades
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/comunicaciones" className={location.pathname === "/comunicaciones" ? "active" : ""}>
              Comunicaciones
            </NavLink>
          </NavItem>
        </>
      );
    }
  });
  
  userLogout = (
    <>
      <NavbarText className="justify-content-end">{username}</NavbarText>
      <NavItem className="d-flex">
        <NavLink id="logout" tag={Link} to="/logout" className={location.pathname === "/logout" ? "active" : ""}>
          Cerrar sesión
        </NavLink>
      </NavItem>
    </>
  );

  return (
    <div>
      <Navbar expand="md" className="navbar-custom">
        <NavbarBrand href="/dashboard">
          <img style={{ width: "180px", height: "auto" }} src={logo} alt="Banco de alimentos logo" />
        </NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} className="ms-2" />
        <Collapse isOpen={!collapsed} navbar>
          <Nav className="me-auto mb-2 mb-lg-0" navbar>
            {adminLinks}
          </Nav>
          <Nav className="ms-auto mb-2 mb-lg-0" navbar>
            {userLogout}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default AppNavbar;