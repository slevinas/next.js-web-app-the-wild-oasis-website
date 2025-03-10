import { auth } from "@/app/_lib/auth";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";

export default async function Navigation() {
  //
  // const session = await auth();

  async function handleCheckSession() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: supabaseSession, error } = await supabase.auth.getSession();
    if (error) {
      throw new Error("Failed to get session");
    }
    if (!supabaseSession) {
      throw new Error("No active session");
    }
    // return session;

    console.log("From Navigation-handleCheckSession is:", supabaseSession);
  }

  const sessionFromNextAuth = await auth();
  // console.log("From Navigation-session is:", session);
  return (
    <nav className="z-10 text-xl">
      <ul className="flex gap-16 items-center">
        {/* <li>
          <div className="hover:text-accent-400 transition-colors">
            <button className="btnmt-5" onClick={handleCheckSession}>
              Get session from supabase
            </button>
          </div>
        </li> */}
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
