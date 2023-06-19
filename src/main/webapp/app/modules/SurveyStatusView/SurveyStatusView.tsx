import React, { useEffect, useState } from 'react';
import './SurveyStatusView.css';
import { Link, useParams } from 'react-router-dom';
import { useTable } from 'react-table';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SurveyInfo = ({ surveyTitle, surveyDueDate, surveyDescription }) => {
  return (
    <div className="info-container">
      <h2 className="survey-title">{surveyTitle}</h2>
      <p className="survey-due">Survey due to: {surveyDueDate}</p>
      <hr className="divider" />
      <p className="survey-description">Description: {surveyDescription}</p>
    </div>
  );
};
const SurveyTable = ({ columns, data }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <div className="table-container">
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th key={column.id} {...column.getHeaderProps()}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr key={row.id} {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td key={cell.id} {...cell.getCellProps()}>
                    {cell.column.id === 'user' ? <Link to={`/user/${cell.value.id}`}>{cell.value.name}</Link> : cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const SurveyStatusView = () => {
  const navigate = useNavigate();
  const { surveyId } = useParams();
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [surveyDueDate, setSurveyDueDate] = useState('');
  const [surveyData, setSurveyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [surveyAssignments, setSurveyAssignments] = useState([]);
  const navigateToHistory = userId => {
    navigate(`/SurveyHistory/${surveyId}/${userId}`);
  };
  useEffect(() => {
    setLoading(true);

    axios
      .get(`/api/surveys/${surveyId}`)
      .then(response => {
        const surveyDataResponse = response.data;
        setSurveyTitle(surveyDataResponse.title);
        setSurveyDescription(surveyDataResponse.description);
        setSurveyDueDate(surveyDataResponse.deadline);
        setSurveyData(surveyDataResponse);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching survey data:', error);
        setLoading(false);
      });
    axios
      .get(`/api/survey-assignments?surveyId=${surveyId}`) // Replace '/api/survey-assignments' with the appropriate endpoint URL
      .then(response => {
        // Update the surveyAssignments state with the fetched data
        setSurveyAssignments(response.data);
      })
      .catch(error => {
        console.error('Error fetching survey assignment data:', error);
      });
  }, [surveyId]);

  function handleButtonClick(original: any) {}

  const columns = [
    {
      Header: 'User',
      accessor: 'user.login',
    },
    {
      Header: 'Completion Status',
      accessor: 'is_finished',
      Cell: ({ value }) => (value ? 'Finished' : 'Incomplete'),
    },
    {
      Header: 'Actions',
      id: 'actions',
      Cell({ row }) {
        // Check if the 'Completion Status' is 'Finished'
        if (row.values.is_finished) {
          return <button onClick={() => navigateToHistory(row.original.user.id)}>History</button>;
        }
        // If 'Completion Status' is not 'Finished', do not render a button
        return null;
      },
    },
  ];
  if (!surveyData) {
    return null;
  }

  return (
    <div className="survey-page">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <SurveyInfo surveyTitle={surveyTitle} surveyDueDate={surveyDueDate} surveyDescription={surveyDescription} />
          <SurveyTable columns={columns} data={surveyAssignments} />
        </>
      )}
    </div>
  );
};

export default SurveyStatusView;
