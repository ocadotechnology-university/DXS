package com.pwr.students.web.rest;

import com.pwr.students.domain.SurveyAssigment;
import com.pwr.students.repository.SurveyAssigmentRepository;
import com.pwr.students.web.rest.errors.BadRequestAlertException;
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
 * REST controller for managing {@link com.pwr.students.domain.SurveyAssigment}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SurveyAssigmentResource {

    private final Logger log = LoggerFactory.getLogger(SurveyAssigmentResource.class);

    private static final String ENTITY_NAME = "surveyAssigment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SurveyAssigmentRepository surveyAssigmentRepository;

    public SurveyAssigmentResource(SurveyAssigmentRepository surveyAssigmentRepository) {
        this.surveyAssigmentRepository = surveyAssigmentRepository;
    }

    /**
     * {@code POST  /survey-assignments} : Create a new surveyAssigment.
     *
     * @param surveyAssigment the surveyAssigment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new surveyAssigment, or with status {@code 400 (Bad Request)} if the surveyAssigment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/survey-assignments")
    public ResponseEntity<SurveyAssigment> createSurveyAssigment(@RequestBody SurveyAssigment surveyAssigment) throws URISyntaxException {
        log.debug("REST request to save SurveyAssigment : {}", surveyAssigment);
        if (surveyAssigment.getId() != null) {
            throw new BadRequestAlertException("A new surveyAssigment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SurveyAssigment result = surveyAssigmentRepository.save(surveyAssigment);
        return ResponseEntity
            .created(new URI("/api/survey-assignments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /survey-assignments/:id} : Updates an existing surveyAssigment.
     *
     * @param id the id of the surveyAssigment to save.
     * @param surveyAssigment the surveyAssigment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated surveyAssigment,
     * or with status {@code 400 (Bad Request)} if the surveyAssigment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the surveyAssigment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/survey-assignments/{id}")
    public ResponseEntity<SurveyAssigment> updateSurveyAssigment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SurveyAssigment surveyAssigment
    ) throws URISyntaxException {
        log.debug("REST request to update SurveyAssigment : {}, {}", id, surveyAssigment);
        if (surveyAssigment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, surveyAssigment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!surveyAssigmentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SurveyAssigment result = surveyAssigmentRepository.save(surveyAssigment);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, surveyAssigment.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /survey-assignments/:id} : Partial updates given fields of an existing surveyAssigment, field will ignore if it is null
     *
     * @param id the id of the surveyAssigment to save.
     * @param surveyAssigment the surveyAssigment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated surveyAssigment,
     * or with status {@code 400 (Bad Request)} if the surveyAssigment is not valid,
     * or with status {@code 404 (Not Found)} if the surveyAssigment is not found,
     * or with status {@code 500 (Internal Server Error)} if the surveyAssigment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/survey-assignments/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SurveyAssigment> partialUpdateSurveyAssigment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SurveyAssigment surveyAssigment
    ) throws URISyntaxException {
        log.debug("REST request to partial update SurveyAssigment partially : {}, {}", id, surveyAssigment);
        if (surveyAssigment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, surveyAssigment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!surveyAssigmentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SurveyAssigment> result = surveyAssigmentRepository
            .findById(surveyAssigment.getId())
            .map(existingSurveyAssigment -> {
                if (surveyAssigment.getIs_finished() != null) {
                    existingSurveyAssigment.setIs_finished(surveyAssigment.getIs_finished());
                }

                return existingSurveyAssigment;
            })
            .map(surveyAssigmentRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, surveyAssigment.getId().toString())
        );
    }

    /**
     * {@code GET  /survey-assignments} : get all the surveyAssigments.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of surveyAssigments in body.
     */
    @GetMapping("/survey-assignments")
    public List<SurveyAssigment> getAllSurveyAssigments(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all SurveyAssigments");
        if (eagerload) {
            return surveyAssigmentRepository.findAllWithEagerRelationships();
        } else {
            return surveyAssigmentRepository.findAll();
        }
    }

    /**
     * {@code GET  /survey-assignments/:id} : get the "id" surveyAssigment.
     *
     * @param id the id of the surveyAssigment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the surveyAssigment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/survey-assignments/{id}")
    public ResponseEntity<SurveyAssigment> getSurveyAssigment(@PathVariable Long id) {
        log.debug("REST request to get SurveyAssigment : {}", id);
        Optional<SurveyAssigment> surveyAssigment = surveyAssigmentRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(surveyAssigment);
    }

    /**
     * {@code DELETE  /survey-assignments/:id} : delete the "id" surveyAssigment.
     *
     * @param id the id of the surveyAssigment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/survey-assignments/{id}")
    public ResponseEntity<Void> deleteSurveyAssigment(@PathVariable Long id) {
        log.debug("REST request to delete SurveyAssigment : {}", id);
        surveyAssigmentRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
