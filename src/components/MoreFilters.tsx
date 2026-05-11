import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface MoreFiltersProps {
    onApply: (filters: FiltersState) => void;
}

export interface FiltersState {
    today: boolean;
    thisWeek: boolean;
    thisMonth: boolean;
    upcoming: boolean;
    closingSoon: boolean;
}

export function MoreFilters({ onApply }: MoreFiltersProps) {
    const [filters, setFilters] = useState<FiltersState>({
        today: false,
        thisWeek: false,
        thisMonth: false,
        upcoming: false,
        closingSoon: false,
    });

    const toggle = (key: keyof FiltersState) => {
        setFilters((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                </Button>
            </SheetTrigger>

            <SheetContent className="w-[380px] sm:w-[420px] bg-background/95 backdrop-blur-md border-l shadow-2xl">
                <SheetHeader>
                    <SheetTitle className="text-lg font-semibold flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Filters
                    </SheetTitle>

                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Date */}
                    <div className="bg-muted/40 rounded-lg p-4 space-y-3 border">
                        <h3 className="font-semibold text-sm tracking-wide text-muted-foreground uppercase">
                            Date
                        </h3>

                        <div className="flex items-center gap-3">
                            <Checkbox
                                checked={filters.today}
                                onCheckedChange={() => toggle("today")}
                            />
                            <Label className="text-sm">Today</Label>
                        </div>

                        <div className="flex items-center gap-3">
                            <Checkbox
                                checked={filters.thisWeek}
                                onCheckedChange={() => toggle("thisWeek")}
                            />
                            <Label className="text-sm">This Week</Label>
                        </div>

                        <div className="flex items-center gap-3">
                            <Checkbox
                                checked={filters.thisMonth}
                                onCheckedChange={() => toggle("thisMonth")}
                            />
                            <Label className="text-sm">This Month</Label>
                        </div>
                    </div>


                    {/* Status */}
                    <div className="bg-muted/40 rounded-lg p-4 space-y-3 border">
                        <h3 className="font-semibold text-sm tracking-wide text-muted-foreground uppercase">
                            Status
                        </h3>

                        <div className="flex items-center gap-3">
                            <Checkbox
                                checked={filters.upcoming}
                                onCheckedChange={() => toggle("upcoming")}
                            />
                            <Label className="text-sm">Upcoming</Label>
                        </div>

                        <div className="flex items-center gap-3">
                            <Checkbox
                                checked={filters.closingSoon}
                                onCheckedChange={() => toggle("closingSoon")}
                            />
                            <Label className="text-sm">Closing Soon</Label>
                        </div>
                    </div>


                    {/* Buttons */}
                    <div className="flex gap-2 pt-4">
                        <Button
                            variant="outline"
                            onClick={() =>
                                setFilters({
                                    today: false,
                                    thisWeek: false,
                                    thisMonth: false,
                                    upcoming: false,
                                    closingSoon: false,
                                })
                            }
                        >
                            Reset
                        </Button>

                        <Button
                            onClick={() => onApply(filters)}
                            className="bg-accent text-accent-foreground"
                        >
                            Apply
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
