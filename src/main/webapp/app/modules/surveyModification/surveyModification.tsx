import React, { useState } from 'react';
import { partialUpdateEntity as updateSurveyEntity } from 'app/entities/survey/survey.reducer';
import { Col, Label, Row } from 'reactstrap';
import { ValidatedField, ValidatedForm } from 'react-jhipster';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'app/config/store';

const SurveyModification = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const surveyData = location.state?.survey;

  const [surveyNameInput, setSurveyNameInput] = useState(surveyData?.name ?? '');
  const [surveyDescInput, setSurveyDescInput] = useState(surveyData?.description ?? '');

  const handleSurveyNameInputChange = event => {
    setSurveyNameInput(event.target.value);
  };

  const handleSurveyDescInputChange = event => {
    setSurveyDescInput(event.target.value);
  };

  const handleSaveButtonClick = async () => {
    const surveyModified = {
      name: surveyNameInput,
      description: surveyDescInput,
      id: surveyData.id,
    };

    const updateSurveyAction = updateSurveyEntity(surveyModified);
    const createSurveyResult = await dispatch(updateSurveyAction);

    if (createSurveyResult.payload) {
      // Survey modification successful
      navigate('/manager-surveys-dashboard');
    } else {
      // Handle error during survey modification
      console.error('Error modifying survey');
    }
  };

  return (
    <div style={{ backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Survey Name */}
      <div style={{ backgroundColor: '#D9D9D9', padding: '20px', borderBottom: '1px solid #D9D9D9', marginBottom: '45px', width: '65%' }}>
        <h2>{'Survey ' + (surveyData?.name ?? '') + ' modification'}</h2>
      </div>

      <div style={{ width: '65%', borderRadius: '15px', backgroundColor: '#D9D9D9', padding: '20px' }}>
        <Row>
          <Col>
            <h2 style={{ textAlign: 'center' }}>Modify a survey</h2>
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
                style={{ backgroundColor: 'red', color: 'white', borderRadius: '5px', marginRight: '10px' }}
                // onClick={handleBackButtonClick}
              >
                BACK
              </button>
              <button style={{ backgroundColor: 'gray', color: 'white', borderRadius: '5px' }} onClick={handleSaveButtonClick}>
                SAVE
              </button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SurveyModification;
