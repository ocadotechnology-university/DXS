import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './userSurveysDashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';

const UserSurveysDashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [surveyAssignments, setSurveyAssignments] = useState([]);

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
    axios
      .get('/api/survey-assignments') // Replace '/api/survey-assignments' with the appropriate endpoint URL
      .then(response => {
        // Update the surveyAssignments state with the fetched data
        setSurveyAssignments(response.data);
      })
      .catch(error => {
        console.error('Error fetching survey assignment data:', error);
      });
  }, []);

  function ActiveSurveysSection() {
    const activeSurveys = surveyAssignments
      .filter(assignment => assignment.is_finished === false)
      .map(assignment => {
        const surveybox = surveys.find(survey => survey.id === assignment.survey.id && survey.status === 'ACTIVE');
        return surveybox || null;
      })
      .filter(survey => survey !== null);

    return (
      <div>
        <h2>Active</h2>
        <div className={'survey-container'}>
          {activeSurveys.map(survey => (
            <SurveyBox key={survey.id} survey={survey} openLinkTo={null} isSurveyActive={true} />
          ))}
        </div>
      </div>
    );
  }

  function CompletedSurveysSection() {
    const completedSurveys = surveyAssignments
      .filter(assignment => assignment.is_finished === true)
      .map(assignment => {
        const surveybox = surveys.find(survey => survey.id === assignment.survey.id && survey.status === 'ACTIVE');
        return surveybox || null;
      })
      .filter(survey => survey !== null);

    return (
      <div>
        <h2>Completed</h2>
        <div className={'survey-container'}>
          {completedSurveys.map(survey => (
            <SurveyBox key={survey.id} survey={survey} openLinkTo="history-test" isSurveyActive={false} />
            // TODO openLinkTo="history-test" is a placeholder for the link to the survey history page
          ))}
        </div>
      </div>
    );
  }

  // Component for the expired surveys section
  function ExpiredSurveysSection() {
    const expiredSurveys = surveys.filter(survey => survey.status === 'EXPIRED');

    return (
      <div>
        <h2>Expired</h2>
        <div className={'survey-container'}>
          {expiredSurveys.map(survey => (
            <SurveyBox key={survey.id} survey={survey} openLinkTo={null} isSurveyActive={false} />
          ))}
        </div>
      </div>
    );
  }

  // Component for a survey box
  function SurveyBox({ survey, openLinkTo, isSurveyActive }) {
    const [modalOpen, setModalOpen] = useState(false);

    const navigate = useNavigate();

    const handleSurvey = () => {
      navigate(`/complete-survey/${survey.id}`);
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
        {isSurveyActive ? (
          <Link to={null} onClick={openModal}>
            <div className={'name-row'}>
              <p className={'wrap-text'}>{survey.name}</p>
            </div>
          </Link>
        ) : (
          <Link to={openLinkTo}>
            <div className={'name-row'}>
              <p className={'wrap-text'}>{survey.name}</p>
            </div>
          </Link>
        )}

        <Modal show={modalOpen} onHide={closeModal} dialogClassName="rounded-modal">
          <Modal.Header closeButton>
            <Modal.Title className="modal-title">{survey.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className={'modal-subtitle'}>{survey.description}</p>
            <p>Number of questions: {survey.questions.length}</p>
            {/*TODO add approximate completion time column to survey table or find another way to calculate it*/}
            <p>Completion time: placeholder</p>
            <p>
              Author: {survey.user.firstName} {survey.user.lastName}
            </p>
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
      <h1>Assigned Surveys Dashboard</h1>
      <ActiveSurveysSection />
      <CompletedSurveysSection />
      <ExpiredSurveysSection />
    </div>
  );
};

export default UserSurveysDashboard;
