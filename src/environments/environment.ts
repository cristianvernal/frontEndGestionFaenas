// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { EnvironmentConfiguration } from "../app/services/environment-configuration";


const serverUrl='https://localhost:4200';


// The list of file replacements can be found in `angular.json`.
export const environment: EnvironmentConfiguration = {
  env_name: 'dev',
  production: true,
  apiUrl: serverUrl,
  apiEndpoints: {
    userProfile:'user-profiles'
  },
  adb2cConfig: {
    clientId: '6cc185d2-aca1-412a-86f2-f850cfbc0bb9',
    readScopeUrl: 'https://proyectoDeTitulo2024.onmicrosoft.com/tasks-api/tasks.read',
    writeScopeUrl: 'https://proyectoDeTitulo2024.onmicrosoft.com/tasks-api/tasks.write',
    scopeUrls:[
      'https://proyectoDeTitulo2024.onmicrosoft.com/tasks-api/tasks.read',
      'https://proyectoDeTitulo2024.onmicrosoft.com/tasks-api/tasks.write'
    ],
    apiEndpointUrl: "http://localhost:5000/api/todolist"
  },
  cacheTimeInMinutes: 30,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
