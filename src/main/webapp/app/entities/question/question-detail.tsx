import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './question.reducer';

export const QuestionDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const questionEntity = useAppSelector(state => state.question.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="questionDetailsHeading">Question</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{questionEntity.id}</dd>
          <dt>
            <span id="category">Category</span>
          </dt>
          <dd>{questionEntity.category}</dd>
          <dt>
            <span id="answerType">Answer Type</span>
          </dt>
          <dd>{questionEntity.answerType}</dd>
          <dt>
            <span id="questionContent">Question Content</span>
          </dt>
          <dd>{questionEntity.questionContent}</dd>
          <dt>
            <span id="isRequired">Is Required</span>
          </dt>
          <dd>{questionEntity.isRequired ? 'true' : 'false'}</dd>
          <dt>Survey</dt>
          <dd>{questionEntity.survey ? questionEntity.survey.name : ''}</dd>
        </dl>
        <Button tag={Link} to="/question" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/question/${questionEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default QuestionDetail;
