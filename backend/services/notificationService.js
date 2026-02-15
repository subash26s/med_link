const path = require('path');
const { readJson, writeJson } = require('../utils/jsonStore');

const DATA_DIR = path.join(__dirname, '../data');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');

const addNotification = async (notification) => {
    try {
        const notifications = await readJson(NOTIFICATIONS_FILE);
        const newNotification = {
            id: `NTF${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            created_at: new Date().toISOString(),
            read: false,
            ...notification
        };
        notifications.unshift(newNotification);
        await writeJson(NOTIFICATIONS_FILE, notifications);
        return newNotification;
    } catch (error) {
        console.error("Error adding notification:", error);
        return null;
    }
};

const getNotifications = async ({ target_role, target_id }) => {
    try {
        const notifications = await readJson(NOTIFICATIONS_FILE);
        return notifications.filter(n =>
            n.target_role === target_role &&
            (n.target_id === target_id || n.target_id === 'all')
        );
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
};

const markRead = async ({ id, target_role, target_id }) => {
    try {
        const notifications = await readJson(NOTIFICATIONS_FILE);
        const index = notifications.findIndex(n => n.id === id);

        if (index !== -1) {
            // Verify ownership
            if (notifications[index].target_role === target_role && notifications[index].target_id === target_id) {
                notifications[index].read = true;
                await writeJson(NOTIFICATIONS_FILE, notifications);
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error("Error marking notification read:", error);
        return false;
    }
};

module.exports = {
    addNotification,
    getNotifications,
    markRead
};
