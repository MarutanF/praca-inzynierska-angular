# PracaInzynierskaAngular

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Cloud function

`cd functions`
`firebase emulators:start --only functions`

## Deployment

`ng build`
`firebase deploy`

## Cloud function with datastore

Due to credential issue, function work only if it is deployed.

(to test in local emulator)
install Google Cloud SDK (https://cloud.google.com/sdk/docs/downloads-interactive)
login `gcloud auth application-default login`

(to run script)
`npm run <name-of-script>`
