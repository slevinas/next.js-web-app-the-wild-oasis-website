import supabase from "@/app/_lib/supabase.js";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

async function getOrCreateGuest(email, name) {
  // Fetch the guest from the database
  const { data: guests, error: guestErrFromDb } = await supabase
    .from("guests")
    .select("*")
    .eq("email", email)
    .limit(1);

  if (guestErrFromDb) {
    console.error("Error loading guest from Supabase:", guestErrFromDb);
    throw new Error("Guest could not be found");
  }

  // Check if a guest was found
  if (guests && guests.length > 0) {
    return guests[0];
  }

  // Create a new guest if not found
  const newGuest = {
    fullname: name,
    email: email,
  };

  const { data: newGuestFromDb, error: newGuestErrFromDb } = await supabase
    .from("guests")
    .insert([newGuest])
    .select()
    .single();

  if (newGuestErrFromDb) {
    console.error("Error creating new guest:", newGuestErrFromDb);
    throw new Error("Could not create guest");
  }

  return newGuestFromDb;
}

const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user }) {
      try {
        const guestInfo = await getOrCreateGuest(user.email, user.name);
        console.log("Sign-in successful for guest:", guestInfo);
        return true;
      } catch (error) {
        console.error("Sign-in error:", error.message);
        return false;
      }
    },
    async session({ session, token }) {
      try {
        if (!session?.user?.email) {
          throw new Error("Session user email is missing");
        }
        const guestInfo = await getOrCreateGuest(
          session.user.email,
          session.user.name
        );
        console.log(
          "Fetched guest ID:",
          guestInfo.id,
          "Type:",
          typeof guestInfo.id
        );
        // Ensure the guest ID is a BIGINT and not a UUID
        const guestId = Number(guestInfo.id);
        if (isNaN(guestId)) {
          console.error(
            "Invalid guest ID format. Expected a BIGINT, received:",
            guestInfo.id
          );
          return null;
        }

        session.user.guestId = guestId;
        session.user.role = "guest";
        session.user.id = guestId;

        console.log("Session created with BIGINT ID:", session);
        return session;
      } catch (error) {
        console.error("Session error:", error.message);
        return null;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        const userId = parseInt(user.id, 10);
        if (!isNaN(userId)) {
          token.id = userId;
          token.role = "guest";
        } else {
          console.error(
            "Invalid user ID format. Expected a BIGINT, received:",
            user.id
          );
        }
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
  pages: {
    signIn: "/login",
    error: "/login", // Redirect to login page on error
  },
};

export default NextAuth(authConfig);

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth(authConfig);
