import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";                                  //baru
import { useNavigate } from "react-router-dom";                                //baru
import { useAnnouncements } from "@/context/AnnouncementContext";              //baru
import { useState } from "react";                                              //baru
import { Announcement } from "@/types";                                        //baru
import type { AnnouncementForm } from "@/types";                               //baru
import type { AnnouncementCategory } from "@/types";                           //baru
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { sendAnnouncementEmail } from "@/lib/sendEmail";
import { supabase } from "@/lib/supabase";


const SubmitAnnouncement = () => {
    const navigate = useNavigate();                                       //baru
    const { addAnnouncement } = useAnnouncements();                       //baru  
    const [openConfirm, setOpenConfirm] = useState(false);                //baru

    const [form, setForm] = useState<AnnouncementForm>({
        category: "academic",
        title: "",
        description: "",
        personInCharge: "",
        location: "",
        dateTime: "",
        deadline: "",
        releaseDate: "",
        link: "",
        tags: "",
    });

    const [featured, setFeatured] = useState(false);


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const submitAnnouncement = async () => {

        const newAnnouncement: Announcement = {
            id: Date.now().toString(),
            title: form.title,
            slug: form.title.toLowerCase().replace(/\s+/g, "-"),
            category: form.category,
            summary: form.description.slice(0, 120),
            body: form.description,

            organizer: {
                name: form.personInCharge,
                email: "dummy@email.com",
                orgUnit: "General",
            },

            tags: form.tags
                ? form.tags
                    .split(",")
                    .map(tag => tag.trim())
                    .filter(Boolean)
                : [],

            attachments: [],

            externalLinks: form.link
                ? [{ label: "External Link", url: form.link }]
                : [],

            createdAt: new Date().toISOString(),

            releaseDate: form.releaseDate
                ? form.releaseDate + "T23:59:59"
                : new Date().toISOString(),


            updatedAt: new Date().toISOString(),
            status: "published",
            featured,

            deadline: form.deadline || undefined,
            startDateTime: form.dateTime || undefined,

            location: form.location
                ? {
                    type: "physical",
                    address: form.location,
                }
                : undefined,

        };

        try {
            await addAnnouncement(newAnnouncement);

            // ambil email subscriber dari database
            const { data: subscribers, error: subError } = await supabase
                .from("subscribers")
                .select("email");

            if (subError) {
                console.error("Error ambil subscribers:", subError);
                return;
            }

            const subscriberEmails = subscribers.map((s) => s.email);

            const { data, error } = await supabase.functions.invoke("send-announcement", {
                body: {
                    emails: subscriberEmails,
                    title: newAnnouncement.title,
                    content: newAnnouncement.body,
                },
            });

            console.log("FUNCTION DATA:", data);
            console.log("FUNCTION ERROR:", error);

            navigate("/hub");
        } catch (err) {
            console.error(err);
        }
    };



    return (
        <div className="min-h-screen bg-background">
            <Header />                                                   {/*baru*/}
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Page Title */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        Submit Announcement
                    </h1>
                    <p className="text-muted-foreground">
                        Fill in the form below to publish a new announcement.
                    </p>
                </div>

                {/* Form Card */}
                <div className="rounded-2xl border border-border bg-card p-8 shadow-md space-y-8">          {/*baru*/}

                    {/* Announcement Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                            Type of Announcement
                        </label>

                        <Select
                            value={form.category}
                            onValueChange={(value: AnnouncementCategory) =>
                                setForm(prev => ({
                                    ...prev,
                                    category: value,
                                }))
                            }
                        >

                            <SelectTrigger className="bg-background border border-border focus:border-accent focus:ring-accent">                           {/*baru*/}
                                <SelectValue placeholder="Select announcement type" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="academic">Academic</SelectItem>
                                <SelectItem value="event">Event</SelectItem>
                                <SelectItem value="contest">Contest</SelectItem>
                                <SelectItem value="organization">Organization</SelectItem>
                                <SelectItem value="career">Career</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="scholarship">Scholarship</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>


                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                            Title
                        </label>
                        {/*}
                        <Input
                            placeholder="Enter announcement title"
                            className="bg-background/40 border-white/10 focus:border-accent focus:ring-accent"
                        />
                        */}
                        <Input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Enter announcement title"
                            className="bg-background border border-border focus:border-accent focus:ring-accent"
                        />
                    </div>


                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                            Description
                        </label>
                        {/*}
                        <Textarea
                            placeholder="Write announcement details"
                            rows={4}
                            className="bg-background/40 border-white/10 focus:border-accent focus:ring-accent"
                        />
                        */}
                        <Textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Write announcement details"
                            rows={4}
                            className="bg-background border border-border focus:border-accent focus:ring-accent"
                        />
                    </div>


                    {/* Tags */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                            Tags
                        </label>
                        <Input
                            name="tags"
                            value={form.tags}
                            onChange={handleChange}
                            placeholder="e.g. academic-calendar, important, policy-change"
                            className="bg-background border border-border focus:border-accent focus:ring-accent"
                        />
                        <p className="text-xs text-muted-foreground">
                            Separate tags with commas
                        </p>
                        {/* 👇 TAG PREVIEW DI SINI */}
                        {form.tags && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {form.tags.split(",").map(tag => (
                                    <span
                                        key={tag}
                                        className="px-2 py-0.5 text-xs rounded border border-border bg-muted"
                                    >
                                        {tag.trim()}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>


                    {/* In Charge Person */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                            Person in Charge
                        </label>
                        {/*}
                        <Input
                            placeholder="Name / Department"
                            className="bg-background/40 border-white/10"
                        />
                        */}
                        <Input
                            name="personInCharge"
                            value={form.personInCharge}
                            onChange={handleChange}
                            placeholder="Name / Department"
                            className="bg-background border border-border focus:border-accent focus:ring-accent"
                        />
                    </div>


                    {/* Location */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                            Location
                        </label>
                        {/*
                        <Input
                            placeholder="Event location (optional)"
                            className="bg-background/40 border-white/10"
                        />
                        */}
                        <Input
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="Event location (optional)"
                            className="bg-background border border-border focus:border-accent focus:ring-accent"
                        />
                    </div>


                    {/* Date & Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Date & Time
                            </label>
                            {/*
                            <Input
                                type="datetime-local"
                                className="bg-background/40 border-white/10"
                            />
                            */}
                            <Input
                                type="datetime-local"
                                name="dateTime"
                                value={form.dateTime}
                                onChange={handleChange}
                                min={new Date().toISOString().slice(0, 16)}
                                max="2035-12-31T23:59"
                                className="bg-background border border-border focus:border-accent focus:ring-accent dark:[color-scheme:dark]"
                            />
                        </div>


                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Deadline
                            </label>
                            {/*
                            <Input
                                type="date"
                                className="bg-background/40 border-white/10"
                            />
                            */}
                            <Input
                                type="date"
                                name="deadline"
                                value={form.deadline}
                                onChange={handleChange}
                                min={new Date().toISOString().split("T")[0]}
                                max="2035-12-31"
                                className="bg-background border border-border focus:border-accent focus:ring-accent dark:[color-scheme:dark]"
                            />
                        </div>
                    </div>


                    {/* Release Date */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                            Date of Release
                        </label>
                        {/*
                        <Input
                            type="date"
                            className="bg-background/40 border-white/10"
                        />
                        */}
                        <Input
                            type="date"
                            name="releaseDate"
                            value={form.releaseDate}
                            onChange={handleChange}
                            min={new Date().toISOString().split("T")[0]}
                            max="2035-12-31"
                            className="bg-background border border-border focus:border-accent focus:ring-accent dark:[color-scheme:dark]"
                        />
                    </div>


                    {/* External Link */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                            External Link
                        </label>
                        {/*
                        <Input
                            placeholder="https://example.com"
                            className="bg-background/40 border-white/10"
                        />
                        */}
                        <Input
                            name="link"
                            value={form.link}
                            onChange={handleChange}
                            placeholder="https://example.com"
                            className="bg-background border border-border focus:border-accent focus:ring-accent"
                        />
                    </div>

                    {/* Featured */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={featured}
                            onChange={(e) => setFeatured(e.target.checked)}
                            className="w-4 h-4"
                        />
                        <label className="text-sm font-medium">
                            Mark as Featured Announcement
                        </label>
                    </div>



                    {/* Divider */}
                    <div className="border-t border-white/10 pt-6 flex justify-end gap-3">
                        <Button
                            variant="outline"
                            className="border-white/20 hover:bg-white/5"
                            onClick={() => navigate("/hub")}                                        //baru
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-accent text-accent-foreground hover:bg-accent-hover"
                            onClick={() => setOpenConfirm(true)}
                        >
                            Submit Announcement
                        </Button>
                    </div>
                </div>
            </div>
            <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Submit this announcement?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Please make sure all information is correct before publishing.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel type="button">
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                submitAnnouncement();
                            }}
                        >
                            Yes, Submit
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default SubmitAnnouncement;
