package de.llggiessen.mke.schema;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;
import java.sql.Time;
import java.sql.Date;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Booking {

    @Id
    @GeneratedValue
    private long bookingNo;
    private int numberOfParticipants;
    @Embedded
    private Abholung abholung;
    @Embedded
    private Abgabe abgabe;
    private String year;
    private double spaceUtilizationFee;
    private char status;
    private int salePercent;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Embeddable
    private static class Abholung {
        private Date date;
        private Time time;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Embeddable
    private static class Abgabe {
        private Date date;
        private Time time;
    }
}

