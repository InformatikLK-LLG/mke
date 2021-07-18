package de.llggiessen.mke.schema;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Data
@EqualsAndHashCode(exclude = "dependent_list")
@NoArgsConstructor
@AllArgsConstructor
public class Institution {

    @Id
    private String id;
    private String name;
    private boolean schoolAdministrativeDistrict;
    private String phoneNumber;
    @Embedded
    private Address address;

    @OneToMany(mappedBy = "institution", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonIgnoreProperties("institution")
    private List<Customer> customers;

    public Institution(String id, String name, boolean schoolAdministrativeDistrict, String phoneNumber,
            Address address) {
        this.id = id;
        this.name = name;
        this.schoolAdministrativeDistrict = schoolAdministrativeDistrict;
        this.phoneNumber = phoneNumber;
        this.address = address;
    }

    public void addCustomer(Customer customer) {
        this.customers.add(customer);
    }

    public void removeCustomer(Customer customer) {
        this.customers.remove(customer);

    }
}
