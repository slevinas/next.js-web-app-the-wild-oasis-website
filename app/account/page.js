import { auth } from "@/app/_lib/auth";

export const metadata = {
  title: "Guest area",
};

export default async function Page() {
  const session = await auth();
  // const guestInfoFromDb = await getGuestByEmail(session.user.email);
  // console.log("from proflie page guestInfoFromDb:", guestInfoFromDb);
  // console.log("from account page.js", session);
  if (session?.user?.image) {
    return (
      <>
        <h2 className="font-semibold text-2xl text-accent-400 mb-7">
          Welcome back {session.user.name}
        </h2>
        <p className="text-lg text-primary-800">
          Your email is {session.user.email}
        </p>
      </>
    );
  } else {
    return (
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Please sign in
      </h2>
    );
  }
}
