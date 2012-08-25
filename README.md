# Quoteboard

A simple quote board or wall of shame for keeping track of things that your friends/colleagues/family say.

Originally created as a introduction to node.js, I'd love for it to be useful enough that others end up using it.

## Roadmap / TODO

 * Fix the `getSince()` for the MongoStore
 * Add the ability to provide context for quotes
 * Auto-completion for former "authors"
 * Create more appealing default theme
     * Make the new quote button less in the way
 * Create branch with image upload support


## Done items

 * Add client-side validation (done)
 * Add server-side validation (done)
 * Add persistence (MongoDB, in progress)
     * Create an ordering (id) for quotes (done - using createdOn date)
     * Create a config file for the app to set up db and environments (not doing this, using express config sections)
 * Add error handlings of ajax calls (done - could be better)
 * Make better looking
	 * Add transitions when adding new items (done)
	 * Improve the new quote form (better)
	 * Format the date properly (done but hacky)
 * Support multi-line quotes (done)
 * Create IDs for quotes so that we can periodically check if new ones exist (done)