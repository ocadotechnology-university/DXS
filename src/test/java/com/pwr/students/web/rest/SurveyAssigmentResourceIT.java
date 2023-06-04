package com.pwr.students.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.pwr.students.IntegrationTest;
import com.pwr.students.domain.SurveyAssigment;
import com.pwr.students.repository.SurveyAssigmentRepository;
import jakarta.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SurveyAssigmentResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class SurveyAssigmentResourceIT {

    private static final Boolean DEFAULT_IS_FINISHED = false;
    private static final Boolean UPDATED_IS_FINISHED = true;

    private static final String ENTITY_API_URL = "/api/survey-assignments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SurveyAssigmentRepository surveyAssigmentRepository;

    @Mock
    private SurveyAssigmentRepository surveyAssigmentRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSurveyAssigmentMockMvc;

    private SurveyAssigment surveyAssigment;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SurveyAssigment createEntity(EntityManager em) {
        SurveyAssigment surveyAssigment = new SurveyAssigment().is_finished(DEFAULT_IS_FINISHED);
        return surveyAssigment;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SurveyAssigment createUpdatedEntity(EntityManager em) {
        SurveyAssigment surveyAssigment = new SurveyAssigment().is_finished(UPDATED_IS_FINISHED);
        return surveyAssigment;
    }

    @BeforeEach
    public void initTest() {
        surveyAssigment = createEntity(em);
    }

    @Test
    @Transactional
    void createSurveyAssigment() throws Exception {
        int databaseSizeBeforeCreate = surveyAssigmentRepository.findAll().size();
        // Create the SurveyAssigment
        restSurveyAssigmentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(surveyAssigment))
            )
            .andExpect(status().isCreated());

        // Validate the SurveyAssigment in the database
        List<SurveyAssigment> surveyAssigmentList = surveyAssigmentRepository.findAll();
        assertThat(surveyAssigmentList).hasSize(databaseSizeBeforeCreate + 1);
        SurveyAssigment testSurveyAssigment = surveyAssigmentList.get(surveyAssigmentList.size() - 1);
        assertThat(testSurveyAssigment.getIs_finished()).isEqualTo(DEFAULT_IS_FINISHED);
    }

    @Test
    @Transactional
    void createSurveyAssigmentWithExistingId() throws Exception {
        // Create the SurveyAssigment with an existing ID
        surveyAssigment.setId(1L);

        int databaseSizeBeforeCreate = surveyAssigmentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSurveyAssigmentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(surveyAssigment))
            )
            .andExpect(status().isBadRequest());

        // Validate the SurveyAssigment in the database
        List<SurveyAssigment> surveyAssigmentList = surveyAssigmentRepository.findAll();
        assertThat(surveyAssigmentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSurveyAssigments() throws Exception {
        // Initialize the database
        surveyAssigmentRepository.saveAndFlush(surveyAssigment);

        // Get all the surveyAssigmentList
        restSurveyAssigmentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(surveyAssigment.getId().intValue())))
            .andExpect(jsonPath("$.[*].is_finished").value(hasItem(DEFAULT_IS_FINISHED.booleanValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllSurveyAssigmentsWithEagerRelationshipsIsEnabled() throws Exception {
        when(surveyAssigmentRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restSurveyAssigmentMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(surveyAssigmentRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllSurveyAssigmentsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(surveyAssigmentRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restSurveyAssigmentMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(surveyAssigmentRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getSurveyAssigment() throws Exception {
        // Initialize the database
        surveyAssigmentRepository.saveAndFlush(surveyAssigment);

        // Get the surveyAssigment
        restSurveyAssigmentMockMvc
            .perform(get(ENTITY_API_URL_ID, surveyAssigment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(surveyAssigment.getId().intValue()))
            .andExpect(jsonPath("$.is_finished").value(DEFAULT_IS_FINISHED.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingSurveyAssigment() throws Exception {
        // Get the surveyAssigment
        restSurveyAssigmentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSurveyAssigment() throws Exception {
        // Initialize the database
        surveyAssigmentRepository.saveAndFlush(surveyAssigment);

        int databaseSizeBeforeUpdate = surveyAssigmentRepository.findAll().size();

        // Update the surveyAssigment
        SurveyAssigment updatedSurveyAssigment = surveyAssigmentRepository.findById(surveyAssigment.getId()).get();
        // Disconnect from session so that the updates on updatedSurveyAssigment are not directly saved in db
        em.detach(updatedSurveyAssigment);
        updatedSurveyAssigment.is_finished(UPDATED_IS_FINISHED);

        restSurveyAssigmentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSurveyAssigment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSurveyAssigment))
            )
            .andExpect(status().isOk());

        // Validate the SurveyAssigment in the database
        List<SurveyAssigment> surveyAssigmentList = surveyAssigmentRepository.findAll();
        assertThat(surveyAssigmentList).hasSize(databaseSizeBeforeUpdate);
        SurveyAssigment testSurveyAssigment = surveyAssigmentList.get(surveyAssigmentList.size() - 1);
        assertThat(testSurveyAssigment.getIs_finished()).isEqualTo(UPDATED_IS_FINISHED);
    }

    @Test
    @Transactional
    void putNonExistingSurveyAssigment() throws Exception {
        int databaseSizeBeforeUpdate = surveyAssigmentRepository.findAll().size();
        surveyAssigment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSurveyAssigmentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, surveyAssigment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(surveyAssigment))
            )
            .andExpect(status().isBadRequest());

        // Validate the SurveyAssigment in the database
        List<SurveyAssigment> surveyAssigmentList = surveyAssigmentRepository.findAll();
        assertThat(surveyAssigmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSurveyAssigment() throws Exception {
        int databaseSizeBeforeUpdate = surveyAssigmentRepository.findAll().size();
        surveyAssigment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSurveyAssigmentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(surveyAssigment))
            )
            .andExpect(status().isBadRequest());

        // Validate the SurveyAssigment in the database
        List<SurveyAssigment> surveyAssigmentList = surveyAssigmentRepository.findAll();
        assertThat(surveyAssigmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSurveyAssigment() throws Exception {
        int databaseSizeBeforeUpdate = surveyAssigmentRepository.findAll().size();
        surveyAssigment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSurveyAssigmentMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(surveyAssigment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SurveyAssigment in the database
        List<SurveyAssigment> surveyAssigmentList = surveyAssigmentRepository.findAll();
        assertThat(surveyAssigmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSurveyAssigmentWithPatch() throws Exception {
        // Initialize the database
        surveyAssigmentRepository.saveAndFlush(surveyAssigment);

        int databaseSizeBeforeUpdate = surveyAssigmentRepository.findAll().size();

        // Update the surveyAssigment using partial update
        SurveyAssigment partialUpdatedSurveyAssigment = new SurveyAssigment();
        partialUpdatedSurveyAssigment.setId(surveyAssigment.getId());

        partialUpdatedSurveyAssigment.is_finished(UPDATED_IS_FINISHED);

        restSurveyAssigmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSurveyAssigment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSurveyAssigment))
            )
            .andExpect(status().isOk());

        // Validate the SurveyAssigment in the database
        List<SurveyAssigment> surveyAssigmentList = surveyAssigmentRepository.findAll();
        assertThat(surveyAssigmentList).hasSize(databaseSizeBeforeUpdate);
        SurveyAssigment testSurveyAssigment = surveyAssigmentList.get(surveyAssigmentList.size() - 1);
        assertThat(testSurveyAssigment.getIs_finished()).isEqualTo(UPDATED_IS_FINISHED);
    }

    @Test
    @Transactional
    void fullUpdateSurveyAssigmentWithPatch() throws Exception {
        // Initialize the database
        surveyAssigmentRepository.saveAndFlush(surveyAssigment);

        int databaseSizeBeforeUpdate = surveyAssigmentRepository.findAll().size();

        // Update the surveyAssigment using partial update
        SurveyAssigment partialUpdatedSurveyAssigment = new SurveyAssigment();
        partialUpdatedSurveyAssigment.setId(surveyAssigment.getId());

        partialUpdatedSurveyAssigment.is_finished(UPDATED_IS_FINISHED);

        restSurveyAssigmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSurveyAssigment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSurveyAssigment))
            )
            .andExpect(status().isOk());

        // Validate the SurveyAssigment in the database
        List<SurveyAssigment> surveyAssigmentList = surveyAssigmentRepository.findAll();
        assertThat(surveyAssigmentList).hasSize(databaseSizeBeforeUpdate);
        SurveyAssigment testSurveyAssigment = surveyAssigmentList.get(surveyAssigmentList.size() - 1);
        assertThat(testSurveyAssigment.getIs_finished()).isEqualTo(UPDATED_IS_FINISHED);
    }

    @Test
    @Transactional
    void patchNonExistingSurveyAssigment() throws Exception {
        int databaseSizeBeforeUpdate = surveyAssigmentRepository.findAll().size();
        surveyAssigment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSurveyAssigmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, surveyAssigment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(surveyAssigment))
            )
            .andExpect(status().isBadRequest());

        // Validate the SurveyAssigment in the database
        List<SurveyAssigment> surveyAssigmentList = surveyAssigmentRepository.findAll();
        assertThat(surveyAssigmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSurveyAssigment() throws Exception {
        int databaseSizeBeforeUpdate = surveyAssigmentRepository.findAll().size();
        surveyAssigment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSurveyAssigmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(surveyAssigment))
            )
            .andExpect(status().isBadRequest());

        // Validate the SurveyAssigment in the database
        List<SurveyAssigment> surveyAssigmentList = surveyAssigmentRepository.findAll();
        assertThat(surveyAssigmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSurveyAssigment() throws Exception {
        int databaseSizeBeforeUpdate = surveyAssigmentRepository.findAll().size();
        surveyAssigment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSurveyAssigmentMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(surveyAssigment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SurveyAssigment in the database
        List<SurveyAssigment> surveyAssigmentList = surveyAssigmentRepository.findAll();
        assertThat(surveyAssigmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSurveyAssigment() throws Exception {
        // Initialize the database
        surveyAssigmentRepository.saveAndFlush(surveyAssigment);

        int databaseSizeBeforeDelete = surveyAssigmentRepository.findAll().size();

        // Delete the surveyAssigment
        restSurveyAssigmentMockMvc
            .perform(delete(ENTITY_API_URL_ID, surveyAssigment.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SurveyAssigment> surveyAssigmentList = surveyAssigmentRepository.findAll();
        assertThat(surveyAssigmentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
