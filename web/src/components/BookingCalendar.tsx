import "../styles/index.css";
import "../styles/BookingCalendar.css";
import "react-calendar/dist/Calendar.css";

import Calendar, { CalendarTileProperties } from "react-calendar";

type BookingCalendarProps = { className?: string; dates: Date[][] };

export default function BookingCalendar({
  className,
  dates,
}: BookingCalendarProps): JSX.Element {
  return (
    <Calendar
      className={`calendar ${className}`}
      tileClassName={(date) => {
        return determineClassNames({ date, dates });
      }}
      onClickDay={(date) => console.log(date)}
    />
  );
}

// determines whether any date in currently rendered month is in specified date range and adds corresponding classNames
function determineClassNames({
  date,
  dates,
}: {
  date: CalendarTileProperties;
  dates: Date[][];
}) {
  let classesToAdd: string = "";
  dates.forEach((datespan, index) => {
    if (
      datespan[1].getTime() >= date.date.getTime() &&
      date.date.getTime() >= datespan[0].getTime()
    ) {
      classesToAdd = `selected ${index} `;
    }

    if (datespan[0].getTime() === date.date.getTime()) {
      classesToAdd += "start ";
    }

    if (datespan[1].getTime() === date.date.getTime()) {
      classesToAdd += "end ";
    }
  });

  if (date.date.getDay() === 6 || date.date.getDay() === 0) {
    classesToAdd += " weekend";
  }

  return classesToAdd;
}
