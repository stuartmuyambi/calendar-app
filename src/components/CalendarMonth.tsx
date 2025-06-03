import { useState } from "react";
import { cn } from "@/lib/utils";
import { isToday, isPast, isFuture, format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from "date-fns";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarMonthProps {
  year: number;
  month: number; // 0-based (0 = January)
  monthName: string;
}

interface Note {
  id: string;
  date: string;
  text: string;
  category: 'personal' | 'work' | 'health' | 'other';
}

const CalendarMonth = ({ year, month, monthName }: CalendarMonthProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteText, setNewNoteText] = useState("");
  const [newNoteCategory, setNewNoteCategory] = useState<Note['category']>('personal');

  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(new Date(year, month));
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const firstDayOfWeek = getDay(monthStart);
  const emptyCells = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  const categories = {
    personal: { color: 'bg-blue-400', label: 'Personal' },
    work: { color: 'bg-green-400', label: 'Work' },
    health: { color: 'bg-red-400', label: 'Health' },
    other: { color: 'bg-purple-400', label: 'Other' }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const addNote = () => {
    if (newNoteText.trim() && selectedDate) {
      const newNote: Note = {
        id: Date.now().toString(),
        date: format(selectedDate, "yyyy-MM-dd"),
        text: newNoteText.trim(),
        category: newNoteCategory
      };
      setNotes(prev => [...prev, newNote]);
      setNewNoteText("");
    }
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const getDateNotes = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return notes.filter(note => note.date === dateKey);
  };

  const getSelectedDateNotes = () => {
    if (!selectedDate) return [];
    return getDateNotes(selectedDate);
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
      <div className="grid grid-cols-7 gap-1 mb-4">
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
          const dayNotes = getDateNotes(date);
          const isSelected = selectedDate && isSameDay(selectedDate, date);
          
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
                  "ring-2 ring-blue-300": isSelected,
                }
              )}
            >
              {dayNumber}
              {/* Note indicators */}
              {dayNotes.length > 0 && (
                <div className="absolute -top-1 -right-1 flex">
                  {dayNotes.slice(0, 3).map((note, index) => (
                    <div
                      key={note.id}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full ml-0.5",
                        categories[note.category].color
                      )}
                    />
                  ))}
                  {dayNotes.length > 3 && (
                    <div className="w-1.5 h-1.5 rounded-full ml-0.5 bg-gray-400" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Note section for selected date */}
      {selectedDate && (
        <div className="space-y-3">
          <div className="border-t pt-3">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-700">
                {format(selectedDate, "MMMM d, yyyy")}
              </div>
              <div className="text-xs text-gray-500">
                {getSelectedDateNotes().length} note{getSelectedDateNotes().length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Existing notes */}
            {getSelectedDateNotes().length > 0 && (
              <div className="space-y-2 mb-3">
                {getSelectedDateNotes().map((note) => (
                  <div
                    key={note.id}
                    className="flex items-start gap-2 p-2 bg-gray-50 rounded text-xs"
                  >
                    <div className={cn("w-2 h-2 rounded-full mt-1", categories[note.category].color)} />
                    <div className="flex-1">
                      <div className="text-gray-800">{note.text}</div>
                      <div className="text-gray-500 text-xs mt-1">
                        {categories[note.category].label}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNote(note.id)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new note */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <select
                  value={newNoteCategory}
                  onChange={(e) => setNewNoteCategory(e.target.value as Note['category'])}
                  className="text-xs border border-gray-200 rounded px-2 py-1"
                >
                  {Object.entries(categories).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <textarea
                  placeholder="Add a note for this day..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="flex-1 text-xs border border-gray-200 rounded px-2 py-1 resize-none"
                  rows={2}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      addNote();
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addNote}
                  disabled={!newNoteText.trim()}
                  className="h-8 px-2"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarMonth;
