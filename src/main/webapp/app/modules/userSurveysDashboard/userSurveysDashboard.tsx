import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './userSurveysDashboard.css';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';

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

  function ActiveSurveysSection() {
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
  function ExpiredSurveysSection() {
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
    const [modalOpen, setModalOpen] = useState(false);

    const navigate = useNavigate();

    const handleSurvey = () => {
      navigate(`/survey/${survey.id}`);
    };

    const openModal = () => {
      setModalOpen(true);
    };

    const closeModal = () => {
      setModalOpen(false);
    };

    return (
      <div className={'survey'}>
        <div className={'survey-inside'}></div>
        <div className={'name-row'} onClick={openModal}>
          <p className={'wrap-text'}>{survey.name}</p>
        </div>

        <Modal show={modalOpen} onHide={closeModal} dialogClassName="rounded-modal">
          <Modal.Header closeButton>
            <Modal.Title className="modal-title">{survey.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className={'modal-subtitle'}>{survey.description}</p>
            <p>Number of questions: {survey.questions.length}</p>
            {/*TODO add approximate completion time column to survey table or find another way to calculate it*/}
            <p>Completion time: placeholder</p>
            {/*TODO add author column to survey table*/}
            <p>Author: placeholder</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSurvey}>
              Start Survey
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  return (
    <div>
      <h1>Survey Dashboard</h1>
      <ActiveSurveysSection />
      <ExpiredSurveysSection />
    </div>
  );
};

export default UserSurveysDashboard;
