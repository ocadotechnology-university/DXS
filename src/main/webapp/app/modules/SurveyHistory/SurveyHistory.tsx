import React, { useEffect, useState } from 'react';
import './SurveyHistory.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SurveyHistory = () => {
  const { surveyId, userId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [questionData, setQuestionData] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/surveys/${surveyId}/questions`)
      .then(response => setQuestions(response.data))
      .catch(error => console.error('Error fetching survey assignment data:', error));
  }, [surveyId]);

  useEffect(() => {
    if (questions.length > 0) {
      const fetchAnswersAndUpdateData = async () => {
        const updatedData = await Promise.all(
          questions.map(async question => {
            try {
              const response = await axios.get(`/api/answersforquestion?questionId=${question.id}&userId=${userId}`);
              const answerData = response.data;
              return {
                questionNumber: question.order,
                questionText: question.questionContent,
                userAnswer: answerData.answer || '',
                userComment: answerData.comment || '',
                managerResponse: answerData.comment_answer || '',
              };
            } catch (error) {
              console.error('Error fetching answers:', error);
              return {
                questionNumber: question.order,
                questionText: question.questionContent,
                userAnswer: '',
                userComment: '',
                managerResponse: '',
              };
            }
          })
        );
        setQuestionData(updatedData);
      };
      fetchAnswersAndUpdateData();
    }
  }, [questions, userId]);

  useEffect(() => {
    if (answers.length === questions.length) {
      const updatedQuestionData = questions.map((question, index) => {
        const answerData = answers[index] || {};
        return {
          questionNumber: question.order,
          questionText: question.questionContent,
          userAnswer: answerData.answer || '',
          userComment: answerData.comment || '',
          managerResponse: answerData.comment_answer || '',
        };
      });
      setQuestionData(updatedQuestionData);
    }
  }, [questions, answers]);

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
