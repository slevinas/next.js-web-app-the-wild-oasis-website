"use client";
import { createContext, useContext, useState } from "react";

const ReservationContext = createContext();

const initialState = {
  from: null,
  to: null,
};

function ReservationProvider({ children }) {
  const [range, setRange] = useState(initialState);

  const resetRange = () => {
    console.log("resteRange was called ");
    setRange(initialState);
  };

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error("ReservationContext was used uotside of ReservationProvider");
  }
  return context;
}


export { ReservationProvider, useReservation };
// export default ReservationContext;

