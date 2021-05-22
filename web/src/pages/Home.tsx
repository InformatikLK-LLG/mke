import BookingCalendar from "../components/BookingCalendar";

export default function Home() {
  const dates = [
    [new Date(2021, 4, 20), new Date(2021, 4, 21)],
    [new Date(2021, 4, 21), new Date(2021, 4, 24)],
    [new Date(2021, 4, 4), new Date(2021, 4, 10)],
  ];
  return (
    <div className="content">
      <BookingCalendar dates={dates} />
      {document.getElementsByClassName("selected")}
    </div>
  );
}
