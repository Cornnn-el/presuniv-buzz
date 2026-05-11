import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import logoPU from "@/assets/PU_Logo.png";

{/* Footer */ }

export function Footer() {
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const handleSubscribe = async () => {
        if (!email) {
            toast({
                title: "Email required ⚠️",
                description: "Please enter your email first.",
                duration: 2500,
            });
            return;
        }

        const { error } = await supabase
            .from("subscribers")
            .insert([{ email }]);

        if (error) {
            toast({
                title: "Error ❌",
                description: error.message,
                duration: 3000,
            });
            return;
        }

        toast({
            title: "Subscribed 🎉",
            description: "You will receive updates soon.",
            duration: 3000,
        });

        setEmail("");
    };

    return (
        <footer className="border-t bg-muted/30 mt-16">
            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

                    {/*Left*/}
                    <div className="max-w-xs">
                        <div className="flex items-center space-x-3 mb-4 w-fit">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden bg-white">
                                <img
                                    src={logoPU}
                                    alt="President University Logo"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <span className="font-semibold">President University</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Your central hub for campus announcements and updates.
                        </p>
                    </div>

                    {/*Quick Links*/}
                    <div>
                        <h4 className="font-semibold mb-3">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link to="/submit-announcement" onClick={() => window.scrollTo(0, 0)} className="hover:text-foreground transition-colors">
                                    Submit Announcement
                                </Link>
                            </li>

                            <li>
                                <Link to="/calendar" className="hover:text-foreground transition-colors">
                                    Calendar View
                                </Link>
                            </li>

                            {/* <li>
                                <Link to="/" className="hover:text-foreground transition-colors">
                                    RSS Feeds
                                </Link>
                            </li> */}

                            <li>
                                <Link to="/about" className="hover:text-foreground transition-colors">
                                    About
                                </Link>
                            </li>
                        </ul>
                    </div>


                    {/*Contact*/}
                    <div>
                        <h4 className="font-semibold mb-3">Contact</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>announcements@president.ac.id</li>
                            <li>(021) 89109763</li>
                            <li>Jababeka Education Park</li>
                            <li>North Cikarang, West Java</li>
                        </ul>
                    </div>


                    {/*Subscribe*/}
                    <div>
                        <h4 className="font-semibold mb-3">Subscribe</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                            Get notified about new announcements
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 px-3 py-2 rounded-md border bg-background text-sm"
                            />
                            <Button size="sm" onClick={handleSubscribe}>
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-6 mt-6 text-center text-sm text-muted-foreground">
                    <p>&copy; 2026 Synapse. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}