# SwChallenge
An exercise using Angular and D3 that allows the user to add people using a form, store the person data in memory via a service using rxjs, and then update a D3 force sim chart. The size of the circle drawn represents the person's weight, color represents age range, and links between circles show who is friends with who. Not much time was spent on making it look nice as I was pressed for time and focused on what I thought was most important.

I highly recommend interacting with it to see how it works. run &nbsp;`npm start`&nbsp; after you run the setup instructions.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.4.

# What I Would Change
I know I had 48 hours, but things have been too busy to devote a lot of time to this. I basically did all of this in what little spare time I had over a 24 hour period so, obviously, there are things I would change:

- MORE TESTS! I left those for last because I figured while important, they weren't as important as demonstrating how I would tackle this challenge as a whole. I wrote a few and they pass.
- Better use of d3. It occurred to me that I'm destroying and creating the chart each time. It works, but I could have explored just adding nodes and links which would have been much better for user experience. I also remembered this morning that d3 has a lot of color functions so I could have also made the age colors appear as a gradient rather than just a solid color choice for each 10 year group. This would have allowed you to know if someone was closer to the end or the beginning of an age range by looking at the chart.
- D3 events as chart.component methods. I wrote functions inside of the createChart method to save time. Moving them into their own component methods and probably using .bind(this) to call them would have been cleaner. It would have also required me to look up some of the strange d3 typings and involved a little refactor which, again, I was too pressed for time to prioritize.
- Make it less ugly. It's ugly. I wasn't trying to win a design award, but time permitting I would have added more animations and made the layout better.
- Make it responsive.

It also occurred to me in the shower this morning, and I  never Googled this, that I answered the HostBinding question wrong EVERYTIME it was asked. I remember using it now for scroll events. I'm reasonably sure it is used to capture DOM events that aren't included in the standard Angular feature set (window resize, scroll, etc). I'm kicking myself for that!

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
