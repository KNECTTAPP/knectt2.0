// GlobalModalContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import OptionsModal from "../screen/preHomePage/PreHomePage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const ModalContext = createContext();

export const useGlobalModal = () => {
  return useContext(ModalContext);
};

export const PreHomePageModalProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const navigation = useNavigation();

  const openModal = () => setVisible(true);
  const closeModal = () => setVisible(false);

  // 🔑 Call API once when app starts
  useEffect(() => {
    // const checkAPI = async () => {
    //   try {
    //     // fake API
    //     const response = await fetch("https://example.com/checkModal");
    //     const result = await response.json();

    //     if (result.showModal === true) {
    //       openModal(); // auto open modal if API says true
    //     }
    //   } catch (error) {
    //     console.log("API Error:", error);
    //   }
    // };

    // checkAPI();
    const checkLoginAndShowModal = async () => {
      const token = await AsyncStorage.getItem("usertoken");
      if (token) {
        setTimeout(() => {
          setVisible(true);
        }, 1000);
      }
    };
    const unsubscribe = navigation.addListener("focus", checkLoginAndShowModal);
    return unsubscribe;
    // checkLoginAndShowModal();
  }, [navigation]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <OptionsModal visible={visible} onClose={closeModal}  />
    </ModalContext.Provider>
  );
};
