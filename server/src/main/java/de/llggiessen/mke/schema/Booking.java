package de.llggiessen.mke.schema;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Time;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Booking {

    @Id
    @GeneratedValue
    private long id;
    private int numberOfParticipants;
    @Embedded
    private RetrievalBoat retrievalBoat;
    @Embedded
    private ReturnBoat returnBoat;
    private String year;
    private double spaceUtilizationFee;
    private char status;
    private int salePercent;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Embeddable
    public static class RetrievalBoat {
        private Date retrievalDate;
        private Time retrievalTime;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Embeddable
    public static class ReturnBoat {
        private Date returnDate;
        private Time returnTime;
    }
}

