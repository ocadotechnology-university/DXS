import './surveyCreator.scss';

import {
  createEntity as createSurveyEntity,
  updateEntity as updateSurveyEntity,
  getEntities as getSurveyEntities,
} from 'app/entities/survey/survey.reducer';
import {
  createEntity as createQuestionEntity,
  getEntities as getQuestionEntities,
  updateEntity as updateQuestionEntity,
} from 'app/entities/question/question.reducer';

import { Row, Col, FormGroup, Label, Button } from 'reactstrap';
import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ValidatedField, ValidatedForm } from 'react-jhipster';

const SurveyCreator = () => {
  useEffect(() => {
    dispatch(getQuestionEntities({}));
  }, []);

  useEffect(() => {
    dispatch(getSurveyEntities({}));
  }, []);

  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const [questionList, setQuestionList] = useState([]);
  const [categoryInput, setCategoryInput] = useState('');
  const [answerTypeInput, setAnswerTypeInput] = useState('');
  const [questionInput, setQuestionInput] = useState('');
  const [isObligatorySwitch, setIsObligatorySwitch] = useState(false);

  const [surveyNameInput, setSurveyNameInput] = useState('');
  const [surveyDescInput, setSurveyDescInput] = useState('');

  const handleAddQuestion = () => {
    if (categoryInput && answerTypeInput && questionInput) {
      const newQuestion = {
        category: categoryInput,
        answerType: answerTypeInput,
        question: questionInput,
        isObligatory: isObligatorySwitch,
      };
      setQuestionList([...questionList, newQuestion]);
      setCategoryInput('');
      setAnswerTypeInput('');
      setQuestionInput('');
      setIsObligatorySwitch(false);
    }
  };

  const handleIsObligatorySwitchStateChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsObligatorySwitch(event.target.checked);
  };

  const handleDeleteQuestion = index => {
    const newQuestionList = [...questionList];
    newQuestionList.splice(index, 1);
    setQuestionList(newQuestionList);
  };

  const saveEntity = async () => {
    const entity = {
      name: surveyNameInput,
      description: surveyDescInput,
    };
    setSurveyNameInput('');
    setSurveyDescInput('');

    if (isNew) {
      const newSurvey = await dispatch(createSurveyEntity(entity));
      // @ts-expect-error not good practice but works for now
      saveQuestionEntity(newSurvey.payload.data);
    } else {
      dispatch(updateSurveyEntity(entity));
      saveQuestionEntity(entity);
    }
    setQuestionList([]);
  };

  const handleClick = () => {
    saveEntity().catch(error => {
      // eslint-disable-next-line no-console
      console.log('Error:', error);
    });
  };

  const saveQuestionEntity = surveyEntity => {
    questionList.forEach(question => {
      const questionEntity = {
        category: question.category,
        answerType: question.answerType,
        questionContent: question.question,
        isRequired: question.isObligatory,
        survey: surveyEntity,
      };
      if (isNew) {
        dispatch(createQuestionEntity(questionEntity));
      } else {
        dispatch(updateQuestionEntity(questionEntity));
      }
    });
  };
  const handleSurveyNameInputChange = event => {
    setSurveyNameInput(event.target.value);
  };

  const handleSurveyDescInputChange = event => {
    setSurveyDescInput(event.target.value);
  };

  // TODO probably need to add reducer to save surveys to database, for time mocks are used this code is acceptable

  return (
    <div
      style={{
        backgroundColor: '#F5F5F5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'auto',
        marginTop: '1.5rem',
      }}
    >
      <div style={{ width: '50%', borderRadius: '15px', backgroundColor: '#D9D9D9', padding: '20px' }}>
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
            <h3 style={{ textAlign: 'center' }}>Question Creator</h3>
          </Col>
        </Row>
        <Row className="my-3">
          <Col>
            <ValidatedForm>
              <Label for="categoryInput">Category:</Label>
              <ValidatedField
                type="select"
                name="categoryInput"
                id="categoryInput"
                value={categoryInput}
                onChange={e => setCategoryInput(e.target.value)}
                className="input-field"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              >
                <option value="">Select a category</option>
                <option value="technology">Technology</option>
                <option value="food">Food</option>
                <option value="sports">Sports</option>
              </ValidatedField>
            </ValidatedForm>
          </Col>
          <Col>
            <ValidatedForm>
              <Label for="answerTypeInput">Answer Type:</Label>
              <ValidatedField
                type="select"
                name="answerTypeInput"
                id="answerTypeInput"
                value={answerTypeInput}
                onChange={e => setAnswerTypeInput(e.target.value)}
                className="input-field"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              >
                <option value="">Select an answer type</option>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="select">Select</option>
              </ValidatedField>
            </ValidatedForm>
          </Col>
        </Row>
        <Row className="my-3">
          <Col>
            <FormGroup>
              <ValidatedForm>
                <Label for="questionInput">Question:</Label>
                <ValidatedField
                  type="textarea"
                  name="questionInput"
                  id="questionInput"
                  placeholder="Enter question"
                  value={questionInput}
                  onChange={e => setQuestionInput(e.target.value)}
                  className="input-field"
                  validate={{
                    required: { value: true, message: 'This field is required.' },
                    minLength: { value: 16, message: 'This field is required to be at least 16 characters.' },
                    maxLength: { value: 255, message: 'This field cannot be longer than 255 characters.' },
                  }}
                />
              </ValidatedForm>
            </FormGroup>
          </Col>
        </Row>
        <Row className="my-3">
          <Col>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={isObligatorySwitch}
                    onChange={handleIsObligatorySwitchStateChanged}
                    color="default"
                    name="isObligatoryCheck"
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label="Answer required"
              />
            </FormGroup>
          </Col>
        </Row>
        <Row className="my-3">
          <Col className="d-flex justify-content-center">
            <Button color="primary" style={{ borderRadius: '25px' }} onClick={handleAddQuestion}>
              Add Question
            </Button>
          </Col>
          <Col className="d-flex justify-content-center">
            <Button
              color="primary"
              id="save-entity"
              data-cy="entityCreateSaveButton"
              type="submit"
              style={{ borderRadius: '25px' }}
              onClick={handleClick}
            >
              Create survey
            </Button>
          </Col>
        </Row>

        <Row className="my-3">
          <Col>
            <h3 style={{ textAlign: 'center' }}>Question List</h3>
            <div style={{ borderRadius: '25px', backgroundColor: '#F5F5F5', padding: '10px' }}>
              {questionList.length > 0 ? (
                <ul key={questionList.length}>
                  {questionList.map((question, index) => (
                    <li key={index} style={{ marginBottom: '10px' }}>
                      <p style={{ marginLeft: '20px' }}>{question.question}</p>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <p style={{ marginRight: '80px' }}>Category: {question.category} </p>
                        <p style={{ marginRight: '80px' }}>Answer Type: {question.answerType}</p>
                        <p style={{ marginRight: '80px' }}>Required: {question.isObligatory ? 'Yes' : 'No'}</p>
                        <button style={{ marginRight: '20px' }} onClick={() => handleDeleteQuestion(index)}>
                          <FaTrash />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No questions added yet</p>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SurveyCreator;
