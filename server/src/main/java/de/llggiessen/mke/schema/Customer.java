package de.llggiessen.mke.schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Customer {

    @Id
    @GeneratedValue
    private Long customerId;
    private String firstName;
    private String lastName;
    @Column(unique = true)
    private String email;
    private String mobilePhone;
    private String businessPhone;

}
