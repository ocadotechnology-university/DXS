import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './answer.reducer';

export const AnswerDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const answerEntity = useAppSelector(state => state.answer.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="answerDetailsHeading">
          <Translate contentKey="dxsApp.answer.detail.title">Answer</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{answerEntity.id}</dd>
          <dt>
            <span id="answer">
              <Translate contentKey="dxsApp.answer.answer">Answer</Translate>
            </span>
          </dt>
          <dd>{answerEntity.answer}</dd>
          <dt>
            <span id="comment">
              <Translate contentKey="dxsApp.answer.comment">Comment</Translate>
            </span>
          </dt>
          <dd>{answerEntity.comment}</dd>
          <dt>
            <span id="comment_answer">
              <Translate contentKey="dxsApp.answer.comment_answer">Comment Answer</Translate>
            </span>
          </dt>
          <dd>{answerEntity.comment_answer}</dd>
          <dt>
            <Translate contentKey="dxsApp.answer.user">User</Translate>
          </dt>
          <dd>{answerEntity.user ? answerEntity.user.login : ''}</dd>
          <dt>
            <Translate contentKey="dxsApp.answer.question">Question</Translate>
          </dt>
          <dd>{answerEntity.question ? answerEntity.question.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/answer" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/answer/${answerEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default AnswerDetail;
