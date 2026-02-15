const notificationService = require('../services/notificationService');

exports.getNotifications = async (req, res) => {
    try {
        const { target_role, target_id } = req.query;
        if (!target_role || !target_id) {
            return res.status(400).json({ success: false, message: "Missing target_role or target_id" });
        }

        const notifications = await notificationService.getNotifications({ target_role, target_id });
        res.json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id, target_role, target_id } = req.body;
        const success = await notificationService.markRead({ id, target_role, target_id });
        res.json({ success });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
