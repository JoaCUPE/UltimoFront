import { defineStore } from 'pinia'


export const useNotificationsStore = defineStore('notifications', {
    /**
     * Array of notification objects loaded from localStorage.
     * Each notification contains id, type, messageKey, messageParams, timestamp, priority, icon, and read status.
     * @type {Array<Notification>}
     */
    state: () => ({
        items: JSON.parse(localStorage.getItem('notifications') || '[]'),
    }),
    getters: {
        /**
         * Returns all stored notifications.
         * @param {Object} state - The store state
         * @returns {Array<Notification>} Complete list of notifications
         */
        getAllNotifications: (state) => state.items,

        /**
         * Returns the 10 most recent notifications.
         * @param {Object} state - The store state
         * @returns {Array<Notification>} Array of up to 10 recent notifications
         */
        recentNotifications: (state) => state.items.slice(0, 10)
    },
    actions: {
        /**
         * Creates and adds a new notification to the beginning of the items array.
         * Automatically assigns an ID (timestamp), default values, and persists to localStorage.
         *
         * @param {NotificationPayload} payload - Notification configuration object
         * @param {string} [payload.type='info'] - Notification type: 'info', 'success', 'warning', 'error'
         * @param {string} [payload.messageKey] - i18n translation key for the notification message
         * @param {Object} [payload.messageParams={}] - Parameters to interpolate into the i18n message
         * @param {string} [payload.priority='medium'] - Priority level: 'low', 'medium', 'high'
         * @param {string} [payload.icon='📍'] - Emoji or icon to display with the notification
         * @returns {void}
         */
        addNotification(payload) {
            const notification = {
                id: Date.now(),
                type: payload.type || 'info',

                messageKey: payload.messageKey || payload.message || 'notifications.messages.default',
                messageParams: payload.messageParams || {},
                timestamp: new Date().toISOString(),
                priority: payload.priority || 'medium',
                icon: payload.icon || '📍',
                read: false,
                ...payload,
            }
            this.items.unshift(notification)
            this.saveToLocalStorage()
        },


        /**
         * Notifies the user that a route has been saved to favorites.
         *
         * @param {string} routeName - Name of the saved route
         * @returns {void}
         */
        notifyRouteSaved(routeName) {
            this.addNotification({
                messageKey: 'notifications.messages.routeSaved',
                messageParams: { routeName },
                icon: '⭐',
                priority: 'medium'
            })
        },


        /**
         * Notifies the user that a route has been removed from favorites.
         *
         * @param {string} routeName - Name of the removed route
         * @returns {void}
         */
        notifyRouteRemoved(routeName) {
            this.addNotification({
                messageKey: 'notifications.messages.routeRemoved',
                messageParams: { routeName },
                icon: '🗑️',
                priority: 'low'
            })
        },

        /**
         * Notifies the user about an upcoming bus arrival (high priority).
         *
         * @param {string} busNumber - Bus identification number
         * @param {number} minutes - Minutes until the bus arrives
         * @returns {void}
         */
        notifyBusArriving(busNumber, minutes) {
            this.addNotification({
                messageKey: 'notifications.messages.busArriving',
                messageParams: { busNumber, minutes },
                icon: '🚌',
                priority: 'high'
            })
        },

        /**
         * Notifies the user that a favorite has been added.
         * @returns {void}
         */
        notifyFavoriteAdded() {
            this.addNotification({
                messageKey: 'notifications.messages.favoriteAdded',
                icon: '⭐',
                priority: 'medium'
            })
        },

        /**
         * Notifies the user that a favorite has been removed.
         * @returns {void}
         */
        notifyFavoriteRemoved() {
            this.addNotification({
                messageKey: 'notifications.messages.favoriteRemoved',
                icon: '🗑️',
                priority: 'low'
            })
        },

        /**
         * Marks a specific notification as read and persists the change.
         *
         * @param {number} notificationId - Unique identifier of the notification
         * @returns {void}
         */
        markAsRead(notificationId) {
            const notification = this.items.find(item => item.id === notificationId)
            if (notification) {
                notification.read = true
                this.saveToLocalStorage()
            }
        },

        /**
         * Removes a specific notification from the store.
         *
         * @param {number} notificationId - Unique identifier of the notification to remove
         * @returns {void}
         */
        removeNotification(notificationId) {
            this.items = this.items.filter(item => item.id !== notificationId)
            this.saveToLocalStorage()
        },

        /**
         * Clears all notifications from the store and localStorage.
         * @returns {void}
         */
        clearAll() {
            this.items = []
            this.saveToLocalStorage()
        },

        /**
         * Persists the current notifications array to localStorage.
         * Called automatically after every modification to maintain data consistency.
         * @returns {void}
         */
        saveToLocalStorage() {
            localStorage.setItem('notifications', JSON.stringify(this.items))
        }
    },
})
