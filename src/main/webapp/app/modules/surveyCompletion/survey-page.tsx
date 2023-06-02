import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './survey-page.scss';
import { BiCommentDetail } from 'react-icons/bi';

const SurveyPage = () => {
  const navigate = useNavigate();
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [comments, setComments] = useState([]);
  const [isCommentBoxVisible, setIsCommentBoxVisible] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/surveys/${surveyId}`)
      .then(response => {
        setSurvey(response.data);
      })
      .catch(error => {
        console.error('Error fetching survey data:', error);
      });
  }, [surveyId]);

  const handleNext = () => {
    if (currentQuestionIndex < survey.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsCommentBoxVisible(false);
    } else {
      // TODO Save answers to the backend
      // ...
      // TODO Redirect to survey history page
      navigate(`/survey/${surveyId}/history-url`);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setIsCommentBoxVisible(false);
    }
  };

  const handleCancel = () => {
    // Redirect to dashboard or previous page
    navigate(-1);
  };

  const handleAnswerChange = event => {
    const { value } = event.target;
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = value;
    setAnswers(updatedAnswers);
  };

  const handleCommentChange = event => {
    const { value } = event.target;
    const updatedComments = [...comments];
    updatedComments[currentQuestionIndex] = value;
    setComments(updatedComments);
  };

  const handleCommentIconClick = () => {
    setIsCommentBoxVisible(prevState => !prevState);
  };

  const handleCommentSubmit = () => {
    setIsCommentBoxVisible(prevState => !prevState);
    // TODO add comment submit logic with notification if success or error
  };

  if (!survey) {
    return <div>Loading survey...</div>;
  }

  const currentQuestion = survey.questions[currentQuestionIndex];

  if (!currentQuestion) {
    return <div>No questions found.</div>;
  }

  const questionNumber = currentQuestionIndex + 1;
  const totalQuestions = survey.questions.length;
  const isLastQuestion = currentQuestionIndex === survey.questions.length - 1;
  const nextButtonText = isLastQuestion ? 'Finish' : 'Next';

  return (
    <div className="container">
      <div className="box">
        <div className="question-header">
          <h1 className="question-number">
            Question {questionNumber} / {totalQuestions}
          </h1>
          <div className="comment-icon" onClick={handleCommentIconClick}>
            <BiCommentDetail style={{ fontSize: '30px' }} />
          </div>
        </div>
        <div className="question-content">{currentQuestion.questionContent}</div>
        {/* Render answer input based on the question type */}
        {/* ... */}
        <div>
          {/*TODO Render answer input based on the question type*/}
          <textarea
            className="answer-input"
            placeholder="Enter your answer"
            value={answers[currentQuestionIndex] || ''}
            onChange={handleAnswerChange}
          />
        </div>
        {isCommentBoxVisible && (
          <div>
            <textarea
              className="comment-input"
              placeholder="Enter your comment (optional)"
              value={comments[currentQuestionIndex] || ''}
              onChange={handleCommentChange}
            />
            <button className="comment-submit" onClick={handleCommentSubmit}>
              Submit
            </button>
          </div>
        )}
        <div className="buttons">
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
            Previous
          </button>
          <button onClick={handleNext}>{nextButtonText}</button>
        </div>
      </div>
    </div>
  );
};

export default SurveyPage;
