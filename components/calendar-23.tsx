"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export default function Calendar23() {
    const [range, setRange] = React.useState<DateRange | undefined>(undefined);

    return (
        <div className="flex flex-row gap-3 p-3">
            <Label htmlFor="dates" className="">
                Compare to
            </Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="dates"
                        className="w-56 justify-between font-small"
                    >
                        {range?.from && range?.to
                            ? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
                            : "Select date"}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                >
                    <Calendar
                        mode="range"
                        selected={range}
                        captionLayout="dropdown"
                        onSelect={(range) => {
                            setRange(range);
                        }}
                    />
                    <div className="flex flex-col gap-2 p-2">
                        <Button
                            variant="outline"
                            className="w-full mt-2"
                            onClick={() => setRange(undefined)}
                        >
                            Clear selection
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
