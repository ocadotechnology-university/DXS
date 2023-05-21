package com.pwr.students.repository;

import com.pwr.students.domain.Survey;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface SurveyRepositoryWithBagRelationships {
    Optional<Survey> fetchBagRelationships(Optional<Survey> survey);

    List<Survey> fetchBagRelationships(List<Survey> surveys);

    Page<Survey> fetchBagRelationships(Page<Survey> surveys);
}
