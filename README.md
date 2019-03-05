# SwChallenge
An exercise using Angular and D3 that allows the user to add people using a form, store the person data in memory via a service using rxjs, and then update a D3 force sim chart. The size of the circle drawn represents the person's weight, color represents age range, and links between circles show who is friends with who. Not much time was spent on making it look nice as I was pressed for time and focused on what I thought was most important.

I highly recommend interacting with it to see how it works. run &nbsp;`npm start`&nbsp; after you run the setup instructions.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.4.

## Setup
```
git clone https://github.com/jgdigitaljedi/swChallenge
cd swChallenge
npm i
```

## Development server

Run &nbsp;`npm start`&nbsp; for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run&nbsp; `npm run build`&nbsp; to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests
I'm a little short on tests ATM but also a little short on time (because life happens). I will TRY to write more tests if I have a chance.

Run&nbsp; `npm run test`&nbsp; to execute the unit tests via [Karma](https://karma-runner.github.io).

Alternatively you can run &nbsp;`npm run test:watch`&nbsp; to keep the browser window open. I created the other testing task because I've noticed sometimes (in past projects) tests will exit with a non-zero when you are watching and you end up with a Node process running in the background and you might not realize it. If this happens run &nbsp;`killall node`.

## Generate documentation
Run&nbsp; `npm run docs`&nbsp;

## To view documentation
After generating docs, navigate to 'documentation' and open 'index.html' in your browser.
