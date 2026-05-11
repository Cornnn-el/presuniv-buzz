import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Announcement } from "@/types";

type AnnouncementContextType = {
    announcements: Announcement[];
    addAnnouncement: (data: Announcement) => Promise<void>;
};

type SupabaseAnnouncement = {
    id: number;
    created_at: string;
    type: string;
    title: string;
    description: string;
    tags: string | null;
    person: string | null;
    location: string | null;
    event_date: string | null;
    deadline: string | null;
    release_date: string | null;
    link: string | null;
    featured: boolean | null;
};



const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

export const AnnouncementProvider = ({ children }: { children: ReactNode }) => {

    const [announcements, setAnnouncements] = useState<Announcement[]>([]);


    // ambil data dari Supabase
    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        const { data, error } = await supabase
            .from("announcements")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Supabase error:", error);
            return;
        }

        const mapped: Announcement[] =
            ((data as SupabaseAnnouncement[]) ?? []).map((item) => ({
                id: String(item.id),
                title: item.title,
                slug: item.title.toLowerCase().replace(/\s+/g, "-"),

                category: (item.type?.toLowerCase() as Announcement["category"]) || "academic",

                summary: item.description?.slice(0, 120) || "",
                body: item.description || "",

                organizer: {
                    name: item.person || "Unknown",
                    email: "unknown@email.com",
                    orgUnit: "General",
                },

                location: item.location
                    ? {
                        type: "physical",
                        address: item.location,
                    }
                    : undefined,


                tags: item.tags
                    ? item.tags.split(",").map((t) => t.trim())
                    : [],

                attachments: [],

                externalLinks: item.link
                    ? [{ label: "External Link", url: item.link }]
                    : [],

                startDateTime: item.event_date || undefined,
                deadline: item.deadline || undefined,

                createdAt: item.created_at,
                updatedAt: item.created_at,

                releaseDate: item.release_date || undefined,

                status: "published",

                featured: item.featured || false,
            }));

        setAnnouncements(mapped);
    };



    const addAnnouncement = async (data: Announcement) => {
        const { error } = await supabase.from("announcements").insert({
            type: data.category,
            title: data.title,
            description: data.body,
            tags: data.tags.join(", "),
            person: data.organizer.name,
            location: data.location?.address || null,
            event_date: data.startDateTime || null,
            deadline: data.deadline || null,
            release_date: data.releaseDate || null,
            link: data.externalLinks?.[0]?.url || null,
            featured: data.featured || false,
        });

        if (error) {
            console.error("Insert error:", error);
            return;
        }

        // refresh dari database
        fetchAnnouncements();
    };


    return (
        <AnnouncementContext.Provider value={{ announcements, addAnnouncement }}>
            {children}
        </AnnouncementContext.Provider>
    );
};

export const useAnnouncements = () => {
    const context = useContext(AnnouncementContext);
    if (!context) {
        throw new Error("useAnnouncements must be used inside AnnouncementProvider");
    }
    return context;
};
