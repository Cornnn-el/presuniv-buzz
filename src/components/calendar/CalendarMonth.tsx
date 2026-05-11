import { cn } from "@/lib/utils";
import { Announcement } from "@/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



interface CalendarMonthProps {
    year: number;
    month: number;
    announcements: Announcement[];
}

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const CalendarMonth = ({ year, month, announcements, }: CalendarMonthProps) => {
    // tanggal pertama di bulan ini
    const firstDayOfMonth = new Date(year, month, 1);

    // hari apa tanggal 1 jatuh (0-6)
    const startDay = firstDayOfMonth.getDay();

    // total hari di bulan ini
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // bikin array grid
    const cells: (number | null)[] = [];

    // isi kosong sebelum tanggal 1
    for (let i = 0; i < startDay; i++) {
        cells.push(null);
    }

    // isi tanggal 1 - akhir bulan
    for (let day = 1; day <= daysInMonth; day++) {
        cells.push(day);
    }

    const getRelevantDate = (a: Announcement): Date | null => {
        if (a.startDateTime) {
            return new Date(a.startDateTime);
        }

        if (a.deadline) {
            return new Date(a.deadline);
        }

        if (a.releaseDate) {
            return new Date(a.releaseDate);
        }

        return null;
    };



    const getAnnouncementsForDay = (day: number) => {
        const now = new Date();

        return announcements.filter((a) => {
            // 🔥 hide upcoming (belum release)
            if (a.releaseDate && new Date(a.releaseDate) > now) {
                return false;
            }

            const date = getRelevantDate(a);
            if (!date) return false;

            return (
                date.getFullYear() === year &&
                date.getMonth() === month &&
                date.getDate() === day
            );
        });
    };


    const [selectedDayEvents, setSelectedDayEvents] = useState<Announcement[] | null>(null);
    const navigate = useNavigate();


    return (
        <div className="w-full">
            {/* Header hari */}
            <div className="grid grid-cols-7 text-center text-sm font-medium text-muted-foreground mb-2">
                {WEEK_DAYS.map((day) => (
                    <div key={day}>{day}</div>
                ))}
            </div>

            {/* Grid kalender */}
            <div className="grid grid-cols-7 gap-2">
                {cells.map((day, index) => {
                    const dayAnnouncements = day ? getAnnouncementsForDay(day) : [];

                    const today = new Date();
                    const isToday =
                        day !== null &&
                        today.getFullYear() === year &&
                        today.getMonth() === month &&
                        today.getDate() === day;

                    return (
                        <div
                            key={index}
                            className={cn(
                                "h-24 rounded-lg border p-2 text-sm flex flex-col gap-1",
                                day === null && "bg-muted/30",
                                isToday
                                    ? "border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/30"
                                    : "border-border"
                            )}
                        >
                            {day && (
                                <>
                                    <div className={cn("font-medium", isToday && "text-blue-400 font-bold")}>
                                        {day}
                                    </div>


                                    {dayAnnouncements.slice(0, 2).map((a) => {
                                        const isDeadline = !a.startDateTime && !!a.deadline;

                                        return (
                                            <div
                                                key={a.id}
                                                onClick={() => {
                                                    navigate("/", { state: { scrollToId: a.id } });
                                                }}
                                                className={cn(
                                                    "text-[10px] truncate rounded px-1 py-[2px] font-medium cursor-pointer hover:opacity-80",
                                                    isDeadline
                                                        ? "bg-red-600 text-white"
                                                        : "bg-emerald-600 text-white"
                                                )}
                                            >
                                                {a.title}
                                            </div>
                                        );
                                    })}

                                    {dayAnnouncements.length > 2 && (
                                        <div
                                            onClick={() => setSelectedDayEvents(dayAnnouncements)}
                                            className="text-[10px] text-muted-foreground hover:underline cursor-pointer"
                                        >
                                            +{dayAnnouncements.length - 2} more
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
            {/* Modal */}
            {selectedDayEvents && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background border border-border rounded-lg p-4 w-[400px] max-h-[70vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="font-semibold text-sm">Events</h2>
                            <button
                                onClick={() => setSelectedDayEvents(null)}
                                className="text-xs text-muted-foreground hover:underline"
                            >
                                Close
                            </button>
                        </div>

                        <div className="flex flex-col gap-2">
                            {selectedDayEvents.map((a) => {
                                const isDeadline = !a.startDateTime && !!a.deadline;

                                return (
                                    <div
                                        key={a.id}
                                        onClick={() => {
                                            setSelectedDayEvents(null); // tutup modal dulu
                                            navigate("/", { state: { scrollToId: a.id } });
                                        }}
                                        className={cn(
                                            "text-xs rounded px-2 py-1 font-medium cursor-pointer hover:opacity-80",
                                            isDeadline
                                                ? "bg-red-600 text-white"
                                                : "bg-emerald-600 text-white"
                                        )}
                                    >
                                        {a.title}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

