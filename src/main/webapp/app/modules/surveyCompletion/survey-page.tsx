import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './survey-page.scss';
import { BiCommentDetail } from 'react-icons/bi';
import Slider from 'react-input-slider';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { createEntity, getEntities } from 'app/entities/answer/answer.reducer';
import { IAnswer } from 'app/shared/model/answer.model';
import { partialUpdateEntity } from 'app/entities/survey-assigment/survey-assigment.reducer';
import { ISurveyAssigment } from 'app/shared/model/survey-assigment.model';
import { getSession } from 'app/shared/reducers/authentication';
import { reset } from 'app/modules/account/settings/settings.reducer';

const SurveyPage = () => {
  const navigate = useNavigate();
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [comments, setComments] = useState([]);
  const [isCommentBoxVisible, setIsCommentBoxVisible] = useState(false);
  const [surveyAssignmentId, setSurveyAssignmentId] = useState(null);

  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.authentication.account);

  // Fetch the user information during component initialization
  useEffect(() => {
    dispatch(getSession());
    return () => {
      dispatch(reset());
    };
  }, []);

  useEffect(() => {
    axios
      .get(`/api/surveys/${surveyId}`)
      .then(response => {
        setSurvey(response.data);
      })
      .catch(error => {
        console.error('Error fetching survey data:', error);
      });
    axios
      .get(`/api/survey-assignments?surveyId=${surveyId}`)
      .then(response => {
        const surveyAssignment = response.data[0]; // Assuming there is only one survey assignment per survey
        setSurveyAssignmentId(surveyAssignment.id);
      })
      .catch(error => {
        console.error('Error fetching survey assignment data:', error);
      });
  }, [surveyId]);

  const renderAnswerInput = () => {
    const currentQuestion = survey.questions[currentQuestionIndex];

    if (currentQuestion.answerType === 'SLIDER') {
      const minValue = 1;
      const maxValue = 10;
      const stepValue = 1;
      const sliderValue = parseInt(answers[currentQuestionIndex], 10) || minValue;

      const steps = [];
      for (let i = minValue; i <= maxValue; i += stepValue) {
        steps.push(i);
      }

      return (
        <div>
          <div className="slider-step-labels">
            {steps.map(step => (
              <div key={step} className="slider-step-label">
                {step}
              </div>
            ))}
          </div>
          <Slider
            styles={{
              track: {
                backgroundColor: 'darkgray',
                width: '100%',
              },
              thumb: {
                width: 20,
                height: 20,
              },
              disabled: {
                opacity: 0.5,
              },
            }}
            axis="x"
            x={sliderValue}
            xmin={minValue}
            xmax={maxValue}
            onChange={({ x }) => handleAnswerChange({ target: { value: x.toString() } })}
          />
        </div>
      );
    }

    if (currentQuestion.answerType === 'TEXT') {
      return (
        <div>
          <input
            type="text"
            className="answer-input"
            placeholder="Enter your answer..."
            value={answers[currentQuestionIndex] || ''}
            onChange={handleAnswerChange}
          />
        </div>
      );
    }

    return null; // Handle unsupported answer types or default case
  };

  const handleNext = () => {
    if (currentQuestionIndex < survey.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsCommentBoxVisible(false);
    } else {
      // Prepare the data to be submitted
      const submittedAnswers: IAnswer[] = answers.map((answer, index) => ({
        answer,
        comment: comments[index] || '',
        question: survey.questions[index],
        user,
      }));

      try {
        // Dispatch the createEntity action for each answer
        for (const answer of submittedAnswers) {
          dispatch(createEntity(answer));
        }
        if (surveyAssignmentId) {
          updateSurveyAssignment();
        }
        navigate(`/survey/${surveyId}/history-url`);
      } catch (error) {
        // Handle the error response
        console.error('Error submitting answers:', error);
        // TODO: Handle the error and show appropriate feedback to the user
      } finally {
        // Dispatch the getEntities action to update the entities
        dispatch(getEntities({}));
      }
    }
  };

  const updateSurveyAssignment = () => {
    const changes: ISurveyAssigment = { is_finished: true, id: surveyAssignmentId };
    dispatch(partialUpdateEntity(changes));
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

  // const handleCommentSubmit = () => {
  //   setIsCommentBoxVisible(prevState => !prevState);
  //   // TODO i guess we need to save the comment somewhere to save while submitting the answers
  // };

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
        <div>{renderAnswerInput()}</div>
        {isCommentBoxVisible && (
          <div>
            <textarea
              className="comment-input"
              placeholder="Enter your comment (optional)"
              value={comments[currentQuestionIndex] || ''}
              onChange={handleCommentChange}
            />
            {/*<button className="comment-submit" onClick={handleCommentSubmit}>*/}
            {/*  Submit*/}
            {/*</button>*/}
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
