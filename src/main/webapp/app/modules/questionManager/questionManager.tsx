import React, { useEffect, useState } from 'react';
import { createEntity as createQuestionEntity, deleteEntity as deleteQuestionEntity } from 'app/entities/question/question.reducer';
import { Col, FormGroup, Label, Row } from 'reactstrap';
import { ValidatedField, ValidatedForm } from 'react-jhipster';
import { FaPen, FaTrash } from 'react-icons/fa';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'app/config/store';
import { Button, Modal } from 'react-bootstrap';

const QuestionManager = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const surveyData = location.state?.surveyData;
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAnswerType, setSelectedAnswerType] = useState('');
  const [isObligatorySwitch, setIsObligatorySwitch] = useState(false);

  useEffect(() => {
    (async () => {
      if (surveyData) {
        try {
          const response = await fetch(`/api/questions`);
          const questionsData = await response.json();
          setQuestions(questionsData);
        } catch (error) {
          // Handle any error that occurs during the fetch
          console.error('Error fetching questions:', error);
        }
      }
    })();
  }, [surveyData]);

  const handleIsObligatorySwitchStateChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsObligatorySwitch(event.target.checked);
  };

  const handleQuestionChange = event => {
    setSelectedQuestion(event.target.value);
  };

  const handleCategoryChange = event => {
    setSelectedCategory(event.target.value);
  };

  const handleAnswerTypeChange = event => {
    setSelectedAnswerType(event.target.value);
  };

  const handleAddQuestion = async () => {
    if (selectedQuestion) {
      let newQuestion = {
        questionContent: selectedQuestion,
        category: selectedCategory,
        answerType: selectedAnswerType,
        isRequired: isObligatorySwitch, // Include the isRequired property
        survey: surveyData,
      };

      const createQuestionAction = createQuestionEntity(newQuestion);
      const getQuestionData = await dispatch(createQuestionAction);

      newQuestion = {
        questionContent: selectedQuestion,
        category: selectedCategory,
        // @ts-ignore
        id: getQuestionData.payload.data.id,
        answerType: selectedAnswerType,
        isRequired: isObligatorySwitch, // Include the isRequired property
        survey: surveyData,
      };

      setQuestions([...questions, newQuestion]);
      setSelectedQuestion('');
      setSelectedCategory('');
      setSelectedAnswerType('');
    }
  };

  const handleDragStart = (event, question) => {
    event.dataTransfer.setData('question', JSON.stringify(question));
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = event => {
    event.preventDefault();
    const droppedQuestion = JSON.parse(event.dataTransfer.getData('question'));
    const dropIndex = event.target.dataset.index;

    if (droppedQuestion) {
      const updatedQuestions = [...questions];
      updatedQuestions.splice(dropIndex, 0, droppedQuestion);
      setQuestions(updatedQuestions);
    }
  };

  const handleDragOver = event => {
    event.preventDefault();
  };

  const handleDeleteQuestion = question => {
    const deleteQuestionAction = deleteQuestionEntity(question.id);
    dispatch(deleteQuestionAction);

    const updatedQuestions = questions.filter(q => q !== question);
    setQuestions(updatedQuestions);
    setShowDeleteModal(false);
  };

  const handleDeleteClick = question => {
    setSelectedQuestion(question);
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleModifyQuestion = question => {
    navigate('/questionModification', { state: { question } });
  };

  return (
    <div style={{ backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Survey Name */}
      <div style={{ backgroundColor: '#D9D9D9', padding: '20px', borderBottom: '1px solid #D9D9D9', marginBottom: '45px', width: '65%' }}>
        <h2>{surveyData?.name ?? 'Survey Name'}</h2>
      </div>
      {/* Question Creator */}
      <div style={{ backgroundColor: '#D9D9D9', padding: '20px', width: '65%', marginBottom: '45px' }}>
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
          <Col className="d-flex justify-content-center">
            <Button color="primary" style={{ borderRadius: '25px' }} onClick={handleAddQuestion}>
              Add Question
            </Button>
          </Col>
          <Col className="d-flex justify-content-center">
            <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" style={{ borderRadius: '25px' }}>
              Create survey
            </Button>
          </Col>
        </Row>
      </div>
      {/* Drag and Drop List of Created Questions */}
      <div style={{ backgroundColor: '#D9D9D9', padding: '20px', borderTop: '1px solid #D9D9D9', width: '65%' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Created Questions</h3>
        <ul>
          {questions
            .filter(question => question.survey?.id === surveyData.id)
            .map((question, index) => (
              <li
                key={index}
                draggable
                onDragStart={event => handleDragStart(event, question)}
                onDrop={handleDrop}
                onDragOver={event => handleDragOver(event)}
                data-index={index}
                style={{
                  cursor: 'move',
                  backgroundColor: index % 2 === 0 ? '#ECECEC' : '#F5F5F5',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <strong>Question:</strong> {question.questionContent}
                </div>
                <div>
                  <strong>Category:</strong> {question.category}
                </div>
                <div>
                  <strong>Answer Type:</strong> {question.answerType}
                </div>
                <div>
                  <FaTrash onClick={() => handleDeleteClick(question)} style={{ cursor: 'pointer' }} />
                  <FaPen onClick={() => handleModifyQuestion(question)} style={{ cursor: 'pointer' }} />
                </div>

                {/* Delete Modal */}

                <Modal show={showDeleteModal} onHide={handleDeleteCancel} centered backdropClassName="custom-backdrop">
                  <Modal.Header closeButton>
                    <Modal.Title>Delete Question</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p className={'wrap-text'}>Are you sure you want to delete a question {question.id}?</p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteCancel}>
                      Cancel
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteQuestion(selectedQuestion)}>
                      Delete
                    </Button>
                  </Modal.Footer>
                </Modal>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default QuestionManager;
