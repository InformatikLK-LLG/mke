package de.llggiessen.mke.schema;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Institution {

    @Id
    private String instCode;
    private String name;
    private String schoolType;
    private boolean svb;
    @Embedded
    private Address address;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    private class Address {
        private String street;
        private String streetNumber;
        private int zipCode;
        private String place;
    }

}
