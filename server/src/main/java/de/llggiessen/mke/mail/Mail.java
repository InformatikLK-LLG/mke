package de.llggiessen.mke.mail;

import java.util.List;
import java.util.Map;

import javax.mail.internet.InternetAddress;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Mail {
    private InternetAddress from;
    private String to;
    private String subject;
    private String content;
    private List<Object> attachments;
    private Map<String, Object> props;

}
