import { clerkClient } from "@clerk/nextjs/server";

const authAdmin = async (userId: string) => {
  try {
    if (!userId) return false;

    const client = await clerkClient();

    const user = await client.users.getUser(userId);

    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) return false;

    const adminEmail = process.env.ADMIN_EMAIL?.split(",") || [];
    const isAdmin = adminEmail.includes(email);
    return isAdmin;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default authAdmin;
