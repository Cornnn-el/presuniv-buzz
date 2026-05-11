import { useState } from "react";
import { Header } from "@/components/Header";
import { useAnnouncements } from "@/context/AnnouncementContext";
import { CalendarMonth } from "@/components/calendar/CalendarMonth";

const CalendarPage = () => {
    const { announcements } = useAnnouncements();

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-11

    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    const years = [];
    for (let i = currentYear; i >= currentYear - 2; i--) {
        years.push(i);
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-4">
                    Announcement Calendar
                </h1>

                <p className="text-muted-foreground mb-6">
                    View announcements based on release dates and deadlines.
                </p>

                {/* 🔥 Month & Year Selector */}
                <div className="flex gap-4 mb-6">
                    {/* Month */}
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="px-4 py-2 rounded-md border bg-background"
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i}>
                                {new Date(0, i).toLocaleString("default", {
                                    month: "long",
                                })}
                            </option>
                        ))}
                    </select>

                    {/* Year */}
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="px-4 py-2 rounded-md border bg-background"
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 🔥 Dynamic Calendar */}
                <CalendarMonth
                    year={selectedYear}
                    month={selectedMonth}
                    announcements={announcements}
                />
            </div>
        </div>
    );
};

export default CalendarPage;
