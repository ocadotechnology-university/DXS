package com.pwr.students.repository;

import com.pwr.students.domain.GroupAssigment;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the GroupAssigment entity.
 */
@Repository
public interface GroupAssigmentRepository extends JpaRepository<GroupAssigment, Long> {
    @Query("select groupAssigment from GroupAssigment groupAssigment where groupAssigment.user.login = ?#{principal.username}")
    List<GroupAssigment> findByUserIsCurrentUser();

    default Optional<GroupAssigment> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<GroupAssigment> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<GroupAssigment> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select groupAssigment from GroupAssigment groupAssigment left join fetch groupAssigment.user",
        countQuery = "select count(groupAssigment) from GroupAssigment groupAssigment"
    )
    Page<GroupAssigment> findAllWithToOneRelationships(Pageable pageable);

    @Query("select groupAssigment from GroupAssigment groupAssigment left join fetch groupAssigment.user")
    List<GroupAssigment> findAllWithToOneRelationships();

    @Query("select groupAssigment from GroupAssigment groupAssigment left join fetch groupAssigment.user where groupAssigment.id =:id")
    Optional<GroupAssigment> findOneWithToOneRelationships(@Param("id") Long id);
}
