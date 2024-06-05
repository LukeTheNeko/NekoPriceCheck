import { Event } from "#base";
import { ActivityType } from "discord.js";

const activityMessages = [
    "Competitive",
    "Danger Zone",
    "Deathmatch",
    "Wingman",
    "Casual",
    "Arms Race",
    "Demolition",
    "Flying Scoutsman",
    "Retakes"
];

export default new Event({
    name: "ready",
    event: "ready",
    once: true,
    async run(client) {
        try {
            const updateActivity = () => {
                const randomMessage = activityMessages[Math.floor(Math.random() * activityMessages.length)];

                client.user.setPresence({
                    activities: [{ name: randomMessage, type: ActivityType.Playing }],
                    status: 'online',
                });
            };

            updateActivity();

            setInterval(updateActivity, 30 * 60 * 1000);

        } catch (error) {
            console.error("Ocorreu um erro:", error);
        }
    },
});