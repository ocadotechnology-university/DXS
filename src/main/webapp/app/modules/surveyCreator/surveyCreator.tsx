import { Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';
import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

const SurveyCreator = () => {
  const [questionList, setQuestionList] = useState([]);
  const [categoryInput, setCategoryInput] = useState('');
  const [answerTypeInput, setAnswerTypeInput] = useState('');
  const [questionInput, setQuestionInput] = useState('');
  const [isObligatorySwitch, setIsObligatorySwitch] = useState(false);

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

  return (
    <div style={{ backgroundColor: '#F5F5F5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '50%', borderRadius: '15px', backgroundColor: '#D9D9D9', padding: '20px' }}>
        <Row>
          <Col>
            <h2 style={{ textAlign: 'center' }}>Create a new Survey</h2>
          </Col>
        </Row>
        <Row className="my-3">
          <Col>
            <FormGroup>
              <Label for="surveyName">Survey Name:</Label>
              <Input
                type="text"
                name="surveyName"
                id="surveyName"
                placeholder="Enter survey name"
                style={{ borderRadius: '25px', backgroundColor: '#F5F5F5' }}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row className="my-3">
          <Col>
            <FormGroup>
              <Label for="surveyDescription">Survey Description:</Label>
              <Input
                type="textarea"
                name="surveyDescription"
                id="surveyDescription"
                placeholder="Enter survey description"
                style={{ borderRadius: '25px', backgroundColor: '#F5F5F5' }}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row className="my-3">
          <Col>
            <h3 style={{ textAlign: 'center' }}>Question Creator</h3>
          </Col>
        </Row>
        <Row className="my-3">
          <Col>
            <FormGroup>
              <Label for="categoryInput">Category:</Label>
              <Input
                type="select"
                name="categoryInput"
                id="categoryInput"
                value={categoryInput}
                onChange={e => setCategoryInput(e.target.value)}
                style={{ borderRadius: '25px', backgroundColor: '#F5F5F5' }}
              >
                <option value="">Select a category</option>
                <option value="technology">Technology</option>
                <option value="food">Food</option>
                <option value="sports">Sports</option>
              </Input>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="answerTypeInput">Answer Type:</Label>
              <Input
                type="select"
                name="answerTypeInput"
                id="answerTypeInput"
                value={answerTypeInput}
                onChange={e => setAnswerTypeInput(e.target.value)}
                style={{ borderRadius: '25px', backgroundColor: '#F5F5F5' }}
              >
                <option value="">Select an answer type</option>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="select">Select</option>
              </Input>
            </FormGroup>
          </Col>
        </Row>
        <Row className="my-3">
          <Col>
            <FormGroup>
              <Label for="questionInput">Question:</Label>
              <Input
                type="textarea"
                name="questionInput"
                id="questionInput"
                placeholder="Enter question"
                value={questionInput}
                onChange={e => setQuestionInput(e.target.value)}
                style={{ borderRadius: '25px', backgroundColor: '#F5F5F5' }}
              />
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
        </Row>
        <Row className="my-3">
          <Col>
            <h3 style={{ textAlign: 'center' }}>Question List</h3>
            <div style={{ borderRadius: '25px', backgroundColor: '#F5F5F5', padding: '10px' }}>
              {questionList.length > 0 ? (
                <ul>
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
