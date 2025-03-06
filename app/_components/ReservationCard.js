import DeleteReservation from '@/app/_components/DeleteReservation';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { format, formatDistance, isPast, isToday, parseISO } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  }).replace('about ', '');

function ReservationCard({ booking, onDelete }) {
  // console.log("from ReservationCard booking:", booking);
  // console.log("ReservationCard booking.id:", booking.id);

  // console.log(typeof booking.start_date);
  const {
    id,
    guest_id,
    start_date,
    end_date,
    num_nights,
    total_price,
    num_guests,
    status,
    created_at,
    cabins: { name, image },
  } = booking;

  return (
    <div className="flex border border-primary-800">
      <div className="relative h-32 aspect-square">
        <Image
          fill
          src={booking.cabins.image}
          alt={`Cabin ${booking.cabins.name}`}
          className="object-cover border-r border-primary-800"
        />
      </div>

      <div className="flex-grow px-6 py-3 flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {num_nights} nights in Cabin {booking.cabins.name}
          </h3>
          {isPast(parseISO(start_date)) ? (
            <span className="bg-yellow-800 text-yellow-200 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-sm">
              past
            </span>
          ) : (
            <span className="bg-green-800 text-green-200 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-sm">
              upcoming
            </span>
          )}
        </div>

        <p className="text-lg text-primary-300">
          {format(parseISO(start_date), "EEE, MMM dd yyyy")} (
          {isToday(parseISO(start_date))
            ? "Today"
            : formatDistanceFromNow(start_date)}
          ) &mdash; {format(parseISO(end_date), "EEE, MMM dd yyyy")}
        </p>

        <div className="flex gap-5 mt-auto items-baseline">
          <p className="text-xl font-semibold text-accent-400">
            ${total_price}
          </p>
          <p className="text-primary-300">&bull;</p>
          <p className="text-lg text-primary-300">
            {num_guests} guest{num_guests > 1 && "s"}
          </p>
          <p className="ml-auto text-sm text-primary-400">
            Booked {format(parseISO(created_at), "EEE, MMM dd yyyy, p")}
          </p>
        </div>
      </div>

      <div className="flex flex-col border-l border-primary-800 w-[100px]">
        {isPast(parseISO(start_date)) ? (
          ""
        ) : (
          <>
            <Link
              href={`/account/reservations/edit/${id}`}
              className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 border-b border-primary-800 flex-grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900"
            >
              <PencilSquareIcon className="h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors" />
              <span className="mt-1">Edit</span>
            </Link>
            <DeleteReservation bookingId={booking.id} onDelete={onDelete} />
          </>
        )}
      </div>
    </div>
  );
}

export default ReservationCard;