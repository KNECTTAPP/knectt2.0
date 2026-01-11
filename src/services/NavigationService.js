// NavigationService.js
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export const NavigationService = {
  navigate(name, params) {
    if (navigationRef.isReady()) {
      navigationRef.navigate(name, params);
    } else {
      // You might want to store the navigation action to execute it when the ref is ready
      console.warn('Navigation ref is not ready');
    }
  },

  goBack() {
    if (navigationRef.isReady() && navigationRef.canGoBack()) {
      navigationRef.goBack();
    }
  },

  reset(name, params) {
    if (navigationRef.isReady()) {
      navigationRef.reset({
        index: 0,
        routes: [{ name, params }],
      });
    }
  }
};
