package com.pwr.students.web.rest;

import com.pwr.students.domain.Question;
import com.pwr.students.domain.Survey;
import com.pwr.students.repository.QuestionRepository;
import com.pwr.students.repository.SurveyRepository;
import com.pwr.students.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.pwr.students.domain.Question}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class QuestionResource {

    private final Logger log = LoggerFactory.getLogger(QuestionResource.class);

    private static final String ENTITY_NAME = "question";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SurveyRepository surveyRepository;
    private final QuestionRepository questionRepository;

    public QuestionResource(SurveyRepository surveyRepository, QuestionRepository questionRepository) {
        this.surveyRepository = surveyRepository;
        this.questionRepository = questionRepository;
    }

    /**
     * {@code POST  /questions} : Create a new question.
     *
     * @param question the question to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new question, or with status {@code 400 (Bad Request)} if the question has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/questions")
    public ResponseEntity<Question> createQuestion(@Valid @RequestBody Question question) throws URISyntaxException {
        log.debug("REST request to save Question : {}", question);
        if (question.getId() != null) {
            throw new BadRequestAlertException("A new question cannot already have an ID", ENTITY_NAME, "idexists");
        }

        // Fetch the Survey using surveyId from question
        Optional<Survey> optionalSurvey = surveyRepository.findById(question.getSurvey().getId());
        if (!optionalSurvey.isPresent()) {
            throw new BadRequestAlertException("Invalid survey ID", ENTITY_NAME, "invalidsurveyid");
        }

        Survey survey = optionalSurvey.get();

        // Save the question first to ensure it has an ID
        question = questionRepository.save(question);

        // Add question to survey
        survey.addQuestion(question);

        // Save survey (which will cascade and save question as well)
        surveyRepository.save(survey);

        return ResponseEntity
            .created(new URI("/api/questions/" + question.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, question.getId().toString()))
            .body(question);
    }

    /**
     * {@code PUT  /questions/:id} : Updates an existing question.
     *
     * @param id the id of the question to save.
     * @param question the question to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated question,
     * or with status {@code 400 (Bad Request)} if the question is not valid,
     * or with status {@code 500 (Internal Server Error)} if the question couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/questions/{id}")
    public ResponseEntity<Question> updateQuestion(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Question question
    ) throws URISyntaxException {
        log.debug("REST request to update Question : {}, {}", id, question);
        if (question.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, question.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!questionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        // Fetch the Survey using surveyId from question
        Optional<Survey> optionalSurvey = surveyRepository.findById(question.getSurvey().getId());
        if (!optionalSurvey.isPresent()) {
            throw new BadRequestAlertException("Invalid survey ID", ENTITY_NAME, "invalidsurveyid");
        }

        Survey survey = optionalSurvey.get();

        // Add question to survey
        survey.addQuestion(question);

        // Save survey (which will cascade and save question as well)
        surveyRepository.save(survey);

        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, question.getId().toString()))
            .body(question);
    }

    /**
     * {@code PATCH  /questions/:id} : Partial updates given fields of an existing question, field will ignore if it is null
     *
     * @param id the id of the question to save.
     * @param question the question to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated question,
     * or with status {@code 400 (Bad Request)} if the question is not valid,
     * or with status {@code 404 (Not Found)} if the question is not found,
     * or with status {@code 500 (Internal Server Error)} if the question couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/questions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Question> partialUpdateQuestion(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Question question
    ) throws URISyntaxException {
        log.debug("REST request to partial update Question partially : {}, {}", id, question);
        if (question.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, question.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!questionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Question> result = questionRepository
            .findById(question.getId())
            .map(existingQuestion -> {
                if (question.getCategory() != null) {
                    existingQuestion.setCategory(question.getCategory());
                }
                if (question.getAnswerType() != null) {
                    existingQuestion.setAnswerType(question.getAnswerType());
                }
                if (question.getQuestionContent() != null) {
                    existingQuestion.setQuestionContent(question.getQuestionContent());
                }
                if (question.getIsRequired() != null) {
                    existingQuestion.setIsRequired(question.getIsRequired());
                }
                if (question.getOrder() != null) {
                    existingQuestion.setOrder(question.getOrder());
                }

                return existingQuestion;
            })
            .map(questionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, question.getId().toString())
        );
    }

    /**
     * {@code GET  /questions} : get all the questions.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of questions in body.
     */
    @GetMapping("/questions")
    public List<Question> getAllQuestions() {
        log.debug("REST request to get all Questions");
        return questionRepository.findAll();
    }

    @GetMapping("/surveys/{surveyId}/questions")
    public List<Question> getAllQuestionsFromSurvey(@PathVariable Long surveyId) {
        log.debug("REST request to get all Questions from survey {}", surveyId);
        return questionRepository.findAllBySurveyId(surveyId);
    }

    /**
     * {@code GET  /questions/:id} : get the "id" question.
     *
     * @param id the id of the question to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the question, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/questions/{id}")
    public ResponseEntity<Question> getQuestion(@PathVariable Long id) {
        log.debug("REST request to get Question : {}", id);
        Optional<Question> question = questionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(question);
    }

    /**
     * {@code DELETE  /questions/:id} : delete the "id" question.
     *
     * @param id the id of the question to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/questions/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        log.debug("REST request to delete Question: {}", id);

        Optional<Question> questionOptional = questionRepository.findById(id);

        if (questionOptional.isPresent()) {
            Question question = questionOptional.get();
            Survey survey = question.getSurvey();

            if (survey != null) {
                survey.removeQuestion(question);
            }

            questionRepository.deleteById(id);
        } else {
            // Handle the case when the question with the given ID does not exist
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
