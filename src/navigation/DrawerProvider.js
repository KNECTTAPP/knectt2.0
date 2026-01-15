import React, { createContext, useRef, useState } from "react";
import CustomDrawer from "./DrawerNavigation";
import { setDrawerRef } from "./DrawerService";

export const DrawerContext = createContext(null);

const DrawerProvider = ({ children }) => {
  const [open, setOpen] = useState(false);

  const drawerControl = useRef({
    open: () => setOpen(true),
    close: () => setOpen(false),
  });

  setDrawerRef(drawerControl.current);

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      {children}
      <CustomDrawer
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </DrawerContext.Provider>
  );
};

export default DrawerProvider;
