import React, { useState } from 'react';
import { partialUpdateEntity as updateQuestionEntity } from 'app/entities/question/question.reducer';
import { Col, FormGroup, Label, Row } from 'reactstrap';
import { ValidatedField, ValidatedForm } from 'react-jhipster';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'app/config/store';

const QuestionModification = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const questionData = location.state?.question;

  const [selectedCategory, setSelectedCategory] = useState(questionData?.category ?? '');
  const [selectedAnswerType, setSelectedAnswerType] = useState(questionData?.answerType ?? '');
  const [selectedQuestion, setSelectedQuestion] = useState(questionData?.questionContent ?? '');
  const [isObligatorySwitch, setIsObligatorySwitch] = useState(questionData?.isRequired ?? false);

  const handleCategoryChange = e => {
    setSelectedCategory(e.target.value);
  };

  const handleAnswerTypeChange = e => {
    setSelectedAnswerType(e.target.value);
  };

  const handleQuestionChange = e => {
    setSelectedQuestion(e.target.value);
  };

  const handleIsObligatorySwitchStateChanged = e => {
    setIsObligatorySwitch(e.target.checked);
  };

  function handleBackButtonClick() {
    window.history.back();
  }
  const handleModifyButtonClick = async () => {
    const modifiedQuestion = {
      questionContent: selectedQuestion,
      category: selectedCategory,
      id: questionData.id,
      answerType: selectedAnswerType,
      isRequired: isObligatorySwitch,
    };

    const updateQuestionAction = updateQuestionEntity(modifiedQuestion);
    const updateQuestionResult = await dispatch(updateQuestionAction);

    if (updateQuestionResult.payload) {
      // Survey creation successful
      // @ts-expect-error not good practice but works for now
      navigate('/questionManager', { state: { surveyData: updateQuestionResult.payload.data.survey } });
    } else {
      // Handle error during question updating
      console.error('Error updating question');
    }
  };

  return (
    <div style={{ backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Question Name */}
      <div style={{ backgroundColor: '#D9D9D9', padding: '20px', borderBottom: '1px solid #D9D9D9', marginBottom: '45px', width: '65%' }}>
        <h2>{'Question ' + (questionData?.id ?? 'Question') + ' modification'}</h2>
      </div>

      {/* Question Creator */}
      <div style={{ backgroundColor: '#D9D9D9', padding: '20px', width: '65%', marginBottom: '45px' }}>
        <Row className="my-3">
          <Col>
            <h3 style={{ textAlign: 'center' }}>Modify a question</h3>
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
                className="input-field"
                value={selectedCategory}
                onChange={handleCategoryChange}
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
                className="input-field"
                value={selectedAnswerType}
                onChange={handleAnswerTypeChange}
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              >
                <option value="">Select an answer type</option>
                <option value="TEXT">Text</option>
                <option value="SLIDER">Slider</option>
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
                  className="input-field"
                  value={selectedQuestion}
                  onChange={handleQuestionChange}
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
          <Col>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <button
                style={{ backgroundColor: '#B85151', color: 'white', borderRadius: '15px', marginRight: '15px', width: '190px' }}
                onClick={handleBackButtonClick}
              >
                Back to questions list
              </button>
              <button
                style={{ backgroundColor: '#A9A0A0', color: 'white', borderRadius: '15px', width: '100px' }}
                onClick={() => {
                  void handleModifyButtonClick();
                }}
              >
                Modify
              </button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default QuestionModification;
