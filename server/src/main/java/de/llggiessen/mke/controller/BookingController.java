package de.llggiessen.mke.controller;

import de.llggiessen.mke.repository.BookingRepository;
import de.llggiessen.mke.schema.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;

@RestController
@RequestMapping(path = "/booking")
public class BookingController {

    @Autowired
    private BookingRepository repository;

    @GetMapping("")
    @PreAuthorize("hasAuthority('BOOKING_READ')")
    public Iterable<Booking> getBookings() {
        return repository.findAll();
    }

    @GetMapping(value = "", params = { "id" })
    @PreAuthorize("hasAuthority('BOOKING_READ')")
    public Optional<Booking> getBookingById(@RequestParam long id) {
        return repository.findById(id);
    }

    @GetMapping(value = "", params = { "year" })
    @PreAuthorize("hasAuthority('BOOKING_READ')")
    public Iterable<Booking> getBookingsByYear(
            @RequestParam(value = "year", required = false, defaultValue = "") String year) {
        return repository.findAllByYear(year);
    }

    @GetMapping(value = "", params = { "retrievalDate" })
    @PreAuthorize("hasAuthority('BOOKING_READ')")
    public Iterable<Booking> getBookingsByRetrievalDate(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date retrievalDate) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        try {
            return repository.findAllByRetrievalBoatDate(simpleDateFormat.format(retrievalDate));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Try using this timeformat: yyyy-MM-dd");
        }
    }

    @GetMapping(value = "", params = { "returnDate" })
    @PreAuthorize("hasAuthority('BOOKING_READ')")
    public Iterable<Booking> getBookingsByReturnDate(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date returnDate) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        try {
            return repository.findAllByReturnBoatDate(simpleDateFormat.format(returnDate));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Try using this timeformat: yyyy-MM-dd");
        }
    }

    @GetMapping(value = "", params = { "retrievalDate", "returnDate" })
    @PreAuthorize("hasAuthority('BOOKING_READ')")
    public Iterable<Booking> getBookingsInRange(@RequestParam("retrievalDate") String retrievalDate,
            @RequestParam("returnDate") String returnDate) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        try {
            return repository.findAllInRange(simpleDateFormat.parse(retrievalDate), simpleDateFormat.parse(returnDate));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Try using this timeformat: yyyy-MM-dd");
        }
    }

    @GetMapping(value = "", params = { "status" })
    @PreAuthorize("hasAuthority('BOOKING_READ')")
    public Iterable<Booking> getBookingsByStatus(@RequestParam char status) {
        return repository.findAllByStatus(status);
    }

    @DeleteMapping(value = "", params = { "id" })
    @PreAuthorize("hasAuthority('BOOKING_WRITE')")
    public void deleteById(@RequestParam long id) {
        repository.deleteById(id);
    }

    @PostMapping("")
    @PreAuthorize("hasAuthority('BOOKING_WRITE')")
    public Booking createBooking(@RequestBody Booking booking) {
        try {
            if (!repository.existsById(booking.getId())) {
                return repository.save(booking);
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID already exist");
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("")
    @PreAuthorize("hasAuthority('BOOKING_WRITE')")
    public Booking updateBooking(@RequestBody Booking booking) {
        try {
            if (repository.existsById(booking.getId())) {
                return repository.save(booking);
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot find object with this id");
            }
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
    }

}
