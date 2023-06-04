import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './survey-target-groups.reducer';

export const SurveyTargetGroupsDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const surveyTargetGroupsEntity = useAppSelector(state => state.surveyTargetGroups.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="surveyTargetGroupsDetailsHeading">
          <Translate contentKey="dxsApp.surveyTargetGroups.detail.title">SurveyTargetGroups</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{surveyTargetGroupsEntity.id}</dd>
          <dt>
            <Translate contentKey="dxsApp.surveyTargetGroups.survey">Survey</Translate>
          </dt>
          <dd>{surveyTargetGroupsEntity.survey ? surveyTargetGroupsEntity.survey.id : ''}</dd>
          <dt>
            <Translate contentKey="dxsApp.surveyTargetGroups.group">Group</Translate>
          </dt>
          <dd>{surveyTargetGroupsEntity.group ? surveyTargetGroupsEntity.group.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/survey-target-groups" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/survey-target-groups/${surveyTargetGroupsEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default SurveyTargetGroupsDetail;
