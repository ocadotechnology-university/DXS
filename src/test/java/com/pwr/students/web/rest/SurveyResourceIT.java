package com.pwr.students.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.pwr.students.IntegrationTest;
import com.pwr.students.domain.Survey;
import com.pwr.students.repository.SurveyRepository;
import com.pwr.students.repository.SurveyStatus;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link SurveyResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class SurveyResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBBBBBBBB";

    private static final LocalDate DEFAULT_DEADLINE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DEADLINE = LocalDate.now(ZoneId.systemDefault());

    private static final SurveyStatus DEFAULT_STATUS = SurveyStatus.ACTIVE;
    private static final SurveyStatus UPDATED_STATUS = SurveyStatus.EXPIRED;

    private static final String ENTITY_API_URL = "/api/surveys";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SurveyRepository surveyRepository;

    @Mock
    private SurveyRepository surveyRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSurveyMockMvc;

    private Survey survey;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Survey createEntity(EntityManager em) {
        Survey survey = new Survey().name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION).deadline(DEFAULT_DEADLINE).status(DEFAULT_STATUS);
        return survey;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Survey createUpdatedEntity(EntityManager em) {
        Survey survey = new Survey().name(UPDATED_NAME).description(UPDATED_DESCRIPTION).deadline(UPDATED_DEADLINE).status(UPDATED_STATUS);
        return survey;
    }

    @BeforeEach
    public void initTest() {
        survey = createEntity(em);
    }

    @Test
    @Transactional
    void createSurvey() throws Exception {
        int databaseSizeBeforeCreate = surveyRepository.findAll().size();
        // Create the Survey
        restSurveyMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(survey))
            )
            .andExpect(status().isCreated());

        // Validate the Survey in the database
        List<Survey> surveyList = surveyRepository.findAll();
        assertThat(surveyList).hasSize(databaseSizeBeforeCreate + 1);
        Survey testSurvey = surveyList.get(surveyList.size() - 1);
        assertThat(testSurvey.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSurvey.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testSurvey.getDeadline()).isEqualTo(DEFAULT_DEADLINE);
        assertThat(testSurvey.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createSurveyWithExistingId() throws Exception {
        // Create the Survey with an existing ID
        survey.setId(1L);

        int databaseSizeBeforeCreate = surveyRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSurveyMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(survey))
            )
            .andExpect(status().isBadRequest());

        // Validate the Survey in the database
        List<Survey> surveyList = surveyRepository.findAll();
        assertThat(surveyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = surveyRepository.findAll().size();
        // set the field null
        survey.setName(null);

        // Create the Survey, which fails.

        restSurveyMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(survey))
            )
            .andExpect(status().isBadRequest());

        List<Survey> surveyList = surveyRepository.findAll();
        assertThat(surveyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = surveyRepository.findAll().size();
        // set the field null
        survey.setDescription(null);

        // Create the Survey, which fails.

        restSurveyMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(survey))
            )
            .andExpect(status().isBadRequest());

        List<Survey> surveyList = surveyRepository.findAll();
        assertThat(surveyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSurveys() throws Exception {
        // Initialize the database
        surveyRepository.saveAndFlush(survey);

        // Get all the surveyList
        restSurveyMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(survey.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].deadline").value(hasItem(DEFAULT_DEADLINE.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllSurveysWithEagerRelationshipsIsEnabled() throws Exception {
        when(surveyRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restSurveyMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(surveyRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllSurveysWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(surveyRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restSurveyMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(surveyRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getSurvey() throws Exception {
        // Initialize the database
        surveyRepository.saveAndFlush(survey);

        // Get the survey
        restSurveyMockMvc
            .perform(get(ENTITY_API_URL_ID, survey.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(survey.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.deadline").value(DEFAULT_DEADLINE.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS));
    }

    @Test
    @Transactional
    void getNonExistingSurvey() throws Exception {
        // Get the survey
        restSurveyMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSurvey() throws Exception {
        // Initialize the database
        surveyRepository.saveAndFlush(survey);

        int databaseSizeBeforeUpdate = surveyRepository.findAll().size();

        // Update the survey
        Survey updatedSurvey = surveyRepository.findById(survey.getId()).get();
        // Disconnect from session so that the updates on updatedSurvey are not directly saved in db
        em.detach(updatedSurvey);
        updatedSurvey.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).deadline(UPDATED_DEADLINE).status(UPDATED_STATUS);

        restSurveyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSurvey.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSurvey))
            )
            .andExpect(status().isOk());

        // Validate the Survey in the database
        List<Survey> surveyList = surveyRepository.findAll();
        assertThat(surveyList).hasSize(databaseSizeBeforeUpdate);
        Survey testSurvey = surveyList.get(surveyList.size() - 1);
        assertThat(testSurvey.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSurvey.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSurvey.getDeadline()).isEqualTo(UPDATED_DEADLINE);
        assertThat(testSurvey.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingSurvey() throws Exception {
        int databaseSizeBeforeUpdate = surveyRepository.findAll().size();
        survey.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSurveyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, survey.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(survey))
            )
            .andExpect(status().isBadRequest());

        // Validate the Survey in the database
        List<Survey> surveyList = surveyRepository.findAll();
        assertThat(surveyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSurvey() throws Exception {
        int databaseSizeBeforeUpdate = surveyRepository.findAll().size();
        survey.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSurveyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(survey))
            )
            .andExpect(status().isBadRequest());

        // Validate the Survey in the database
        List<Survey> surveyList = surveyRepository.findAll();
        assertThat(surveyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSurvey() throws Exception {
        int databaseSizeBeforeUpdate = surveyRepository.findAll().size();
        survey.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSurveyMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(survey))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Survey in the database
        List<Survey> surveyList = surveyRepository.findAll();
        assertThat(surveyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSurveyWithPatch() throws Exception {
        // Initialize the database
        surveyRepository.saveAndFlush(survey);

        int databaseSizeBeforeUpdate = surveyRepository.findAll().size();

        // Update the survey using partial update
        Survey partialUpdatedSurvey = new Survey();
        partialUpdatedSurvey.setId(survey.getId());

        partialUpdatedSurvey.description(UPDATED_DESCRIPTION);

        restSurveyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSurvey.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSurvey))
            )
            .andExpect(status().isOk());

        // Validate the Survey in the database
        List<Survey> surveyList = surveyRepository.findAll();
        assertThat(surveyList).hasSize(databaseSizeBeforeUpdate);
        Survey testSurvey = surveyList.get(surveyList.size() - 1);
        assertThat(testSurvey.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSurvey.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSurvey.getDeadline()).isEqualTo(DEFAULT_DEADLINE);
        assertThat(testSurvey.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateSurveyWithPatch() throws Exception {
        // Initialize the database
        surveyRepository.saveAndFlush(survey);

        int databaseSizeBeforeUpdate = surveyRepository.findAll().size();

        // Update the survey using partial update
        Survey partialUpdatedSurvey = new Survey();
        partialUpdatedSurvey.setId(survey.getId());

        partialUpdatedSurvey.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).deadline(UPDATED_DEADLINE).status(UPDATED_STATUS);

        restSurveyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSurvey.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSurvey))
            )
            .andExpect(status().isOk());

        // Validate the Survey in the database
        List<Survey> surveyList = surveyRepository.findAll();
        assertThat(surveyList).hasSize(databaseSizeBeforeUpdate);
        Survey testSurvey = surveyList.get(surveyList.size() - 1);
        assertThat(testSurvey.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSurvey.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSurvey.getDeadline()).isEqualTo(UPDATED_DEADLINE);
        assertThat(testSurvey.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingSurvey() throws Exception {
        int databaseSizeBeforeUpdate = surveyRepository.findAll().size();
        survey.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSurveyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, survey.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(survey))
            )
            .andExpect(status().isBadRequest());

        // Validate the Survey in the database
        List<Survey> surveyList = surveyRepository.findAll();
        assertThat(surveyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSurvey() throws Exception {
        int databaseSizeBeforeUpdate = surveyRepository.findAll().size();
        survey.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSurveyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(survey))
            )
            .andExpect(status().isBadRequest());

        // Validate the Survey in the database
        List<Survey> surveyList = surveyRepository.findAll();
        assertThat(surveyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSurvey() throws Exception {
        int databaseSizeBeforeUpdate = surveyRepository.findAll().size();
        survey.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSurveyMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(survey))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Survey in the database
        List<Survey> surveyList = surveyRepository.findAll();
        assertThat(surveyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSurvey() throws Exception {
        // Initialize the database
        surveyRepository.saveAndFlush(survey);

        int databaseSizeBeforeDelete = surveyRepository.findAll().size();

        // Delete the survey
        restSurveyMockMvc
            .perform(delete(ENTITY_API_URL_ID, survey.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Survey> surveyList = surveyRepository.findAll();
        assertThat(surveyList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
