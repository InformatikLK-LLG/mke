package de.llggiessen.mke.schema;

import org.apache.tomcat.jni.Time;

import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.Date;


@Entity
public class Booking {

    @Id
    @GeneratedValue
    private long bookingNo;
    private int numberOfParticipants;
    @Embedded
    private Collection collection;
    @Embedded
    private Abgabe abgabe;
    private String year;
    private double spaceUtilizationFee;
    private char status;
    private int salePercent;



    private class Collection {
        private Date date;
        private Time time;
    }

    private class Abgabe{
        private Date date;
        private Time time;
    }
}
