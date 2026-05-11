import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface SortDropdownProps {
    value: string;
    onChange: (value: string) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort:</span>

            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-[160px] h-9">
                    <SelectValue placeholder="Newest" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="deadline">Deadline Soon</SelectItem>
                    <SelectItem value="title">Title A–Z</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
