"use server";
import supabase from "@/app/_lib/supabase.js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "./auth";
import { validateNationalID, verifyReservationOwnership } from "./helpers";

export async function createReservation(mergedData) {
  console.log("from createReservationAction mergedData", mergedData);
  // mergedData {
  //   numGuests: '2',
  //   observations: '',
  //   start_date: '2025-03-22',
  //   end_date: '2025-03-29',
  //   cabin_id: 180
  // }

  // 1. Authentication and Authorization
  const session = await auth();
  if (!session || !session.user?.guestId) {
    throw new Error("You need to be signed in to book a cabin");
  }

  // Validate dates
  const start = new Date(mergedData.start_date);
  const end = new Date(mergedData.end_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid date format.");
  }

  if (start >= end) {
    throw new Error("End date must be after the start date.");
  }

  if (start < today) {
    throw new Error("Reservations cannot start in the past.");
  }
  console.log(
    "from createReservationAction start.end, today",
    start,
    end,
    today
  );

  // Check availability before creating a reservation
  const { data: conflicts, error: conflictError } = await supabase
    .from("reservations")
    .select("*")
    .eq("cabin_id", mergedData.cabin_id)
    .filter("start_date", "lte", mergedData.end_date)
    .filter("end_date", "gte", mergedData.start_date);

  if (conflictError) throw conflictError;

  if (conflicts?.length > 0) {
    throw new Error("The selected dates are not available for this cabin.");
  }

  const dataFields = {
    guest_id: session.user.guestId,
    cabin_id: mergedData.cabin_id,
    start_date: mergedData.start_date,
    end_date: mergedData.end_date,
    num_guests: mergedData.numGuests,
    observations: mergedData.observations,
  };

  // 3. Create Reservation Mutation
  const { data: newReservation, error: createErr } = await supabase
    .from("reservations")
    .insert([dataFields])
    .select();

  // 4. Error Handling
  if (createErr) {
    console.error("Error creating reservation:", createErr.message);
    throw new Error("Reservation could not be created");
  }

  // console.log("from createReservationAction newReservation", newReservation);

  // 5. Revalidation
  revalidatePath(`/cabins/${dataFields.cabin_id}`);
  // revalidatePath("/account/reservations");
  // 6. Redirect
  redirect("/account/thankyou");
}

export async function updateReservation(reservationId, formData) {
  // 1. Authentication and Authorization
  const session = await auth();
  // checking what is the logged in user in supabase auth , for Testing
  // const { data: dataFromAuthSup } = await supabase.auth.getUser();
  // console.log("from updateReservation dataFromAuthSup", dataFromAuthSup);

  await verifyReservationOwnership(session, reservationId);

  // 2. Data Validation
  let updatedFields = {};
  const numberOfGuests = formData.get("numGuests");
  const observations = formData.get("observations");

  if (observations?.length > 500) {
    observations = observations.slice(0, 500);
  }
  updatedFields.observations = observations;

  if (numberOfGuests) {
    updatedFields.num_guests = numberOfGuests;
  }

  console.log("from updateReservation", updatedFields);
  // 3. Update Reservation Mutation
  const { data: updatedResev, error: upResErr } = await supabase
    .from("reservations")
    .update(updatedFields)
    .eq("id", reservationId)
    .select()
    .single();
  // 4. Error Handling
  if (upResErr) {
    throw new Error("Reservation could not be updated");
  }
  // 5. Revalidation
  revalidatePath("/account/reservations");
  revalidatePath(`/account/reservations/edit/${reservationId}`);
  // 6. Redirect
  redirect("/account/reservations");
}

export async function updateProfile(formData) {
  const session = await auth();
  if (!session.user.guestId) {
    throw new Error("You need to be signed in to update your profile");
  }

  let updatedFields = {};
  const guestId = session.user.guestId;
  const nationalID = formData.get("nationalID");

  if (nationalID) {
    const isValidNationalID = validateNationalID(nationalID);
    if (!isValidNationalID) {
      throw new Error("Invalid NationalID");
    }
  }

  const [nationality, countryFlag] = formData.get("nationality").split("%");
  updatedFields = {
    nationality,
    countryflag: countryFlag,
    nationalid: nationalID,
  };
  const { data: updatedGuest, error: updatingGuestErr } = await supabase
    .from("guests")
    .update(updatedFields)
    .eq("id", guestId)
    .select()
    .single();

  if (updatingGuestErr) {
    throw new Error("Guest could not be updated");
  }

  revalidatePath("/account/profile");
}

export async function deleteBooking(bookingId) {
  const session = await auth();
  await verifyReservationOwnership(session, bookingId);

  const { data, error } = await supabase
    .from("reservations")
    .delete()
    .eq("id", bookingId);

  if (error) {
    throw new Error("Booking could not be deleted");
  }

  // Making an artificial delay to test the useOptimisticUI hook
  // await new Promise((resolve) => setTimeout(resolve, 3000));

  // faking a failed request to test the useOptimisticUI hook
  //
  // throw new Error("Failed to delete  booking");

  revalidatePath("/account/reservations");
}

export async function signInAction() {
  if (typeof window === "undefined") {
    await signIn("google", { redirectTo: "/account" });
  } else {
    throw new Error("signInAction should only be called on the client side");
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}