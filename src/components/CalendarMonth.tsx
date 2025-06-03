
import { useState } from "react";
import { cn } from "@/lib/utils";
import { isToday, isPast, isFuture, format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";

interface CalendarMonthProps {
  year: number;
  month: number; // 0-based (0 = January)
  monthName: string;
}

const CalendarMonth = ({ year, month, monthName }: CalendarMonthProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<{[key: string]: string}>({});

  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(new Date(year, month));
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = getDay(monthStart);
  
  // Create empty cells for days before the month starts
  const emptyCells = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleNoteChange = (date: Date, note: string) => {
    const dateKey = format(date, "yyyy-MM-dd");
    setNotes(prev => ({
      ...prev,
      [dateKey]: note
    }));
  };

  const getDateNote = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return notes[dateKey] || "";
  };

  return (
    <div className="p-4">
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before month starts */}
        {emptyCells.map((_, index) => (
          <div key={`empty-${index}`} className="h-8" />
        ))}
        
        {/* Actual days */}
        {days.map((date) => {
          const dayNumber = format(date, "d");
          const isCurrentDay = isToday(date);
          const isPastDay = isPast(date) && !isCurrentDay;
          const isFutureDay = isFuture(date);
          const hasNote = getDateNote(date).length > 0;
          
          return (
            <button
              key={format(date, "yyyy-MM-dd")}
              onClick={() => handleDateClick(date)}
              className={cn(
                "h-8 w-8 text-xs rounded-sm transition-all duration-200 hover:scale-105 relative",
                "flex items-center justify-center",
                {
                  // Past days - muted
                  "text-gray-300 bg-gray-50 hover:bg-gray-100": isPastDay,
                  
                  // Today - highlighted
                  "bg-blue-500 text-white font-medium shadow-md": isCurrentDay,
                  
                  // Future days - normal
                  "text-gray-700 hover:bg-gray-100 hover:text-gray-900": isFutureDay,
                  
                  // Selected date
                  "ring-2 ring-blue-300": selectedDate && format(selectedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"),
                }
              )}
            >
              {dayNumber}
              {hasNote && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Note input for selected date */}
      {selectedDate && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs font-medium text-gray-600 mb-2">
            {format(selectedDate, "MMMM d, yyyy")}
          </div>
          <textarea
            placeholder="Add a note for this day..."
            value={getDateNote(selectedDate)}
            onChange={(e) => handleNoteChange(selectedDate, e.target.value)}
            className="w-full text-xs border border-gray-200 rounded px-2 py-1 resize-none"
            rows={2}
          />
        </div>
      )}
    </div>
  );
};

export default CalendarMonth;
