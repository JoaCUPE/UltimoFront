import { defineStore } from 'pinia'

export const useAlertsStore = defineStore('alerts', {
    /**
     * Array of alert objects loaded from localStorage.
     * Each alert contains id, title, busId, route, severity, type, status, and timestamp.
     * @type {Array<Alert>}
     */
    state: () => ({
        items: JSON.parse(localStorage.getItem('alerts') || '[]'),
    }),
    getters: {
        /**
         * Returns all stored alerts.
         * @param {Object} state - The store state
         * @returns {Array<Alert>} Complete list of alerts
         */
        getAllAlerts: (state) => state.items,

        /**
         * Returns only the pending alerts (useful for badges or counters).
         * @param {Object} state - The store state
         * @returns {Array<Alert>} List of unresolved alerts
         */
        getPendingAlerts: (state) => state.items.filter(item => item.status === 'pending'),

        /**
         * Returns the 10 most recent alerts.
         * @param {Object} state - The store state
         * @returns {Array<Alert>} Array of up to 10 recent alerts
         */
        recentAlerts: (state) => state.items.slice(0, 10)
    },
    actions: {
        /**
         * Creates and adds a new alert to the beginning of the items array.
         * Automatically assigns an ID, default status, and persists to localStorage.
         *
         * @param {AlertPayload} payload - Alert configuration object
         * @param {string} payload.title - The main title of the alert (or translation key)
         * @param {string} [payload.busId] - ID of the bus involved (e.g., '204')
         * @param {string} [payload.route] - Name of the route (e.g., 'Ruta Miraflores')
         * @param {string} [payload.type='info'] - Alert type: 'detour', 'traffic', 'incident'
         * @param {string} [payload.severity='medium'] - Severity: 'low', 'medium', 'high'
         * @returns {void}
         */
        addAlert(payload) {
            const alert = {
                id: Date.now(),
                title: payload.title || 'Alerta del Sistema',
                busId: payload.busId || 'N/A',
                route: payload.route || 'Sin Ruta',
                type: payload.type || 'info',
                severity: payload.severity || 'medium',
                status: 'pending', // Default status is always pending upon creation
                timestamp: new Date().toISOString(),
                ...payload,
            }
            this.items.unshift(alert)
            this.saveToLocalStorage()
        },

        /**
         * Reports a Route Detour (High Priority).
         * Simulates the 'Desvío de Ruta Detectado' from Figma.
         *
         * @param {string} busId - Bus identification
         * @param {string} routeName - Route name
         * @returns {void}
         */
        reportRouteDetour(busId, routeName) {
            this.addAlert({
                title: 'Desvío de Ruta Detectado', // O usa 'alerts.types.detour' si usas i18n
                busId: busId,
                route: routeName,
                type: 'detour',
                severity: 'high'
            })
        },

        /**
         * Reports Heavy Traffic (Medium Priority).
         * Simulates the 'Tráfico Intenso' from Figma.
         *
         * @param {string} busId - Bus identification
         * @param {string} routeName - Route name
         * @returns {void}
         */
        reportHeavyTraffic(busId, routeName) {
            this.addAlert({
                title: 'Tráfico Intenso',
                busId: busId,
                route: routeName,
                type: 'traffic',
                severity: 'medium'
            })
        },

        /**
         * Reports a Minor Delay (Low Priority).
         * Simulates the 'Retraso Menor' from Figma.
         *
         * @param {string} busId - Bus identification
         * @param {string} routeName - Route name
         * @returns {void}
         */
        reportMinorDelay(busId, routeName) {
            this.addAlert({
                title: 'Retraso Menor',
                busId: busId,
                route: routeName,
                type: 'delay',
                severity: 'low'
            })
        },

        /**
         * Marks a specific alert as resolved and persists the change.
         *
         * @param {number} alertId - Unique identifier of the alert
         * @returns {void}
         */
        markAsResolved(alertId) {
            const alert = this.items.find(item => item.id === alertId)
            if (alert) {
                alert.status = 'resolved'
                this.saveToLocalStorage()
            }
        },

        /**
         * Removes a specific alert from the store.
         *
         * @param {number} alertId - Unique identifier of the alert to remove
         * @returns {void}
         */
        removeAlert(alertId) {
            this.items = this.items.filter(item => item.id !== alertId)
            this.saveToLocalStorage()
        },

        /**
         * Clears all alerts from the store and localStorage.
         * @returns {void}
         */
        clearAll() {
            this.items = []
            this.saveToLocalStorage()
        },

        /**
         * Persists the current alerts array to localStorage.
         * Called automatically after every modification.
         * @returns {void}
         */
        saveToLocalStorage() {
            localStorage.setItem('alerts', JSON.stringify(this.items))
        }
    },
})