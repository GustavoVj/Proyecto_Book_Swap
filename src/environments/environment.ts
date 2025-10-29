// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    //apiKey: "", //Solicitar por correo electrónico
    authDomain: "bookswap-7d64a.firebaseapp.com",
    projectId: "bookswap-7d64a",
    storageBucket: "bookswap-7d64a.firebasestorage.app",
    messagingSenderId: "593286568966",
    appId: "1:593286568966:web:abe9f4a720b5761239b787",
    measurementId: "G-H3ENKY7NZF"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
