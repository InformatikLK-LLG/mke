package de.llggiessen.mke.utils;

public class FormValidation {

  public static boolean validateEmail(String email) {
    return email.matches("^\\w+([.+-]\\w+)*@(\\w*[.+-]*)+\\.\\w+$");
  }

  public static boolean validatePassword(String password) {
    return password
        .matches("^(?=.*[a-zäöüß])(?=.*[A-ZÄÖÜ])(?=.*\\d)(?=.*[@$!%*?&'_;-])[A-Za-zäöüÄÖÜß\\d@$!%*?&'_;-]{8,}$");
  }

  public static boolean validatePhoneNumber(String phoneNumber) {
    return phoneNumber.matches("^[0-9]+([-/][0-9]+)*$");
  }

  public static boolean validateZipCode(String zipCode) {
    return zipCode.matches("^[0-9]{5}$");
  }

  public static boolean validateStreetNumber(String streetNumber) {
    return streetNumber.matches("^[0-9]+[a-zA-ZäöüÄÖÜß]*((-[0-9]+[a-zA-ZäöüÄÖÜß]*)|(-[a-zA-ZäöüÄÖÜß]))?$");
  }
}