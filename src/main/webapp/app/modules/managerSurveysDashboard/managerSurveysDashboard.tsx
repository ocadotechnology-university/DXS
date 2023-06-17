import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Dropdown, Modal } from 'react-bootstrap';
import './managerSurveysDashboard.css';
import { BsGear, BsThreeDots } from 'react-icons/bs';
import { FiSend, FiTrash2 } from 'react-icons/fi';
import { GrStatusInfo } from 'react-icons/gr';
import { Link, useNavigate } from 'react-router-dom';
import { deleteEntity } from 'app/entities/survey/survey.reducer';
import { useAppDispatch } from 'app/config/store';

const ManagerSurveysDashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [refreshSurveys, setRefreshSurveys] = useState(false);

  // TODO this code will look different because we will have to fetch the surveys created only by this manager (for now it fetches everything, waiting for backend to be ready)
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
      })
      .finally(() => {
        // Reset the refresh status
        setRefreshSurveys(false);
      });
  }, [refreshSurveys]);

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
  function NotPublishedSurveysSection() {
    const notPublishedSurveys = surveys.filter(survey => survey.status === 'inactive');

    return (
      <div>
        <h2>Not published</h2>
        {notPublishedSurveys.map(survey => (
          <SurveyBox key={survey.id} survey={survey} />
        ))}
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleDeleteClick = () => {
      setShowDeleteModal(true);
    };

    const handleDeleteCancel = () => {
      setShowDeleteModal(false);
    };

    const handleDeleteConfirm = () => {
      dispatch(deleteEntity(survey.id));
      setShowDeleteModal(false);
      setTimeout(() => {
        setRefreshSurveys(true);
      }, 1000);
    };

    const handleModifySurvey = () => {
      navigate('/survey-modification', { state: { survey } });
    };

    return (
      <div className={'survey'}>
        <div className={'survey-inside'}></div>
        <Dropdown>
          <Dropdown.Toggle variant="link" id="dropdown-menu" size="sm" style={{ marginLeft: '12rem' }}>
            <BsThreeDots style={{ fontSize: '15px' }} />
          </Dropdown.Toggle>

          <Dropdown.Menu style={{ borderRadius: '15px' }}>
            <Dropdown.Item>
              <FiSend className={'icon'} />
              Publish
            </Dropdown.Item>
            <Dropdown.Item onClick={handleModifySurvey}>
              <BsGear className={'icon'} />
              Modify
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/SurveyStatusView">
              <GrStatusInfo className={'icon'} />
              Status
            </Dropdown.Item>
            <Dropdown.Item className={'option-delete'} onClick={handleDeleteClick}>
              <FiTrash2 className={'icon'} />
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Link to="/SurveyStatusView">
          <div className={'name-row'}>
            <p className={'wrap-text'}>{survey.name}</p>
          </div>
        </Link>

        <Modal show={showDeleteModal} onHide={handleDeleteCancel} centered backdropClassName="custom-backdrop">
          <Modal.Header closeButton>
            <Modal.Title>Delete Survey</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className={'wrap-text'}>Are you sure you want to delete a survey with id {survey.id}?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  return (
    <div>
      <h1>Surveys Dashboard</h1>
      <ActiveSurveysSection />
      <NotPublishedSurveysSection />
      <ExpiredSurveysSection />
    </div>
  );
};

export default ManagerSurveysDashboard;
