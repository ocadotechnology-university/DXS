package com.pwr.students.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.pwr.students.IntegrationTest;
import com.pwr.students.domain.SurveyTargetGroups;
import com.pwr.students.repository.SurveyTargetGroupsRepository;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SurveyTargetGroupsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SurveyTargetGroupsResourceIT {

    private static final String ENTITY_API_URL = "/api/survey-target-groups";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SurveyTargetGroupsRepository surveyTargetGroupsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSurveyTargetGroupsMockMvc;

    private SurveyTargetGroups surveyTargetGroups;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SurveyTargetGroups createEntity(EntityManager em) {
        SurveyTargetGroups surveyTargetGroups = new SurveyTargetGroups();
        return surveyTargetGroups;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SurveyTargetGroups createUpdatedEntity(EntityManager em) {
        SurveyTargetGroups surveyTargetGroups = new SurveyTargetGroups();
        return surveyTargetGroups;
    }

    @BeforeEach
    public void initTest() {
        surveyTargetGroups = createEntity(em);
    }

    @Test
    @Transactional
    void createSurveyTargetGroups() throws Exception {
        int databaseSizeBeforeCreate = surveyTargetGroupsRepository.findAll().size();
        // Create the SurveyTargetGroups
        restSurveyTargetGroupsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(surveyTargetGroups))
            )
            .andExpect(status().isCreated());

        // Validate the SurveyTargetGroups in the database
        List<SurveyTargetGroups> surveyTargetGroupsList = surveyTargetGroupsRepository.findAll();
        assertThat(surveyTargetGroupsList).hasSize(databaseSizeBeforeCreate + 1);
        SurveyTargetGroups testSurveyTargetGroups = surveyTargetGroupsList.get(surveyTargetGroupsList.size() - 1);
    }

    @Test
    @Transactional
    void createSurveyTargetGroupsWithExistingId() throws Exception {
        // Create the SurveyTargetGroups with an existing ID
        surveyTargetGroups.setId(1L);

        int databaseSizeBeforeCreate = surveyTargetGroupsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSurveyTargetGroupsMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(surveyTargetGroups))
            )
            .andExpect(status().isBadRequest());

        // Validate the SurveyTargetGroups in the database
        List<SurveyTargetGroups> surveyTargetGroupsList = surveyTargetGroupsRepository.findAll();
        assertThat(surveyTargetGroupsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSurveyTargetGroups() throws Exception {
        // Initialize the database
        surveyTargetGroupsRepository.saveAndFlush(surveyTargetGroups);

        // Get all the surveyTargetGroupsList
        restSurveyTargetGroupsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(surveyTargetGroups.getId().intValue())));
    }

    @Test
    @Transactional
    void getSurveyTargetGroups() throws Exception {
        // Initialize the database
        surveyTargetGroupsRepository.saveAndFlush(surveyTargetGroups);

        // Get the surveyTargetGroups
        restSurveyTargetGroupsMockMvc
            .perform(get(ENTITY_API_URL_ID, surveyTargetGroups.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(surveyTargetGroups.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingSurveyTargetGroups() throws Exception {
        // Get the surveyTargetGroups
        restSurveyTargetGroupsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSurveyTargetGroups() throws Exception {
        // Initialize the database
        surveyTargetGroupsRepository.saveAndFlush(surveyTargetGroups);

        int databaseSizeBeforeUpdate = surveyTargetGroupsRepository.findAll().size();

        // Update the surveyTargetGroups
        SurveyTargetGroups updatedSurveyTargetGroups = surveyTargetGroupsRepository.findById(surveyTargetGroups.getId()).get();
        // Disconnect from session so that the updates on updatedSurveyTargetGroups are not directly saved in db
        em.detach(updatedSurveyTargetGroups);

        restSurveyTargetGroupsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSurveyTargetGroups.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSurveyTargetGroups))
            )
            .andExpect(status().isOk());

        // Validate the SurveyTargetGroups in the database
        List<SurveyTargetGroups> surveyTargetGroupsList = surveyTargetGroupsRepository.findAll();
        assertThat(surveyTargetGroupsList).hasSize(databaseSizeBeforeUpdate);
        SurveyTargetGroups testSurveyTargetGroups = surveyTargetGroupsList.get(surveyTargetGroupsList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingSurveyTargetGroups() throws Exception {
        int databaseSizeBeforeUpdate = surveyTargetGroupsRepository.findAll().size();
        surveyTargetGroups.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSurveyTargetGroupsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, surveyTargetGroups.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(surveyTargetGroups))
            )
            .andExpect(status().isBadRequest());

        // Validate the SurveyTargetGroups in the database
        List<SurveyTargetGroups> surveyTargetGroupsList = surveyTargetGroupsRepository.findAll();
        assertThat(surveyTargetGroupsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSurveyTargetGroups() throws Exception {
        int databaseSizeBeforeUpdate = surveyTargetGroupsRepository.findAll().size();
        surveyTargetGroups.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSurveyTargetGroupsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(surveyTargetGroups))
            )
            .andExpect(status().isBadRequest());

        // Validate the SurveyTargetGroups in the database
        List<SurveyTargetGroups> surveyTargetGroupsList = surveyTargetGroupsRepository.findAll();
        assertThat(surveyTargetGroupsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSurveyTargetGroups() throws Exception {
        int databaseSizeBeforeUpdate = surveyTargetGroupsRepository.findAll().size();
        surveyTargetGroups.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSurveyTargetGroupsMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(surveyTargetGroups))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SurveyTargetGroups in the database
        List<SurveyTargetGroups> surveyTargetGroupsList = surveyTargetGroupsRepository.findAll();
        assertThat(surveyTargetGroupsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSurveyTargetGroupsWithPatch() throws Exception {
        // Initialize the database
        surveyTargetGroupsRepository.saveAndFlush(surveyTargetGroups);

        int databaseSizeBeforeUpdate = surveyTargetGroupsRepository.findAll().size();

        // Update the surveyTargetGroups using partial update
        SurveyTargetGroups partialUpdatedSurveyTargetGroups = new SurveyTargetGroups();
        partialUpdatedSurveyTargetGroups.setId(surveyTargetGroups.getId());

        restSurveyTargetGroupsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSurveyTargetGroups.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSurveyTargetGroups))
            )
            .andExpect(status().isOk());

        // Validate the SurveyTargetGroups in the database
        List<SurveyTargetGroups> surveyTargetGroupsList = surveyTargetGroupsRepository.findAll();
        assertThat(surveyTargetGroupsList).hasSize(databaseSizeBeforeUpdate);
        SurveyTargetGroups testSurveyTargetGroups = surveyTargetGroupsList.get(surveyTargetGroupsList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateSurveyTargetGroupsWithPatch() throws Exception {
        // Initialize the database
        surveyTargetGroupsRepository.saveAndFlush(surveyTargetGroups);

        int databaseSizeBeforeUpdate = surveyTargetGroupsRepository.findAll().size();

        // Update the surveyTargetGroups using partial update
        SurveyTargetGroups partialUpdatedSurveyTargetGroups = new SurveyTargetGroups();
        partialUpdatedSurveyTargetGroups.setId(surveyTargetGroups.getId());

        restSurveyTargetGroupsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSurveyTargetGroups.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSurveyTargetGroups))
            )
            .andExpect(status().isOk());

        // Validate the SurveyTargetGroups in the database
        List<SurveyTargetGroups> surveyTargetGroupsList = surveyTargetGroupsRepository.findAll();
        assertThat(surveyTargetGroupsList).hasSize(databaseSizeBeforeUpdate);
        SurveyTargetGroups testSurveyTargetGroups = surveyTargetGroupsList.get(surveyTargetGroupsList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingSurveyTargetGroups() throws Exception {
        int databaseSizeBeforeUpdate = surveyTargetGroupsRepository.findAll().size();
        surveyTargetGroups.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSurveyTargetGroupsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, surveyTargetGroups.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(surveyTargetGroups))
            )
            .andExpect(status().isBadRequest());

        // Validate the SurveyTargetGroups in the database
        List<SurveyTargetGroups> surveyTargetGroupsList = surveyTargetGroupsRepository.findAll();
        assertThat(surveyTargetGroupsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSurveyTargetGroups() throws Exception {
        int databaseSizeBeforeUpdate = surveyTargetGroupsRepository.findAll().size();
        surveyTargetGroups.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSurveyTargetGroupsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(surveyTargetGroups))
            )
            .andExpect(status().isBadRequest());

        // Validate the SurveyTargetGroups in the database
        List<SurveyTargetGroups> surveyTargetGroupsList = surveyTargetGroupsRepository.findAll();
        assertThat(surveyTargetGroupsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSurveyTargetGroups() throws Exception {
        int databaseSizeBeforeUpdate = surveyTargetGroupsRepository.findAll().size();
        surveyTargetGroups.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSurveyTargetGroupsMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(surveyTargetGroups))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SurveyTargetGroups in the database
        List<SurveyTargetGroups> surveyTargetGroupsList = surveyTargetGroupsRepository.findAll();
        assertThat(surveyTargetGroupsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSurveyTargetGroups() throws Exception {
        // Initialize the database
        surveyTargetGroupsRepository.saveAndFlush(surveyTargetGroups);

        int databaseSizeBeforeDelete = surveyTargetGroupsRepository.findAll().size();

        // Delete the surveyTargetGroups
        restSurveyTargetGroupsMockMvc
            .perform(delete(ENTITY_API_URL_ID, surveyTargetGroups.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SurveyTargetGroups> surveyTargetGroupsList = surveyTargetGroupsRepository.findAll();
        assertThat(surveyTargetGroupsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
