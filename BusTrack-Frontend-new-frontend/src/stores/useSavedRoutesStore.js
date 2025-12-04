import { defineStore } from 'pinia'

export const useSavedRoutesStore = defineStore('savedRoutes', {
    state: () => ({
        /**
         * Array of saved route objects loaded from localStorage.
         * Each route contains id, origin, destination, and savedAt timestamp.
         * @type {Array<SavedRoute>}
         */
        routes: JSON.parse(localStorage.getItem('savedRoutes') || '[]'),
    }),
    getters: {
        /**
         * Returns all saved routes.
         * @param {Object} state - The store state
         * @returns {Array<SavedRoute>} Complete list of saved routes
         */
        getAllRoutes: (state) => state.routes,

        /**
         * Checks if a route with the given origin and destination already exists.
         * @param {Object} state - The store state
         * @returns {function(string, string): boolean} Function that takes origin and destination and returns existence status
         */
        routeExists: (state) => (origin, destination) => {
            return state.routes.some(
                route => route.origin === origin && route.destination === destination
            )
        }
    },
    actions: {
        /**
         * Adds a new route to the saved routes list.
         * Only adds the route if it doesn't already exist (based on origin and destination).
         * Automatically assigns an ID (timestamp) and savedAt timestamp, then persists to localStorage.
         *
         * @param {RoutePayload} route - Route object to save
         * @param {string} route.origin - Starting point/origin location of the route
         * @param {string} route.destination - End point/destination location of the route
         * @returns {boolean} true if route was added successfully, false if route already exists
         */
        addRoute(route) {
            if (!this.routeExists(route.origin, route.destination)) {
                const newRoute = {
                    id: Date.now(),
                    origin: route.origin,
                    destination: route.destination,
                    savedAt: new Date().toISOString(),
                }
                this.routes.unshift(newRoute)
                this.saveToLocalStorage()
                return true
            }
            return false
        },

        /**
         * Removes a specific route from the saved routes list.
         *
         * @param {number} routeId - Unique identifier of the route to remove
         * @returns {void}
         */
        removeRoute(routeId) {
            this.routes = this.routes.filter(route => route.id !== routeId)
            this.saveToLocalStorage()
        },

        /**
         * Persists the current routes array to localStorage.
         * Called automatically after every modification to maintain data consistency.
         * @returns {void}
         */
        saveToLocalStorage() {
            localStorage.setItem('savedRoutes', JSON.stringify(this.routes))
        }
    },
})