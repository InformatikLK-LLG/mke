package de.llggiessen.mke.schema;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import org.springframework.data.annotation.CreatedDate;

import lombok.Data;

@Entity
@Data
public class RefreshToken {

    @Id
    @GeneratedValue
    private long id;

    @ManyToOne
    private User user;

    @Column(unique = true)
    private String token;

    @CreatedDate
    private Date issuedAt;
}
