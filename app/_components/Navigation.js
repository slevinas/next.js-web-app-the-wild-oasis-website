import { auth } from "@/app/_lib/auth";
import Image from "next/image";
import Link from "next/link";

export default async function Navigation() {
  const sessionFromNextAuth = await auth();

  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">
        <li>
          <Link
            href="/cabins"
            className="hover:text-accent-400 transition-colors"
          >
            Cabins
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="hover:text-accent-400 transition-colors"
          >
            About
          </Link>
        </li>
        <li>
          {sessionFromNextAuth?.user?.image ? (
            <Link
              href="/account"
              className="hover:text-accent-400 transition-colors flex items-center gap-4"
            >
              <div className="relative h-10 w-10">
                <Image
                  src={sessionFromNextAuth.user.image}
                  fill
                  alt="Profile picture"
                  className="h-10 w-10 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <span> Guest area</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="hover:text-accent-400 transition-colors"
            >
              Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
