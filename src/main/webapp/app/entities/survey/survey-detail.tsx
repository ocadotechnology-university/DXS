import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './survey.reducer';

export const SurveyDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const surveyEntity = useAppSelector(state => state.survey.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="surveyDetailsHeading">
          <Translate contentKey="dxsApp.survey.detail.title">Survey</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{surveyEntity.id}</dd>
          <dt>
            <span id="name">
              <Translate contentKey="dxsApp.survey.name">Name</Translate>
            </span>
          </dt>
          <dd>{surveyEntity.name}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="dxsApp.survey.description">Description</Translate>
            </span>
          </dt>
          <dd>{surveyEntity.description}</dd>
          <dt>
            <span id="deadline">
              <Translate contentKey="dxsApp.survey.deadline">Deadline</Translate>
            </span>
          </dt>
          <dd>{surveyEntity.deadline ? <TextFormat value={surveyEntity.deadline} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="dxsApp.survey.status">Status</Translate>
            </span>
          </dt>
          <dd>{surveyEntity.status}</dd>
          <dt>
            <Translate contentKey="dxsApp.survey.user">User</Translate>
          </dt>
          <dd>
            {surveyEntity.users
              ? surveyEntity.users.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.login}</a>
                    {surveyEntity.users && i === surveyEntity.users.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
        </dl>
        <Button tag={Link} to="/survey" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/survey/${surveyEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default SurveyDetail;
