import { useState, useEffect } from "react";
import type { User } from "../types";

export interface UserProfile {
  name: string;
  phone: string;
  gender: string;
  birth: string;
}

export function useUserProfile() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserProfile>({
    name: "",
    phone: "",
    gender: "",
    birth: "",
  });
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("currentUser");
      const savedProfile = localStorage.getItem("userProfile");
      const savedAvatar = localStorage.getItem("userAvatar");

      if (savedUser) setCurrentUser(JSON.parse(savedUser));
      if (savedProfile) setFormData(JSON.parse(savedProfile));
      if (savedAvatar) {
        if (savedAvatar.startsWith("data:image")) {
          setAvatar(savedAvatar);
        } else {
          setAvatar(JSON.parse(savedAvatar));
        }
      }
    } catch (error) {
      console.error("Lỗi khi đọc dữ liệu localStorage:", error);
    }
  }, []);

  const saveProfile = () => {
    if (currentUser)
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    localStorage.setItem("userProfile", JSON.stringify(formData));
  };

  const clearProfile = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userProfile");
    setCurrentUser(null);
    setFormData({
      name: "",
      phone: "",
      gender: "",
      birth: "",
    });
    setAvatar(null);
  };

  return {
    currentUser,
    setCurrentUser,
    formData,
    setFormData,
    saveProfile,
    avatar,
    setAvatar,
    clearProfile,
  };
}
