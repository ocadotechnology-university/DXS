import React from 'react';
import './SurveyStatusView.css';
import { useTable } from 'react-table';

const SurveyStatusView = () => {
  const surveyTitle = 'Survey1';
  const surveyDescription =
    'This survey will consist of a series of questions relating to various aspects of your work experience. We encourage you to answer each question honestly and to the best of your ability.';
  const surveyDueDate = '20.06.2023';

  const Users = [
    { name: 'Jan Kowalski', status: 'Completed' },
    { name: 'Piotr Nowak', status: 'Completed' },
    { name: 'Julia Wiśniewska', status: 'Completed' },
    { name: 'Hanna Wojcik', status: 'In progress' },
    { name: 'Paweł Kowalczyk', status: 'Not started' },
    { name: 'Michał Jankowski', status: 'Not started' },
    { name: 'Aleksandra Szymańska', status: 'Not started' },
  ];

  // Table columns definition
  const columns = [
    {
      Header: 'User',
      accessor: 'name', // Key in the user object
    },
    {
      Header: 'Completion Status',
      accessor: 'status', // Key in the user object
    },
  ];

  // Initialization of react-table
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: Users, // Use placeholder as user data
  });

  return (
    <div className="survey-page">
      <div className="info-container">
        <div className="survey-info">
          <h2 className="survey-title">{surveyTitle}</h2>
          <p className="survey-due">Survey due to: {surveyDueDate}</p>
        </div>
        <hr className="divider" />
        <p className="survey-description">{surveyDescription}</p>
      </div>

      <div className="table-container">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td key={cell.id} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SurveyStatusView;
