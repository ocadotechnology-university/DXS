import React, { useEffect, useState } from 'react';
import { createEntity as createSurveyEntity } from 'app/entities/survey/survey.reducer';
import { Col, Label, Row } from 'reactstrap';
import { ValidatedField, ValidatedForm } from 'react-jhipster';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getSession } from 'app/shared/reducers/authentication';
import { reset } from 'app/modules/account/settings/settings.reducer';

const SurveyCreator = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector(state => state.authentication.account);

  // Fetch the user information during component initialization
  useEffect(() => {
    dispatch(getSession());
    return () => {
      dispatch(reset());
    };
  }, []);

  const [surveyNameInput, setSurveyNameInput] = useState('');
  const [surveyDescInput, setSurveyDescInput] = useState('');

  const handleSurveyNameInputChange = event => {
    setSurveyNameInput(event.target.value);
  };

  const handleSurveyDescInputChange = event => {
    setSurveyDescInput(event.target.value);
  };

  function handleBackButtonClick() {
    window.history.back();
  }

  const handleSaveButtonClick = async () => {
    const surveyData = {
      name: surveyNameInput,
      description: surveyDescInput,
      status: 'DRAFT',
      user,
    };

    const createSurveyAction = createSurveyEntity(surveyData);
    const createSurveyResult = await dispatch(createSurveyAction);

    if (createSurveyResult.payload) {
      // @ts-expect-error not good practice but works for now
      const dataToSend = createSurveyResult.payload.data;
      navigate('/questionManager', { state: { surveyData: dataToSend } });
    } else {
      // Handle the case when the survey creation was not successful
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#F5F5F5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '1.5rem',
        height: '100%',
      }}
    >
      <div style={{ width: '75%', borderRadius: '15px', backgroundColor: '#D9D9D9', padding: '20px' }}>
        <Row>
          <Col>
            <h2 style={{ textAlign: 'center' }}>Create a new Survey</h2>
          </Col>
        </Row>
        <Row className="my-3">
          <Col>
            <ValidatedForm>
              <Label for="surveyName">Survey Name:</Label>
              <ValidatedField
                type="text"
                name="surveyName"
                id="surveyName"
                placeholder="Enter survey name"
                className="input-field"
                value={surveyNameInput}
                onChange={handleSurveyNameInputChange}
                validate={{
                  required: { value: true, message: 'This field is required.' },
                  minLength: { value: 3, message: 'This field is required to be at least 3 characters.' },
                  maxLength: { value: 120, message: 'This field cannot be longer than 120 characters.' },
                }}
              />
            </ValidatedForm>
          </Col>
        </Row>
        <Row className="my-3">
          <Col>
            <ValidatedForm>
              <Label for="surveyDescription">Survey Description:</Label>
              <ValidatedField
                type="textarea"
                name="surveyDescription"
                id="surveyDescription"
                placeholder="Enter survey description"
                className="input-field"
                value={surveyDescInput}
                onChange={handleSurveyDescInputChange}
                validate={{
                  required: { value: true, message: 'This field is required.' },
                  minLength: { value: 16, message: 'This field is required to be at least 16 characters.' },
                  maxLength: { value: 255, message: 'This field cannot be longer than 255 characters.' },
                }}
              />
            </ValidatedForm>
          </Col>
        </Row>
        <Row className="my-3">
          <Col>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <button
                style={{ backgroundColor: '#B85151', color: 'white', borderRadius: '15px', marginRight: '15px', width: '100px' }}
                onClick={handleBackButtonClick}
              >
                Cancel
              </button>
              <button
                style={{ backgroundColor: '#A9A0A0', color: 'white', borderRadius: '15px', width: '100px' }}
                onClick={() => {
                  void handleSaveButtonClick();
                }}
              >
                Save
              </button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SurveyCreator;
