import React from 'react';

import { NavItem, NavLink, NavbarBrand } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const BrandIcon = props => (
  <div {...props} className="brand-icon">
    <img src="content/images/logo-jhipster.png" alt="Logo" />
  </div>
);

export const Brand = () => (
  <NavbarBrand tag={Link} to="/" className="brand-logo">
    {/*<BrandIcon />*/}
    <span className="brand-title">Developer Experience Survey</span>
    {/*<span className="navbar-version">{VERSION}</span>*/}
  </NavbarBrand>
);

export const Home = () => (
  <NavItem>
    <NavLink tag={Link} to="/" className="d-flex align-items-center">
      <FontAwesomeIcon icon="home" />
      <span>Home</span>
    </NavLink>
  </NavItem>
);

export const SurveyCreator = () => (
  <NavItem>
    <NavLink tag={Link} to="/surveyCreator" className="d-flex align-items-center">
      <span>Survey Creator</span>
    </NavLink>
  </NavItem>
);


