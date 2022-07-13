// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'ng-unique-network-nft',
    appId: '1:843894020638:web:e493220b83dfa9f2cbec0f',
    storageBucket: 'ng-unique-network-nft.appspot.com',
    locationId: 'europe-west',
    apiKey: 'AIzaSyCtQLZcY_1GbA0G12O7_y41nHB01hHrjTA',
    authDomain: 'ng-unique-network-nft.firebaseapp.com',
    messagingSenderId: '843894020638',
  },
  appName: 'TerraCore NFT',
  developmentKeyring: true,
  production: false,
  providerSocket: 'wss://ws-opal.unique.network',//'wss://ws-rc.unique.network', //wss://ws-rc.unique.network
  rpc: {}
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
