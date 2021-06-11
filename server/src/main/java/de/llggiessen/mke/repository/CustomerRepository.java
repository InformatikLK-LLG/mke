package de.llggiessen.mke.repository;

import de.llggiessen.mke.schema.Customer;
import org.springframework.data.repository.CrudRepository;

public interface CustomerRepository extends CrudRepository<Customer, Long> {
}
