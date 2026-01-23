import React, { createContext, useContext, useEffect, useState } from "react";
import { getStorage, setStorage, StorageKeys } from "./storage";

const StorageContext = createContext();

export const StorageProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  // Load once on app start
  useEffect(() => {
    const loadCartCount = async () => {
      const count = await getStorage(StorageKeys.CART_COUNT);
      setCartCount(count ?? 0);
    };
    loadCartCount();
  }, []);

  const updateCartCount = async (count) => {
    setCartCount(count); // 🔥 instant UI update
    await setStorage(StorageKeys.CART_COUNT, count);
  };

  return (
    <StorageContext.Provider
      value={{
        cartCount,
        updateCartCount,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => useContext(StorageContext);
