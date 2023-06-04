package com.pwr.students.web.rest;

import com.pwr.students.domain.GroupAssigment;
import com.pwr.students.repository.GroupAssigmentRepository;
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
 * REST controller for managing {@link com.pwr.students.domain.GroupAssigment}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class GroupAssigmentResource {

    private final Logger log = LoggerFactory.getLogger(GroupAssigmentResource.class);

    private static final String ENTITY_NAME = "groupAssigment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GroupAssigmentRepository groupAssigmentRepository;

    public GroupAssigmentResource(GroupAssigmentRepository groupAssigmentRepository) {
        this.groupAssigmentRepository = groupAssigmentRepository;
    }

    /**
     * {@code POST  /group-assigments} : Create a new groupAssigment.
     *
     * @param groupAssigment the groupAssigment to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new groupAssigment, or with status {@code 400 (Bad Request)} if the groupAssigment has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/group-assigments")
    public ResponseEntity<GroupAssigment> createGroupAssigment(@RequestBody GroupAssigment groupAssigment) throws URISyntaxException {
        log.debug("REST request to save GroupAssigment : {}", groupAssigment);
        if (groupAssigment.getId() != null) {
            throw new BadRequestAlertException("A new groupAssigment cannot already have an ID", ENTITY_NAME, "idexists");
        }
        GroupAssigment result = groupAssigmentRepository.save(groupAssigment);
        return ResponseEntity
            .created(new URI("/api/group-assigments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /group-assigments/:id} : Updates an existing groupAssigment.
     *
     * @param id the id of the groupAssigment to save.
     * @param groupAssigment the groupAssigment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated groupAssigment,
     * or with status {@code 400 (Bad Request)} if the groupAssigment is not valid,
     * or with status {@code 500 (Internal Server Error)} if the groupAssigment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/group-assigments/{id}")
    public ResponseEntity<GroupAssigment> updateGroupAssigment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GroupAssigment groupAssigment
    ) throws URISyntaxException {
        log.debug("REST request to update GroupAssigment : {}, {}", id, groupAssigment);
        if (groupAssigment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, groupAssigment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!groupAssigmentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        GroupAssigment result = groupAssigmentRepository.save(groupAssigment);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, groupAssigment.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /group-assigments/:id} : Partial updates given fields of an existing groupAssigment, field will ignore if it is null
     *
     * @param id the id of the groupAssigment to save.
     * @param groupAssigment the groupAssigment to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated groupAssigment,
     * or with status {@code 400 (Bad Request)} if the groupAssigment is not valid,
     * or with status {@code 404 (Not Found)} if the groupAssigment is not found,
     * or with status {@code 500 (Internal Server Error)} if the groupAssigment couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/group-assigments/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<GroupAssigment> partialUpdateGroupAssigment(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody GroupAssigment groupAssigment
    ) throws URISyntaxException {
        log.debug("REST request to partial update GroupAssigment partially : {}, {}", id, groupAssigment);
        if (groupAssigment.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, groupAssigment.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!groupAssigmentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<GroupAssigment> result = groupAssigmentRepository
            .findById(groupAssigment.getId())
            .map(existingGroupAssigment -> {
                return existingGroupAssigment;
            })
            .map(groupAssigmentRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, groupAssigment.getId().toString())
        );
    }

    /**
     * {@code GET  /group-assigments} : get all the groupAssigments.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of groupAssigments in body.
     */
    @GetMapping("/group-assigments")
    public List<GroupAssigment> getAllGroupAssigments(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all GroupAssigments");
        if (eagerload) {
            return groupAssigmentRepository.findAllWithEagerRelationships();
        } else {
            return groupAssigmentRepository.findAll();
        }
    }

    /**
     * {@code GET  /group-assigments/:id} : get the "id" groupAssigment.
     *
     * @param id the id of the groupAssigment to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the groupAssigment, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/group-assigments/{id}")
    public ResponseEntity<GroupAssigment> getGroupAssigment(@PathVariable Long id) {
        log.debug("REST request to get GroupAssigment : {}", id);
        Optional<GroupAssigment> groupAssigment = groupAssigmentRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(groupAssigment);
    }

    /**
     * {@code DELETE  /group-assigments/:id} : delete the "id" groupAssigment.
     *
     * @param id the id of the groupAssigment to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/group-assigments/{id}")
    public ResponseEntity<Void> deleteGroupAssigment(@PathVariable Long id) {
        log.debug("REST request to delete GroupAssigment : {}", id);
        groupAssigmentRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
