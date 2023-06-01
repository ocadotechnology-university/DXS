import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';

import { Row, Col, Alert, NavItem, NavLink } from 'reactstrap';

import { useAppSelector } from 'app/config/store';

export const Home = () => {
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const account = useAppSelector(state => state.authentication.account);

  return (
    <div className="container">
      <p className="title">Developer Experience Survey</p>
      <p className="subtitle">
        At Ocado, we believe that your opinion matters. That&apos;s why we&apos;ve created a powerful tool for collecting and analyzing
        feedback from our talented team of developers. With our user-friendly forms, you can easily share your thoughts and ideas, and help
        us improve our workplace culture and practices.
      </p>
      <p className="description">So why wait? Let&apos;s start shaping the future of Ocado together!</p>

      <div className="button-container">
        {isAuthenticated ? (
          <div className="authenticated-container">
            <NavLink tag={Link} to="/surveyCreator" className="d-flex align-items-center">
              <button className="btn btn-primary">Create a survey</button>
            </NavLink>
            <NavLink tag={Link} to="/manager-surveys-dashboard" className="d-flex align-items-center">
              <button className="btn btn-primary">Manage created surveys</button>
            </NavLink>
            <NavLink tag={Link} to="/user-surveys-dashboard" className="d-flex align-items-center">
              <button className="btn btn-primary">Complete your pending surveys</button>
            </NavLink>
          </div>
        ) : (
          <div className="authenticated-container">
            <NavLink tag={Link} to="/login" className="d-flex align-items-center">
              <button className="btn btn-primary">Log in</button>
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
