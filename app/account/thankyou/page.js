import Link from "next/link";

export default function ThankYou({ booking, onDelete }) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-semibold text-center">
        Thank you for your reservation!
      </h1>
     
      <div className="mt-8">
        <Link href="/account/reservations" >
         View and Manage Your Reservation
        </Link>
      </div>
    </div>
  );
}