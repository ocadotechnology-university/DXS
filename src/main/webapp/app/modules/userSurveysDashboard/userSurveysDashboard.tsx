import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './userSurveysDashboard.css';
import { Link } from 'react-router-dom';

const UserSurveysDashboard = () => {
  const [surveys, setSurveys] = useState([]);

  // TODO this code will look different bacause we will have to fetch the surveys assigned for this user (for now it fetches everything, waiting for backend to be ready)
  useEffect(() => {
    // Fetch survey data from the backend API
    axios
      .get('/api/surveys')
      .then(response => {
        // Update the surveys state with the fetched data
        setSurveys(response.data);
      })
      .catch(error => {
        console.error('Error fetching survey data:', error);
      });
  }, []);

  function ActiveSurveysSection({ surveys }) {
    // const activeSurveys = surveys.filter((survey) => survey.status === 'active'); // TODO uncomment it after column status is added to survey table
    const activeSurveys = surveys.filter(survey => survey.id !== 0); // TODO remove it after column status is added to survey table

    return (
      <div>
        <h2>Active</h2>
        <div className={'survey-container'}>
          {activeSurveys.map(survey => (
            <SurveyBox key={survey.id} survey={survey} />
          ))}
        </div>
      </div>
    );
  }

  // Component for the expired surveys section
  function ExpiredSurveysSection({ surveys }) {
    const expiredSurveys = surveys.filter(survey => survey.status === 'expired');

    return (
      <div>
        <h2>Expired</h2>
        {expiredSurveys.map(survey => (
          <SurveyBox key={survey.id} survey={survey} />
        ))}
      </div>
    );
  }

  // Component for a survey box
  function SurveyBox({ survey }) {
    const surveyPath = `/survey/${survey.id}`;

    return (
      <div className={'survey'}>
        <div className={'survey-inside'}></div>
        <Link to={surveyPath}>
          <div className={'name-row'}>
            <p>{survey.name}</p>
          </div>
        </Link>
        {/* Render other survey details as needed */}
      </div>
    );
  }

  return (
    <div>
      <h1>Survey Dashboard</h1>
      <ActiveSurveysSection surveys={surveys} />
      <ExpiredSurveysSection surveys={surveys} />
    </div>
  );
};

export default UserSurveysDashboard;
