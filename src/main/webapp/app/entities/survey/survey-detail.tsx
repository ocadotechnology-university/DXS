import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import {} from 'react-jhipster';
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
        <h2 data-cy="surveyDetailsHeading">Survey</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{surveyEntity.id}</dd>
          <dt>
            <span id="name">Name</span>
          </dt>
          <dd>{surveyEntity.name}</dd>
          <dt>
            <span id="description">Description</span>
          </dt>
          <dd>{surveyEntity.description}</dd>
        </dl>
        <Button tag={Link} to="/survey" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/survey/${surveyEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default SurveyDetail;
