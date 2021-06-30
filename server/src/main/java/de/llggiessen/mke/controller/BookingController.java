package de.llggiessen.mke.controller;

import de.llggiessen.mke.repository.BookingRepository;
import de.llggiessen.mke.schema.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.Optional;

@RestController
@RequestMapping(path = "/booking")
public class BookingController {

    @Autowired
    BookingRepository repository;

    @GetMapping("")
    public Iterable<Booking> getBookings(){
        return repository.findAll();
    }

    @GetMapping(value = "", params = {"id"})
    public Optional<Booking> getBookingByID(@RequestParam long id){
        return repository.findByID(id);
    }

    @GetMapping(value = "", params = {"year"})
    public Iterable<Booking> getBookingsByYear(@RequestParam(value = "year", required = false, defaultValue = "") String year) {
        return repository.findAllByYear(year);
    }
    @GetMapping(value = "", params = {"retrieval_date"})
    public Iterable<Booking> getBookingsByRetrievalDate(@RequestParam Date retrieval_date){
        return repository.findAllByRetrievalBoatDate(retrieval_date);
    }
    @GetMapping(value = "", params = {"return_date"})
    public Iterable<Booking> getBookingsByReturnDate(@RequestParam Date return_date){
        return repository.findAllByReturnBoatDate(return_date);
    }
    @GetMapping(value = "", params = {"status"})
    public Iterable<Booking> getBookingsByStatus(@RequestParam char status){
        return repository.findAllByStatus(status);
    }
}

