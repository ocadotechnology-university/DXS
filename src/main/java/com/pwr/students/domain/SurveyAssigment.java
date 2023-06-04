package com.pwr.students.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A SurveyAssigment.
 */
@Entity
@Table(name = "survey_assigment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SurveyAssigment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "is_finished")
    private Boolean is_finished;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnoreProperties(value = { "questions", "user" }, allowSetters = true)
    private Survey survey;

    @ManyToOne(fetch = FetchType.EAGER)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SurveyAssigment id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getIs_finished() {
        return this.is_finished;
    }

    public SurveyAssigment is_finished(Boolean is_finished) {
        this.setIs_finished(is_finished);
        return this;
    }

    public void setIs_finished(Boolean is_finished) {
        this.is_finished = is_finished;
    }

    public Survey getSurvey() {
        return this.survey;
    }

    public void setSurvey(Survey survey) {
        this.survey = survey;
    }

    public SurveyAssigment survey(Survey survey) {
        this.setSurvey(survey);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public SurveyAssigment user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SurveyAssigment)) {
            return false;
        }
        return id != null && id.equals(((SurveyAssigment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SurveyAssigment{" +
            "id=" + getId() +
            ", is_finished='" + getIs_finished() + "'" +
            "}";
    }
}
