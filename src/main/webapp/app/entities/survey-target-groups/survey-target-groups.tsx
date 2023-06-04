import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { Translate, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ASC, DESC, SORT } from 'app/shared/util/pagination.constants';
import { overrideSortStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './survey-target-groups.reducer';

export const SurveyTargetGroups = () => {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const navigate = useNavigate();

  const [sortState, setSortState] = useState(overrideSortStateWithQueryParams(getSortState(location, 'id'), location.search));

  const surveyTargetGroupsList = useAppSelector(state => state.surveyTargetGroups.entities);
  const loading = useAppSelector(state => state.surveyTargetGroups.loading);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        sort: `${sortState.sort},${sortState.order}`,
      })
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?sort=${sortState.sort},${sortState.order}`;
    if (location.search !== endURL) {
      navigate(`${location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [sortState.order, sortState.sort]);

  const sort = p => () => {
    setSortState({
      ...sortState,
      order: sortState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handleSyncList = () => {
    sortEntities();
  };

  return (
    <div>
      <h2 id="survey-target-groups-heading" data-cy="SurveyTargetGroupsHeading">
        <Translate contentKey="dxsApp.surveyTargetGroups.home.title">Survey Target Groups</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="dxsApp.surveyTargetGroups.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link
            to="/survey-target-groups/new"
            className="btn btn-primary jh-create-entity"
            id="jh-create-entity"
            data-cy="entityCreateButton"
          >
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="dxsApp.surveyTargetGroups.home.createLabel">Create new Survey Target Groups</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {surveyTargetGroupsList && surveyTargetGroupsList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="dxsApp.surveyTargetGroups.id">ID</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="dxsApp.surveyTargetGroups.survey">Survey</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="dxsApp.surveyTargetGroups.group">Group</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {surveyTargetGroupsList.map((surveyTargetGroups, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/survey-target-groups/${surveyTargetGroups.id}`} color="link" size="sm">
                      {surveyTargetGroups.id}
                    </Button>
                  </td>
                  <td>
                    {surveyTargetGroups.survey ? (
                      <Link to={`/survey/${surveyTargetGroups.survey.id}`}>{surveyTargetGroups.survey.id}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td>
                    {surveyTargetGroups.group ? (
                      <Link to={`/group/${surveyTargetGroups.group.id}`}>{surveyTargetGroups.group.id}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button
                        tag={Link}
                        to={`/survey-target-groups/${surveyTargetGroups.id}`}
                        color="info"
                        size="sm"
                        data-cy="entityDetailsButton"
                      >
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/survey-target-groups/${surveyTargetGroups.id}/edit`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/survey-target-groups/${surveyTargetGroups.id}/delete`}
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="dxsApp.surveyTargetGroups.home.notFound">No Survey Target Groups found</Translate>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SurveyTargetGroups;
