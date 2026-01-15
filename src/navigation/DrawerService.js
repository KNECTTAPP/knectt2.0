let drawerRef = null;

export const setDrawerRef = (ref) => {
  drawerRef = ref;
};

export const openDrawer = () => {
  drawerRef?.open();
};

export const closeDrawer = () => {
  drawerRef?.close();
};
