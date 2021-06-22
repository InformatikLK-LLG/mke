package de.llggiessen.mke.controller;

import de.llggiessen.mke.repository.BookingRepository;
import de.llggiessen.mke.schema.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Optional;

@RestController
@RequestMapping(path = "/booking")
public class BookingController {

    @Autowired
    BookingRepository repository;

    @GetMapping("")
    public Iterable<Booking> getBookings(@RequestParam(value = "year", required = false, defaultValue = "") String year) {
        return repository.findAllByAttributes(year);
    }

}

