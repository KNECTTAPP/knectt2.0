import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function openDrawer() {
    console.log("asdasdasdsadasdsadasdsad",navigationRef)
  if (navigationRef.isReady()) {
    navigationRef.openDrawer();
  }
}

export function closeDrawer() {
  if (navigationRef.isReady()) {
    navigationRef.closeDrawer();
  }
}
