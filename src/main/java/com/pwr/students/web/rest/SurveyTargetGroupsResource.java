package com.pwr.students.web.rest;

import com.pwr.students.domain.SurveyTargetGroups;
import com.pwr.students.repository.SurveyTargetGroupsRepository;
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
 * REST controller for managing {@link com.pwr.students.domain.SurveyTargetGroups}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SurveyTargetGroupsResource {

    private final Logger log = LoggerFactory.getLogger(SurveyTargetGroupsResource.class);

    private static final String ENTITY_NAME = "surveyTargetGroups";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SurveyTargetGroupsRepository surveyTargetGroupsRepository;

    public SurveyTargetGroupsResource(SurveyTargetGroupsRepository surveyTargetGroupsRepository) {
        this.surveyTargetGroupsRepository = surveyTargetGroupsRepository;
    }

    /**
     * {@code POST  /survey-target-groups} : Create a new surveyTargetGroups.
     *
     * @param surveyTargetGroups the surveyTargetGroups to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new surveyTargetGroups, or with status {@code 400 (Bad Request)} if the surveyTargetGroups has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/survey-target-groups")
    public ResponseEntity<SurveyTargetGroups> createSurveyTargetGroups(@RequestBody SurveyTargetGroups surveyTargetGroups)
        throws URISyntaxException {
        log.debug("REST request to save SurveyTargetGroups : {}", surveyTargetGroups);
        if (surveyTargetGroups.getId() != null) {
            throw new BadRequestAlertException("A new surveyTargetGroups cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SurveyTargetGroups result = surveyTargetGroupsRepository.save(surveyTargetGroups);
        return ResponseEntity
            .created(new URI("/api/survey-target-groups/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /survey-target-groups/:id} : Updates an existing surveyTargetGroups.
     *
     * @param id the id of the surveyTargetGroups to save.
     * @param surveyTargetGroups the surveyTargetGroups to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated surveyTargetGroups,
     * or with status {@code 400 (Bad Request)} if the surveyTargetGroups is not valid,
     * or with status {@code 500 (Internal Server Error)} if the surveyTargetGroups couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/survey-target-groups/{id}")
    public ResponseEntity<SurveyTargetGroups> updateSurveyTargetGroups(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SurveyTargetGroups surveyTargetGroups
    ) throws URISyntaxException {
        log.debug("REST request to update SurveyTargetGroups : {}, {}", id, surveyTargetGroups);
        if (surveyTargetGroups.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, surveyTargetGroups.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!surveyTargetGroupsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SurveyTargetGroups result = surveyTargetGroupsRepository.save(surveyTargetGroups);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, surveyTargetGroups.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /survey-target-groups/:id} : Partial updates given fields of an existing surveyTargetGroups, field will ignore if it is null
     *
     * @param id the id of the surveyTargetGroups to save.
     * @param surveyTargetGroups the surveyTargetGroups to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated surveyTargetGroups,
     * or with status {@code 400 (Bad Request)} if the surveyTargetGroups is not valid,
     * or with status {@code 404 (Not Found)} if the surveyTargetGroups is not found,
     * or with status {@code 500 (Internal Server Error)} if the surveyTargetGroups couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/survey-target-groups/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SurveyTargetGroups> partialUpdateSurveyTargetGroups(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SurveyTargetGroups surveyTargetGroups
    ) throws URISyntaxException {
        log.debug("REST request to partial update SurveyTargetGroups partially : {}, {}", id, surveyTargetGroups);
        if (surveyTargetGroups.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, surveyTargetGroups.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!surveyTargetGroupsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SurveyTargetGroups> result = surveyTargetGroupsRepository
            .findById(surveyTargetGroups.getId())
            .map(existingSurveyTargetGroups -> {
                return existingSurveyTargetGroups;
            })
            .map(surveyTargetGroupsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, surveyTargetGroups.getId().toString())
        );
    }

    /**
     * {@code GET  /survey-target-groups} : get all the surveyTargetGroups.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of surveyTargetGroups in body.
     */
    @GetMapping("/survey-target-groups")
    public List<SurveyTargetGroups> getAllSurveyTargetGroups() {
        log.debug("REST request to get all SurveyTargetGroups");
        return surveyTargetGroupsRepository.findAll();
    }

    /**
     * {@code GET  /survey-target-groups/:id} : get the "id" surveyTargetGroups.
     *
     * @param id the id of the surveyTargetGroups to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the surveyTargetGroups, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/survey-target-groups/{id}")
    public ResponseEntity<SurveyTargetGroups> getSurveyTargetGroups(@PathVariable Long id) {
        log.debug("REST request to get SurveyTargetGroups : {}", id);
        Optional<SurveyTargetGroups> surveyTargetGroups = surveyTargetGroupsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(surveyTargetGroups);
    }

    /**
     * {@code DELETE  /survey-target-groups/:id} : delete the "id" surveyTargetGroups.
     *
     * @param id the id of the surveyTargetGroups to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/survey-target-groups/{id}")
    public ResponseEntity<Void> deleteSurveyTargetGroups(@PathVariable Long id) {
        log.debug("REST request to delete SurveyTargetGroups : {}", id);
        surveyTargetGroupsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
