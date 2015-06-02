# Sunrise Backend Challenge

*Ben Drucker*

## Instructions

```sh
$ GOOGLE_CLIENT_ID=${} GOOGLE_CLIENT_SECRET=${} npm start
```

The server starts at `http://localhost:8080`

```sh
$ GOOGLE_CLIENT_ID=${} GOOGLE_CLIENT_SECRET=${} npm test
```

## Design Decisions

### No `/authenticate/callback`

I chose to not include this route because it isn't necessarily. Authentication can be fully handled from the `/authenticate` route and the callback url can be passed in the query string when we redirect to Google for authorization.

### Streaming Responses

I invested a bunch of extra time in processing Google Calendar APIs streamingly for the `/calendars/<calendarID>/events` route. This means that the server:

* gets a page of events
* parses them and immediately sends them to the client
* repeats from the top until there are no pages left

This cuts down on the memory usage with large numbers of events. There are further optimizations that could be made to the stream interface, chiefly slowing down reads from Google when the client (of our API) is reading slowly. As is, once the initial request is made, pages of events are requested from Google until exhaustion, potentially faster than the client can read them.

The solution is substantially more complex than it could be since Google made the unfortunate choice to put paging data in the response body instead of in the header where it belongs.

### Dependencies

#### Hapi

Hapi is an amazing HTTP API framework from Walmart Labs that I've used for more than a year now. Express is essentially an array of callback functions that pass control in sequence. Hapi has a well defined request cycle and emphasizes configuration where Express often requires code. I've found this structure makes APIs substantially easier to maintain and avoids the creation of an in-house spaghetti framework on top of Express that I've seen a bunch of teams create.

#### Tape

I prefer tape to something like Mocha for a few important reasons:

1. No globals, so you don't need a special runner
2. Integrated assertions
3. No magic (e.g. `process.on('uncaughtException')`)

2 and 3 are closely related. A test runner like Mocha relies on test code throwing exceptions in order to fail a test. This can be problematic because your excecution halts when anything goes wrong. So you try to avoid having multiple assertions in a single test. And if you need to clean up state after a failure, you have to start stuffing that in `after` and `afterEach` blocks. 

Tape outputs raw TAP (test anything protocol) text because it integrates assertions with its test harness.
