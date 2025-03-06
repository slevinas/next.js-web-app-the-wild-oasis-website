import UpdateReservationForm from "@/app/_components/UpdateReservationForm";
import { auth } from "@/app/_lib/auth";
import { getReservationById } from "@/app/_lib/data-service";

export default async function Page({ params }) {
  // const session = await auth();
  // console.log("from app/account/reservations/edit/[bookingId] page.js", session);

  // if (!session?.user) {
  //   return null;
  // }
  const { bookingId } = await params;

  const reservation = await getReservationById(bookingId);
  // CHANGE
  // const reservationId = 23;
  // const maxCapacity = 23;

  console.log("from edit page reservation:", reservation);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Edit Reservation #{bookingId}
      </h2>
      <UpdateReservationForm reservation={reservation} />
    </div>
  );
}
