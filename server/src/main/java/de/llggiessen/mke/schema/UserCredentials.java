package de.llggiessen.mke.schema;

import lombok.Data;

@Data
public class UserCredentials {
    private String email;
    private String password;
}