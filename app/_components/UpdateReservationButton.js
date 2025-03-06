"use client"

import { useFormStatus } from "react-dom";

function UpdateReservationButton() {
  const formState = useFormStatus();

  return (
    <button
    disabled={formState.pending}
    className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
  >
    {formState.pending ? "updating ..." : "Update reservation"}
  </button>
);
}

export default UpdateReservationButton;