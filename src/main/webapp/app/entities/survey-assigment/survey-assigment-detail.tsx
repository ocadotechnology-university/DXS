import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './survey-assigment.reducer';

export const SurveyAssigmentDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const surveyAssigmentEntity = useAppSelector(state => state.surveyAssigment.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="surveyAssigmentDetailsHeading">
          <Translate contentKey="dxsApp.surveyAssigment.detail.title">SurveyAssigment</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{surveyAssigmentEntity.id}</dd>
          <dt>
            <span id="is_finished">
              <Translate contentKey="dxsApp.surveyAssigment.is_finished">Is Finished</Translate>
            </span>
          </dt>
          <dd>{surveyAssigmentEntity.is_finished ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="dxsApp.surveyAssigment.survey">Survey</Translate>
          </dt>
          <dd>{surveyAssigmentEntity.survey ? surveyAssigmentEntity.survey.id : ''}</dd>
          <dt>
            <Translate contentKey="dxsApp.surveyAssigment.user">User</Translate>
          </dt>
          <dd>{surveyAssigmentEntity.user ? surveyAssigmentEntity.user.login : ''}</dd>
        </dl>
        <Button tag={Link} to="/survey-assigment" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/survey-assigment/${surveyAssigmentEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default SurveyAssigmentDetail;
