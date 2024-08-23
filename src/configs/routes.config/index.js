import authRoute from "./authRoute";
import appsRoute from "./appsRoute";
import uiComponentsRoute from "./uiComponentsRoute";
import pagesRoute from "./pagesRoute";
// import authDemoRoute from "./authDemoRoute";
// import docsRoute from "./docsRoute";
import menuRoute from "./menuRoute";

export const publicRoutes = [...authRoute];

export const protectedRoutes = [
  ...menuRoute,
  ...appsRoute,
  ...uiComponentsRoute,
  ...pagesRoute,
  // ...authDemoRoute,
  // ...docsRoute,
];
