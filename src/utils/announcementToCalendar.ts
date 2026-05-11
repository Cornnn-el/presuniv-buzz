import { Announcement, CalendarEvent } from "@/types";

export const mapAnnouncementsToEvents = (
    announcements: Announcement[]
): CalendarEvent[] => {
    const events: CalendarEvent[] = [];

    announcements.forEach((a) => {
        // 📢 Published / Created
        events.push({
            id: `${a.id}-created`,
            title: a.title,
            date: a.createdAt.split("T")[0],
            type: "release",
        });

        // ⏰ Deadline
        if (a.deadline) {
            events.push({
                id: `${a.id}-deadline`,
                title: a.title,
                date: a.deadline.split("T")[0],
                type: "deadline",
            });
        }

        // 📅 Event date
        if (a.startDateTime) {
            events.push({
                id: `${a.id}-event`,
                title: a.title,
                date: a.startDateTime.split("T")[0],
                type: "event",
            });
        }
    });

    return events;
};
