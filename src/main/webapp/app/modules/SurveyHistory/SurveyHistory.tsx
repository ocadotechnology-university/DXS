import React from 'react';
import './SurveyHistory.css';

const SurveyHistory = () => {
  // Data for survey questions
  const questionData = [
    {
      questionNumber: 'Question 1',
      questionText: 'I’m satisfied happy with our tech stack',
      userAnswer: '9 out of 10',
      userComment: 'I love Java!',
      managerResponse: 'Me too!',
    },
    {
      questionNumber: 'Question 2',
      questionText: 'Do you think your laptop should be replaced with a new one?',
      userAnswer: 'Yes',
      userComment: 'My equipment is already 4 years old!',
      managerResponse: '-',
    },
    {
      questionNumber: 'Question 3',
      questionText: 'What do you like most about your daily work?',
      userAnswer: 'New challenges every day, interesting projects',
      userComment: '-',
      managerResponse: '-',
    },
    {
      questionNumber: 'Question 4',
      questionText: 'I feel like a lot of my time gets wasted.',
      userAnswer: '2/10',
      userComment: '-',
      managerResponse: '-',
    },
  ];

  const surveyTitle = 'Survey1';
  const surveyDate = '2023-06-01';

  return (
    <div className="survey-history">
      <div className="survey-info">
        <div className="survey-title">{surveyTitle}</div>
        <div className="survey-date">Completed on: {surveyDate}</div>
      </div>

      {questionData.map((question, index) => (
        <table className="question-table" key={index}>
          <tbody>
            <tr>
              <td className="question-number">{question.questionNumber}</td>
              <td className="question-text">{question.questionText}</td>
            </tr>
            <tr>
              <td className="label">Your answer</td>
              <td className="answer">{question.userAnswer}</td>
            </tr>
            <tr>
              <td className="label">Your comment</td>
              <td className="comment">{question.userComment}</td>
            </tr>
            <tr>
              <td className="label">Manager’s response</td>
              <td className="response">{question.managerResponse}</td>
            </tr>
          </tbody>
        </table>
      ))}

      <div className="question-break"></div>
    </div>
  );
};

export default SurveyHistory;
