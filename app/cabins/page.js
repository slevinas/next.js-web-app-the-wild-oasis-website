import CabinList from "@/app/_components/CabinList";
import Filter from "@/app/_components/Filter";
import ReservationReminder from "@/app/_components/ReservationReminder";
import { Suspense } from "react";
import SpinnerMini from "../_components/SpinnerMini";
export const metadata = {
  title: "Cabins",
};

// Opting out of static generation
// this is for individual pages and not per fetch
// export const revalidate =  0;
// export const revalidate =  15;
// export const revalidate =  3600;

export default async function Page({ searchParams }) {
  const queryParams = await searchParams;

  const filter = queryParams?.capacity ?? "all";

  console.log("filter", filter);
  // // FETCH
  // // CHANGE
  // const cabins = await getCabins();
  // console.log("from cabins", cabins);

  return (
    <div>
      <h1 className="text-4xl mb-5 text-accent-400 font-medium">
        Our Luxury Cabins
      </h1>
      <p className="text-primary-200 text-lg mb-10">
        Cozy yet luxurious cabins, located right in the heart of the Italian
        Dolomites. Imagine waking up to beautiful mountain views, spending your
        days exploring the dark forests around, or just relaxing in your private
        hot tub under the stars. Enjoy nature&apos;s beauty in your own little
        home away from home. The perfect spot for a peaceful, calm vacation.
        Welcome to paradise.
      </p>
      <div className="flex justify-end mb-8">
        <Filter />
      </div>

      <Suspense fallback={<SpinnerMini />} key={filter}>
        <CabinList filter={filter} />
        <ReservationReminder />
      </Suspense>
    </div>
  );
}
