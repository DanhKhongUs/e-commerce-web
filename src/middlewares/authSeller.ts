import User from "@/models/User";

const authSeller = async (userId: string | null) => {
  try {
    const user = await User.findOne({ userId }).populate("store");

    if (!user || !user.store) return false;

    // Kiểm tra trạng thái của store
    if (user.store.status === "approved") {
      return user.store._id;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default authSeller;
