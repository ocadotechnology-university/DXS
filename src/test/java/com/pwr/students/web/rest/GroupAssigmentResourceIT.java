package com.pwr.students.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.pwr.students.IntegrationTest;
import com.pwr.students.domain.GroupAssigment;
import com.pwr.students.repository.GroupAssigmentRepository;
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
 * Integration tests for the {@link GroupAssigmentResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class GroupAssigmentResourceIT {

    private static final String ENTITY_API_URL = "/api/group-assigments";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GroupAssigmentRepository groupAssigmentRepository;

    @Mock
    private GroupAssigmentRepository groupAssigmentRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGroupAssigmentMockMvc;

    private GroupAssigment groupAssigment;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GroupAssigment createEntity(EntityManager em) {
        GroupAssigment groupAssigment = new GroupAssigment();
        return groupAssigment;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GroupAssigment createUpdatedEntity(EntityManager em) {
        GroupAssigment groupAssigment = new GroupAssigment();
        return groupAssigment;
    }

    @BeforeEach
    public void initTest() {
        groupAssigment = createEntity(em);
    }

    @Test
    @Transactional
    void createGroupAssigment() throws Exception {
        int databaseSizeBeforeCreate = groupAssigmentRepository.findAll().size();
        // Create the GroupAssigment
        restGroupAssigmentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(groupAssigment))
            )
            .andExpect(status().isCreated());

        // Validate the GroupAssigment in the database
        List<GroupAssigment> groupAssigmentList = groupAssigmentRepository.findAll();
        assertThat(groupAssigmentList).hasSize(databaseSizeBeforeCreate + 1);
        GroupAssigment testGroupAssigment = groupAssigmentList.get(groupAssigmentList.size() - 1);
    }

    @Test
    @Transactional
    void createGroupAssigmentWithExistingId() throws Exception {
        // Create the GroupAssigment with an existing ID
        groupAssigment.setId(1L);

        int databaseSizeBeforeCreate = groupAssigmentRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGroupAssigmentMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(groupAssigment))
            )
            .andExpect(status().isBadRequest());

        // Validate the GroupAssigment in the database
        List<GroupAssigment> groupAssigmentList = groupAssigmentRepository.findAll();
        assertThat(groupAssigmentList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllGroupAssigments() throws Exception {
        // Initialize the database
        groupAssigmentRepository.saveAndFlush(groupAssigment);

        // Get all the groupAssigmentList
        restGroupAssigmentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(groupAssigment.getId().intValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllGroupAssigmentsWithEagerRelationshipsIsEnabled() throws Exception {
        when(groupAssigmentRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restGroupAssigmentMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(groupAssigmentRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllGroupAssigmentsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(groupAssigmentRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restGroupAssigmentMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(groupAssigmentRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getGroupAssigment() throws Exception {
        // Initialize the database
        groupAssigmentRepository.saveAndFlush(groupAssigment);

        // Get the groupAssigment
        restGroupAssigmentMockMvc
            .perform(get(ENTITY_API_URL_ID, groupAssigment.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(groupAssigment.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingGroupAssigment() throws Exception {
        // Get the groupAssigment
        restGroupAssigmentMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingGroupAssigment() throws Exception {
        // Initialize the database
        groupAssigmentRepository.saveAndFlush(groupAssigment);

        int databaseSizeBeforeUpdate = groupAssigmentRepository.findAll().size();

        // Update the groupAssigment
        GroupAssigment updatedGroupAssigment = groupAssigmentRepository.findById(groupAssigment.getId()).get();
        // Disconnect from session so that the updates on updatedGroupAssigment are not directly saved in db
        em.detach(updatedGroupAssigment);

        restGroupAssigmentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGroupAssigment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGroupAssigment))
            )
            .andExpect(status().isOk());

        // Validate the GroupAssigment in the database
        List<GroupAssigment> groupAssigmentList = groupAssigmentRepository.findAll();
        assertThat(groupAssigmentList).hasSize(databaseSizeBeforeUpdate);
        GroupAssigment testGroupAssigment = groupAssigmentList.get(groupAssigmentList.size() - 1);
    }

    @Test
    @Transactional
    void putNonExistingGroupAssigment() throws Exception {
        int databaseSizeBeforeUpdate = groupAssigmentRepository.findAll().size();
        groupAssigment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGroupAssigmentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, groupAssigment.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(groupAssigment))
            )
            .andExpect(status().isBadRequest());

        // Validate the GroupAssigment in the database
        List<GroupAssigment> groupAssigmentList = groupAssigmentRepository.findAll();
        assertThat(groupAssigmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGroupAssigment() throws Exception {
        int databaseSizeBeforeUpdate = groupAssigmentRepository.findAll().size();
        groupAssigment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGroupAssigmentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(groupAssigment))
            )
            .andExpect(status().isBadRequest());

        // Validate the GroupAssigment in the database
        List<GroupAssigment> groupAssigmentList = groupAssigmentRepository.findAll();
        assertThat(groupAssigmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGroupAssigment() throws Exception {
        int databaseSizeBeforeUpdate = groupAssigmentRepository.findAll().size();
        groupAssigment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGroupAssigmentMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(groupAssigment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the GroupAssigment in the database
        List<GroupAssigment> groupAssigmentList = groupAssigmentRepository.findAll();
        assertThat(groupAssigmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGroupAssigmentWithPatch() throws Exception {
        // Initialize the database
        groupAssigmentRepository.saveAndFlush(groupAssigment);

        int databaseSizeBeforeUpdate = groupAssigmentRepository.findAll().size();

        // Update the groupAssigment using partial update
        GroupAssigment partialUpdatedGroupAssigment = new GroupAssigment();
        partialUpdatedGroupAssigment.setId(groupAssigment.getId());

        restGroupAssigmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGroupAssigment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGroupAssigment))
            )
            .andExpect(status().isOk());

        // Validate the GroupAssigment in the database
        List<GroupAssigment> groupAssigmentList = groupAssigmentRepository.findAll();
        assertThat(groupAssigmentList).hasSize(databaseSizeBeforeUpdate);
        GroupAssigment testGroupAssigment = groupAssigmentList.get(groupAssigmentList.size() - 1);
    }

    @Test
    @Transactional
    void fullUpdateGroupAssigmentWithPatch() throws Exception {
        // Initialize the database
        groupAssigmentRepository.saveAndFlush(groupAssigment);

        int databaseSizeBeforeUpdate = groupAssigmentRepository.findAll().size();

        // Update the groupAssigment using partial update
        GroupAssigment partialUpdatedGroupAssigment = new GroupAssigment();
        partialUpdatedGroupAssigment.setId(groupAssigment.getId());

        restGroupAssigmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGroupAssigment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGroupAssigment))
            )
            .andExpect(status().isOk());

        // Validate the GroupAssigment in the database
        List<GroupAssigment> groupAssigmentList = groupAssigmentRepository.findAll();
        assertThat(groupAssigmentList).hasSize(databaseSizeBeforeUpdate);
        GroupAssigment testGroupAssigment = groupAssigmentList.get(groupAssigmentList.size() - 1);
    }

    @Test
    @Transactional
    void patchNonExistingGroupAssigment() throws Exception {
        int databaseSizeBeforeUpdate = groupAssigmentRepository.findAll().size();
        groupAssigment.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGroupAssigmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, groupAssigment.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(groupAssigment))
            )
            .andExpect(status().isBadRequest());

        // Validate the GroupAssigment in the database
        List<GroupAssigment> groupAssigmentList = groupAssigmentRepository.findAll();
        assertThat(groupAssigmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGroupAssigment() throws Exception {
        int databaseSizeBeforeUpdate = groupAssigmentRepository.findAll().size();
        groupAssigment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGroupAssigmentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(groupAssigment))
            )
            .andExpect(status().isBadRequest());

        // Validate the GroupAssigment in the database
        List<GroupAssigment> groupAssigmentList = groupAssigmentRepository.findAll();
        assertThat(groupAssigmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGroupAssigment() throws Exception {
        int databaseSizeBeforeUpdate = groupAssigmentRepository.findAll().size();
        groupAssigment.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGroupAssigmentMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(groupAssigment))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the GroupAssigment in the database
        List<GroupAssigment> groupAssigmentList = groupAssigmentRepository.findAll();
        assertThat(groupAssigmentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGroupAssigment() throws Exception {
        // Initialize the database
        groupAssigmentRepository.saveAndFlush(groupAssigment);

        int databaseSizeBeforeDelete = groupAssigmentRepository.findAll().size();

        // Delete the groupAssigment
        restGroupAssigmentMockMvc
            .perform(delete(ENTITY_API_URL_ID, groupAssigment.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<GroupAssigment> groupAssigmentList = groupAssigmentRepository.findAll();
        assertThat(groupAssigmentList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
