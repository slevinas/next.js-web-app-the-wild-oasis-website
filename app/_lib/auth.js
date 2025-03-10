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

        if (!guestInfo) {
          throw new Error("Guest could not be found or created");
        }
        // Add the guest ID to the user object for the jwt callback
        user.guestId = guestInfo.id;
        return true;
      } catch (error) {
        console.error("Sign-in error:", error.message);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        const guestId = parseInt(user.guestId, 10);
        if (!isNaN(guestId)) {
          token.id = guestId;
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
    async session({ session, token }) {
      try {
        if (!token?.id || !token?.role) {
          throw new Error("Token is missing required properties.");
        }

        session.user.guestId = token.id; // Use the ID from the token
        session.user.role = token.role; // Use the role from the token

        return session;
      } catch (error) {
        console.error("Session error:", error.message);
        return null;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  // debug: process.env.NODE_ENV !== "production",
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
