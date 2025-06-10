"use client"

import * as React from "react"
import { DayPicker, DayPickerProps, CaptionProps } from "react-day-picker"
import { cn } from "../../lib/utils"

export type CalendarProps = DayPickerProps

function CustomCaption(props: CaptionProps) {
  // Only show dropdowns for the first calendar (displayIndex === 0)
  if (props.displayIndex && props.displayIndex > 0) {
    return null;
  }
  return (
    <div className="flex items-center gap-2">
      {props.captionElement}
    </div>
  );
}

export function Calendar({ className, ...props }: CalendarProps) {
  return (
    <DayPicker
      className={cn(
        "p-3 bg-background rounded-lg border shadow-md w-full max-w-2xl",
        className
      )}
      captionLayout="dropdown"
      components={{
        Caption: CustomCaption,
      }}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "space-y-2",
        caption: "flex justify-between items-center mb-2 px-2",
        caption_label:
          "text-base font-semibold text-foreground dark:text-gray-100 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-primary",
        nav: "flex items-center gap-1",
        nav_button:
          "h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary text-foreground dark:text-gray-100",
        table: "w-full border-collapse",
        head_row: "",
        head_cell:
          "text-xs font-medium text-muted-foreground dark:text-gray-400 px-1 py-1",
        row: "",
        cell: cn(
          "h-9 w-9 p-0 text-center align-middle relative",
          "[&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md"
        ),
        day: cn(
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md transition-colors",
          "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary",
          "text-foreground dark:text-gray-100"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90",
        day_today:
          "border border-primary bg-accent text-accent-foreground",
        day_outside:
          "text-muted-foreground opacity-50",
        day_disabled:
          "text-muted-foreground opacity-30 cursor-not-allowed",
        day_range_start:
          "bg-primary text-primary-foreground rounded-l-md",
        day_range_end:
          "bg-primary text-primary-foreground rounded-r-md",
        day_range_middle:
          "bg-primary/20 text-primary rounded-none",
      }}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar" 