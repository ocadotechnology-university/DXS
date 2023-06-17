import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Dropdown, Modal } from 'react-bootstrap';
import './managerSurveysDashboard.css';
import { BsThreeDots, BsGear } from 'react-icons/bs';
import { FiSend, FiTrash2 } from 'react-icons/fi';
import { GrStatusInfo } from 'react-icons/gr';
import PublishPopUp from './components/publishPopUp';
import { Link, useNavigate } from 'react-router-dom';
import { deleteEntity } from 'app/entities/survey/survey.reducer';
import { useAppDispatch } from 'app/config/store';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManagerSurveysDashboard = () => {
  const [groups, setGroups] = useState([]);
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
    axios
      .get('/api/groups')
      .then(response => {
        // Update the groups state with the fetched data
        setGroups(response.data);
      })
      .catch(error => {
        console.error('Error fetching group data:', error);
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

    const surveyPath = `/survey/${survey.id}`;
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    const handleCancel = () => {
      setShowPopup(false);
    };

    const handlePublish = async (deadline, targetGroup) => {
      try {
        const updatedFields = {
          id: survey.id, // Include the survey ID
          status: 'Published',
          deadline,
        };

        // Make the API request to update the specific fields of the survey
        await axios.patch(`/api/surveys/${survey.id}`, updatedFields);

        // Find the group ID based on the targetGroup value
        const selectedGroup = groups.find(group => group.name === targetGroup);

        // Create a new record in the survey_target_groups table
        const groupResponse = await axios.post('/api/survey-target-groups', {
          survey: {
            id: survey.id,
            name: survey.name,
            description: survey.description,
            deadline: survey.deadline,
            // Include other survey properties if needed
          },
          group: {
            id: selectedGroup.id,
            name: selectedGroup.name,
            // Include other group properties if needed
          },
        });

        setShowPopup(false);
        setRefreshSurveys(true);
        // You can navigate to a different page if needed
        navigate('/manager-surveys-dashboard');
        toast.success('Survey published successfully');
      } catch (error) {
        console.error('Error updating survey:', error);
        toast.error('Failed to publish the survey');
      }
    };

    return (
      <div className={'survey'}>
        <div className={'survey-inside'}></div>
        <Dropdown>
          <Dropdown.Toggle variant="link" id="dropdown-menu" size="sm" style={{ marginLeft: '12rem' }}>
            <BsThreeDots style={{ fontSize: '15px' }} />
          </Dropdown.Toggle>

          <Dropdown.Menu style={{ borderRadius: '15px' }}>
            <Dropdown.Item onClick={() => setShowPopup(true)}>
              <FiSend className={'icon'} />
              Publish
            </Dropdown.Item>
            <Dropdown.Item>
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
        {showPopup && <PublishPopUp surveyName={survey.name} onCancel={handleCancel} onPublish={handlePublish} />}
        {/* Render other survey details as needed */}

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
