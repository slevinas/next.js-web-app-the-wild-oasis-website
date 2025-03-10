"use client";

import { updateProfile } from "@/app/_lib/actions";
import Image from "next/image";
import React, { useState } from "react";
import { useFormStatus } from "react-dom";

function UpdateProfileForm({ guest, countries }) {
  const [selectedCountry, setSelectedCountry] = useState(
    `${guest.nationality}%${guest.countryflag}`
  );

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  return (
    <div>
      <form
        action={updateProfile}
        className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
      >
        <div className="space-y-2">
          <label>Full name</label>
          <input
            defaultValue={guest.fullName}
            name="fullName"
            disabled
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
          />
        </div>

        <div className="space-y-2">
          <label>Email address</label>
          <input
            defaultValue={guest.email}
            name="email"
            disabled
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between ">
            <label htmlFor="nationality">Where are you from?</label>
            {selectedCountry.split("%")[1] ? (
              <div className="flex relative h-5 w-8 ml-3">
                <Image
                  fill
                  src={selectedCountry.split("%")[1]}
                  alt="Country flag"
                  className="h-5 rounded-sm object-cover"
                />
              </div>
            ) : null}
          </div>

          <select
            name="nationality"
            id="nationality"
            value={selectedCountry}
            onChange={handleCountryChange}
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          >
            <option value="">Select country...</option>
            {countries.map((c) => (
              <option key={c.name} value={`${c.name}%${c.flag}`}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="nationalID">National ID number</label>
          <input
            defaultValue={guest.nationalID}
            name="nationalID"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          {/* <button className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300">
            Update profile
          </button> */}
          <Button />
        </div>
      </form>
    </div>
  );
}

function Button() {
  // This hook must be called inside a form element Not just in the form component
  const formState = useFormStatus();

  return (
    <button
      disabled={formState.pending}
      className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
    >
      {formState.pending ? "updating ..." : "Update profile"}
    </button>
  );
}

export default UpdateProfileForm