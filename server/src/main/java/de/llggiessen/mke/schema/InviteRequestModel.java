package de.llggiessen.mke.schema;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InviteRequestModel {

    private String email;
    private Set<Role> roles;
    private String inviteCode;

}