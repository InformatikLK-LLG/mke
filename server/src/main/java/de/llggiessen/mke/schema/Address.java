package de.llggiessen.mke.schema;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Address {
    private String street;
    private String streetNumber;
    private int zipCode;
    private String place;

    public Address () {

    }
}

