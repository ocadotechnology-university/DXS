import React, { useEffect, useState } from 'react';
import {
  createEntity as createQuestionEntity,
  deleteEntity as deleteQuestionEntity,
  partialUpdateEntityWithoutToast,
} from 'app/entities/question/question.reducer';
import { Col, FormGroup, Label, Row } from 'reactstrap';
import { ValidatedField, ValidatedForm } from 'react-jhipster';
import { FaPen, FaTrash } from 'react-icons/fa';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'app/config/store';
import { Button, Modal } from 'react-bootstrap';
import { partialUpdateEntity } from 'app/entities/question/question.reducer';
import { toast } from 'react-toastify';

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
  const [order, setOrder] = useState(1);

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
        isRequired: isObligatorySwitch,
        survey: surveyData,
        order,
      };

      try {
        const createQuestionAction = createQuestionEntity(newQuestion);
        const getQuestionData = await dispatch(createQuestionAction);

        newQuestion = {
          ...newQuestion,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          id: getQuestionData.payload.data.id,
        };

        setQuestions([...questions, newQuestion]);
        setSelectedQuestion('');
        setSelectedCategory('');
        setSelectedAnswerType('');

        // Increment the order for the next question
        setOrder(prevOrder => prevOrder + 1);
      } catch (error) {
        console.error('Error creating question:', error);
      }
    }
  };

  const handleDragStart = (event, question) => {
    event.dataTransfer.setData('question', JSON.stringify(question));
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = event => {
    event.preventDefault();
    const droppedQuestion = JSON.parse(event.dataTransfer.getData('question'));
    const dropIndex = event.currentTarget.dataset.index;
    // eslint-disable-next-line no-console
    console.log('dropIndex:' + dropIndex);
    if (droppedQuestion) {
      const updatedQuestions = [...questions]; // Create a copy of the original array
      const existingQuestionIndex = updatedQuestions.findIndex(q => q.id === droppedQuestion.id);

      if (existingQuestionIndex !== -1) {
        // Remove the existing question from its previous position
        updatedQuestions.splice(existingQuestionIndex, 1);
      }

      // Insert the dropped question at the drop position
      updatedQuestions.splice(dropIndex, 0, droppedQuestion);

      // Update the order values based on the updated array
      const updatedQuestionsWithOrder = updatedQuestions
        .filter(q => q.survey?.id === surveyData.id)
        .map((q, index) => ({
          ...q,
          order: index + 1, // Set the order based on the index (+1 to start from 1)
        }));

      setQuestions(updatedQuestionsWithOrder);

      // Dispatch the partialUpdateEntity action for each question with its updated order
      const updateOrderPromises = updatedQuestionsWithOrder.map(
        q => dispatch(partialUpdateEntityWithoutToast({ ...q, id: q.id })) // Dispatch the action without displaying toast notifications
      );

      Promise.all(updateOrderPromises)
        .then(() => {
          // eslint-disable-next-line no-console
          console.log('Order values updated successfully');
        })
        .catch(error => {
          console.error('Error updating order values:', error);
        });
    }
  };
  const handleDragOver = event => {
    event.preventDefault();
  };
  const handleDeleteQuestion = question => {
    const deleteQuestionAction = deleteQuestionEntity(question.id);
    dispatch(deleteQuestionAction);

    const updatedQuestions = questions
      .filter(q => q !== question && q.survey?.id === surveyData.id)
      .map(q => {
        if (q.order > question.order) {
          // Decrease the order value for questions with order greater than the deleted one
          return {
            ...q,
            order: q.order - 1,
          };
        }
        return q;
      });
    setQuestions(updatedQuestions);
    setShowDeleteModal(false);
    setOrder(prevOrder => prevOrder - 1);

    return Promise.all(
      updatedQuestions
        .filter(q => q !== question && q.survey?.id === surveyData.id)
        .map(q => dispatch(partialUpdateEntity({ ...q, id: q.id }))) // Use the partialUpdateEntity action
    )
      .then(() => {
        // eslint-disable-next-line no-console
        console.log('Order values updated successfully');
      })
      .catch(error => {
        console.error('Error updating order values:', error);
      });
  };

  const handleDeleteClick = question => {
    setSelectedQuestion(question);
    setSelectedCategory(question.order);
    setShowDeleteModal(true);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleModifyQuestion = question => {
    navigate('/questionModification', { state: { question } });
  };

  const handleSaveButtonClick = () => {
    navigate('/manager-surveys-dashboard');
  };

  const handleCancelButtonClick = () => {
    // broken routes to home, that's why navigating to '/' which is homepage
    navigate('/');
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
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <button
              style={{ backgroundColor: '#B85151', color: 'white', borderRadius: '15px', marginRight: '15px', width: '100px' }}
              onClick={handleCancelButtonClick}
            >
              Cancel
            </button>
            <button
              style={{ backgroundColor: '#bd9d9d', color: 'white', borderRadius: '15px', marginRight: '15px', width: '130px' }}
              onClick={() => {
                void handleAddQuestion();
              }}
            >
              Add Question
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
        </Row>
      </div>
      {/* Created Questions */}
      <div style={{ backgroundColor: '#D9D9D9', padding: '20px', borderTop: '1px solid #D9D9D9', width: '65%' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '20px', width: '100%' }}>Created Questions</h3>
      </div>
      {/* Static Columns */}
      <div
        style={{
          backgroundColor: '#D9D9D9',
          padding: '10px',
          width: '65%',
          marginBottom: '10px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ flex: '0 0 10%' }}>Order</div>
        <div style={{ flex: '0 0 30%' }}>Question</div>
        <div style={{ flex: '0 0 20%' }}>Category</div>
        <div style={{ flex: '0 0 20%' }}>Answer Type</div>
        <div style={{ flex: '0 0 10%' }}>Actions</div>
      </div>
      {/* Drag and Drop List of Created Questions */}
      <div style={{ backgroundColor: '#D9D9D9', padding: '20px', borderTop: '1px solid #D9D9D9', width: '65%' }}>
        <ul>
          {questions
            .filter(question => question.survey?.id === surveyData.id)
            .map((question, index) => (
              <li
                key={question.id}
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
                <div style={{ flex: '0 0 10%' }}>{question.order}</div>
                <div style={{ flex: '0 0 30%' }}>{question.questionContent}</div>
                <div style={{ flex: '0 0 20%' }}>{question.category}</div>
                <div style={{ flex: '0 0 20%' }}>{question.answerType}</div>
                <div style={{ flex: '0 0 10%' }}>
                  <FaTrash onClick={() => handleDeleteClick(question)} style={{ cursor: 'pointer' }} />
                  <FaPen onClick={() => handleModifyQuestion(question)} style={{ cursor: 'pointer' }} />
                </div>

                {/* Delete Modal */}

                <Modal show={showDeleteModal} onHide={handleDeleteCancel} centered backdropClassName="custom-backdrop">
                  <Modal.Header closeButton>
                    <Modal.Title>Delete Question</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    <p className="wrap-text">Are you sure you want to delete question {selectedCategory}?</p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteCancel}>
                      Cancel
                    </Button>
                    {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
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
