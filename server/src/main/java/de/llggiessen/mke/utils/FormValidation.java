package de.llggiessen.mke.utils;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import de.llggiessen.mke.schema.Customer;
import de.llggiessen.mke.schema.Institution;
import de.llggiessen.mke.schema.User;

public class FormValidation {

    public static boolean validateEmail(String email) {
        return email.matches("^\\w+([.+-]\\w+)*@(\\w*[.+-]*)+\\.\\w+$");
    }

    public static boolean validatePassword(String password) {
        return password.matches(
                "^(?=.*[a-zäöüß])(?=.*[A-ZÄÖÜ])(?=.*\\d)(?=.*[@$!%*?&'_;-])[A-Za-zäöüÄÖÜß\\d@$!%*?&'_; -]{8,}$");
    }

    public static boolean validatePhoneNumber(String phoneNumber) {
        return phoneNumber.matches("^[0-9]+([-/\s][0-9]+)*$");
    }

    public static boolean validateZipCode(String zipCode) {
        return zipCode.matches("^[0-9]{5}$");
    }

    public static boolean validateStreetNumber(String streetNumber) {
        return streetNumber.matches("^[0-9]+[a-zA-ZäöüÄÖÜß]*((-[0-9]+[a-zA-ZäöüÄÖÜß]*)|(-[a-zA-ZäöüÄÖÜß]))?$");
    }

    public static void validateInstitution(Institution institution) throws ResponseStatusException {

        if (!FormValidation.validatePhoneNumber(institution.getPhoneNumber()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Telefonnummer ist ungültig.");

        if (!FormValidation.validateStreetNumber(institution.getAddress().getStreetNumber()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hausnummer ist ungültig.");

        if (!FormValidation.validateZipCode(institution.getAddress().getZipCode()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Postleitzahl ist ungültig.");
    }

    public static void validateCustomer(Customer customer) {

        if (!FormValidation.validateEmail(customer.getEmail()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email-Adresse ist ungültig.");

        if (!FormValidation.validatePhoneNumber(customer.getMobilePhone()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Handynummer ist ungültig.");

        if (!FormValidation.validatePhoneNumber(customer.getBusinessPhone()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Telefonnummer dienstlich ist ungültig.");
    }

    public static void validateUser(User user) {

        if (!FormValidation.validateEmail(user.getEmail()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email-Addresse ist ungültig.");
    }
}