package de.llggiessen.mke.controller;

import de.llggiessen.mke.repository.BookingRepository;
import de.llggiessen.mke.schema.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping(path = "/booking")
public class BookingController {

    @Autowired
    BookingRepository repository;

    @GetMapping("")
    public Iterable<Booking> getBookings(@RequestParam(value = "retrievalBoat", required = false, defaultValue = "") Booking.RetrievalBoat retrievalBoat,
                                         @RequestParam(value = "returnBoat", required = false, defaultValue = "") Booking.ReturnBoat returnBoat,
                                         @RequestParam(value = "bookingNo", required = false, defaultValue = "") long bookingNo,
                                         @RequestParam(value = "status", required = false, defaultValue = "") char status,
                                         @RequestParam(value = "year", required = false, defaultValue = "") String year) {
        return repository.findAllByAttributes(retrievalBoat, returnBoat, bookingNo, status, year);
    }
}

