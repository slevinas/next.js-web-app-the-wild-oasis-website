"use client";
import Image from "next/image";
import { FormEvent, useTransition } from "react";
import { createReservation } from "../_lib/actions";
import { useReservation } from "./ReservationContext";
function ReservationForm({ cabin, user }) {
  const [isPending, startTransition] = useTransition();

  const { range, resetRange } = useReservation();

  // const createReservationWithRange = createReservation.bind(null, range);

  // CHANGE
  // const maxCapacity = 23;
  const cabin_id = cabin.id;
  const maxCapacity = cabin.maxCapacity;
  const startDate = range?.from;
  const endDate = range?.to;
  let isDateRangeValid = false;
  if (startDate && endDate) {
    isDateRangeValid = true;
  }

  async function onSubmit(event) {
    event.preventDefault();
    console.log("submitting form");

    if (!startDate || !endDate) {
      throw new Error("Invalid date range");
    }

    const start_date = startDate.toISOString().split("T")[0];
    const end_date = endDate.toISOString().split("T")[0];
    const reservationData = {
      start_date,
      end_date,
      cabin_id,
    };
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData); //

    // Merge data and reservationData
    const mergedData = { ...data, ...reservationData };
    console.log("from ReservationForm mergedData is", mergedData);

    startTransition(async () => {
      // await createReservationWithRange(mergedData);
      await createReservation(mergedData);

      // console.log("Range after reset:", range);
    });
    resetRange();
  }

  return (
    <div className="scale-[1.01]">
      <div className="bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center">
        {/* <p>The Range is {JSON.stringify(range)}</p> */}
        <p>Logged in as</p>

        <div className="flex relative h-5 w-8 ml-3">
          <Image
            fill
            // Important to display google profile images
            referrerPolicy="no-referrer"
            className="h-8 rounded-full object-cover"
            src={user.image}
            alt={user.name}
          />
          <p>{user.name}</p>
        </div>
      </div>
      <br />
      {/* <span className="text-primary-300 text-lg px-16">
        Range is {JSON.stringify(range)}
      </span> */}

      <form
        onSubmit={onSubmit}
        className="bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            id="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          {!range && (
            <p className="text-primary-300 text-base">
              Start by selecting dates
            </p>
          )}

          <button
            disabled={!isDateRangeValid}
            type="submit"
            className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
          >
            Reserve now
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
