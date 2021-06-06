package de.llggiessen.mke;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

@Service("emailService")
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Async
    public void sendSimpleMessage(String to, String subject, String text) {
        MimeMessage mimeMessage = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
        String message = String.format("<h3>%s</h3>", text);
        try {
            helper.setSubject(subject);
            helper.setFrom("test@ddietzler.dev", "MKE Verwaltung");
            mimeMessage.setContent(message, "text/html");
            helper.setTo(to);
            emailSender.send(mimeMessage);
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error(e.toString());
        }
    }

    @Autowired
    private SpringTemplateEngine templateEngine;

    @Async
    public void sendFancyEmail(Mail mail) throws MessagingException, IOException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                StandardCharsets.UTF_8.name());
        // helper.addAttachment("blub.jpeg", new ClassPathResource(path))

        Context context = new Context();
        context.setVariables(mail.getProps());

        String html = templateEngine.process("test-template", context);

        helper.setTo(mail.getTo());
        helper.setText(html, true);
        helper.setSubject(mail.getSubject());
        helper.setFrom(mail.getFrom());

        emailSender.send(message);
    }
}
