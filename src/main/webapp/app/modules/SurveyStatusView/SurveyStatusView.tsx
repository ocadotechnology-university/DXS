import React, { useEffect, useState } from 'react';
import './SurveyStatusView.css';
import { Link, useParams } from 'react-router-dom';
import { useTable } from 'react-table';
import axios from 'axios';

const SurveyInfo = ({ surveyTitle, surveyDueDate, surveyDescription }) => {
  return (
    <div className="info-container">
      <h2 className="survey-title">{surveyTitle}</h2>
      <p className="survey-due">Survey due to: {surveyDueDate}</p>
      <hr className="divider" />
      <p className="survey-description">{surveyDescription}</p>
    </div>
  );
};

const SurveyTable = ({ columns, data }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: data.users || [],
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
                    {cell.column.id === 'name' ? <Link to="/SurveyHistory">{cell.render('Cell')}</Link> : cell.render('Cell')}
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
  const { surveyId } = useParams();
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [surveyDueDate, setSurveyDueDate] = useState('');
  const [surveyData, setSurveyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    axios
      .get(`/api/surveys/${surveyId}`)
      .then(response => {
        const surveyData = response.data;
        setSurveyTitle(surveyData.title);
        setSurveyDescription(surveyData.description);
        setSurveyDueDate(surveyData.dueDate);
        setSurveyData(surveyData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching survey data:', error);
        setLoading(false);
      });
  }, [surveyId]);

  const columns = [
    {
      Header: 'User',
      accessor: 'name',
    },
    {
      Header: 'Completion Status',
      accessor: 'status',
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
        <SurveyInfo surveyTitle={surveyTitle} surveyDueDate={surveyDueDate} surveyDescription={surveyDescription} />
      )}
      <SurveyTable columns={columns} data={surveyData} />
    </div>
  );
};

export default SurveyStatusView;
