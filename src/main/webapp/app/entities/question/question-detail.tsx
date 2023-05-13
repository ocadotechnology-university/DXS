import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
        <h2 data-cy="questionDetailsHeading">
          <Translate contentKey="dxsApp.question.detail.title">Question</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{questionEntity.id}</dd>
          <dt>
            <span id="category">
              <Translate contentKey="dxsApp.question.category">Category</Translate>
            </span>
          </dt>
          <dd>{questionEntity.category}</dd>
          <dt>
            <span id="answerType">
              <Translate contentKey="dxsApp.question.answerType">Answer Type</Translate>
            </span>
          </dt>
          <dd>{questionEntity.answerType}</dd>
          <dt>
            <span id="questionContent">
              <Translate contentKey="dxsApp.question.questionContent">Question Content</Translate>
            </span>
          </dt>
          <dd>{questionEntity.questionContent}</dd>
          <dt>
            <span id="isRequired">
              <Translate contentKey="dxsApp.question.isRequired">Is Required</Translate>
            </span>
          </dt>
          <dd>{questionEntity.isRequired ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="dxsApp.question.survey">Survey</Translate>
          </dt>
          <dd>{questionEntity.survey ? questionEntity.survey.name : ''}</dd>
        </dl>
        <Button tag={Link} to="/question" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/question/${questionEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default QuestionDetail;
