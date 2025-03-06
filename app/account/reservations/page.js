// import ReservationCard from "@/app/_components/ReservationCard";
import ResevationList from "@/app/_components/ReservationList";
import { auth } from "@/app/_lib/auth";
import { getBookings } from "@/app/_lib/data-service";
import supabase from "@/app/_lib/supabase";
import Link from "next/link";

export const metadata = {
  title: "Reservations",
};

export default async function Page() {
  const session = await auth();

  const {
    data: guestReservations,
    error,
    count,
  } = await supabase
    .from("reservations")
    .select("*, cabins(*)", { count: "exact" })
    .eq("guest_id", session.user.guestId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  const bookings = guestReservations;

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Your reservations
      </h2>

      {bookings.length === 0 ? (
        <p className="text-lg">
          You have no reservations yet. Check out our{" "}
          <Link className="underline text-accent-500" href="/cabins">
            luxury cabins &rarr;
          </Link>
        </p>
      ) : (
        // <ul className="space-y-6">
        //   {bookings.map((booking) => (
        //     <ReservationCard booking={booking} key={booking.id} />
        //   ))}
        // </ul>
        <ResevationList bookings={bookings} />
      )}
    </div>
  );
}
