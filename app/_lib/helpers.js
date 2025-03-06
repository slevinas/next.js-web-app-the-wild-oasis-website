// Filename: helpers.js
import supabase from "@/app/_lib/supabase.js";
// Regex for alphanumeric string between 6 and 12 characters

// Function to validate nationalID
export function validateNationalID(nationalID) {
  const nationalIDRegex = /^[a-zA-Z0-9]{6,12}$/;
  return nationalIDRegex.test(nationalID);
}

// // Example usage
// const testIDs = ["abc123", "A1B2C3D4", "short", "TooLongNationalID123", "validID12"];

// testIDs.forEach(id => {
//   console.log(`NationalID: ${id} - Valid: ${validateNationalID(id)}`);
// });




export async function verifyReservationOwnership(session, reservationId) {
  if (!session.user.guestId) {
    throw new Error("You need to be signed in to perform this action");
  }

  const { data: guestReservationsIds, error: guestReservationsErr } =
    await supabase
      .from("reservations")
      .select("id, guest_id")
      .eq("guest_id", session.user.guestId)
      .order("created_at", { ascending: false });

  if (guestReservationsErr) {
    console.error(guestReservationsErr);
    throw new Error("Reservations could not be loaded");
  }
  // console.log("from verifyReservationOwnership", guestReservationsIds);
  // console.log("and this is the reservationId", reservationId);
  const bookingIds = guestReservationsIds.map((booking) => booking.id);
  console.log("and this is the bookingIds", bookingIds);

  // console.log(typeof reservationId);

  // console.log(bookingIds.includes(Number(reservationId)));

  if (!bookingIds.includes(Number(reservationId))) {
    throw new Error("This reservation does not belong to you");
  }
}