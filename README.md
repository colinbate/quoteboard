# Quoteboard

A simple quote board or wall of shame for keeping track of things that your friends/colleagues/family say.

Originally created as a introduction to node.js, I'd love for it to be useful enough that others end up using it.

## Roadmap / TODO

 * Add client-side validation (done)
 * Add server-side validation (done)
 * Add persistence (MongoDB, in progress)
     * Create an ordering (id) for quotes
     * Create a config file for the app to set up db and environments
 * Add error handlings of ajax calls (done - could be better)
 * Make better looking
	 * Add transitions when adding new items (done)
	 * Improve the new quote form (better)
	 * Make the new quote button less obtrusive
	 * Format the date properly (done but hacky)
 * Add the ability to provide context for quotes
 * Support multi-line quotes (done)
 * Auto-completion for former "authors"
 * Create IDs for quotes so that we can periodically check if new ones exist (done)