import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';

import { Row, Col, Alert } from 'reactstrap';

import { useAppSelector } from 'app/config/store';

export const Home = () => {
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const account = useAppSelector(state => state.authentication.account);

  return (
    <div style={{ backgroundColor: '#F5F5F5', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <p className="text-center" style={{ fontFamily: 'Inter', fontSize: '60px', color: 'black' }}>
        Developer Experience Survey
      </p>
      <p className="text-center" style={{ fontFamily: 'Inter', fontSize: '30px', color: 'black' }}>
        At Ocado, we believe that your opinion matters. That&apos;s why we&apos;ve created a powerful tool for collecting and analyzing
        feedback from our talented team of developers. With our user-friendly forms, you can easily share your thoughts and ideas, and help
        us improve our workplace culture and practices.{' '}
      </p>
      <p className="text-center" style={{ fontFamily: 'Inter', fontSize: '20px', color: 'black' }}>
        So why wait? Let&apos;s start shaping the future of Ocado together!{' '}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {isAuthenticated ? (
          <div
            className="mx-auto my-4"
            style={{
              backgroundColor: '#D9D9D9',
              borderRadius: '35px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              minWidth: 'fit-content',
            }}
          >
            <button className="btn btn-primary my-2" style={{ backgroundColor: '#EBEBF4', borderRadius: '25px', color: 'black', flex: 1 }}>
              Create a survey
            </button>
            <button className="btn btn-primary my-2" style={{ backgroundColor: '#EBEBF4', borderRadius: '25px', color: 'black', flex: 1 }}>
              History of surveys
            </button>
            <button className="btn btn-primary my-2" style={{ backgroundColor: '#EBEBF4', borderRadius: '25px', color: 'black', flex: 1 }}>
              Complete your pending surveys
            </button>
            <button className="btn btn-primary my-2" style={{ backgroundColor: '#EBEBF4', borderRadius: '25px', color: 'black', flex: 1 }}>
              Your team members&apos; responses
            </button>
          </div>
        ) : (
          <div
            className="mx-auto my-4"
            style={{
              backgroundColor: '#D9D9D9',
              borderRadius: '35px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              minWidth: 'fit-content',
            }}
          >
            <button className="btn btn-primary my-2" style={{ backgroundColor: '#EBEBF4', borderRadius: '25px', color: 'black', flex: 1 }}>
              Log in
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
