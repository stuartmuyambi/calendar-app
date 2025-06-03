
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { isToday, isPast, isFuture, format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from "date-fns";
import { Plus, Edit3, Trash2, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Note, Habit } from "@/utils/storage";

interface CalendarMonthProps {
  year: number;
  month: number;
  monthName: string;
  notes: Note[];
  habits: Habit[];
  onNoteAdd: (note: Omit<Note, 'id'>) => void;
  onNoteUpdate: (noteId: string, updates: Partial<Note>) => void;
  onNoteDelete: (noteId: string) => void;
  onHabitToggle: (habitId: string, date: string) => void;
  selectedDate: Date | null;
  onDateSelect: (date: Date | null) => void;
}

const CalendarMonth = ({ 
  year, 
  month, 
  monthName, 
  notes, 
  habits,
  onNoteAdd, 
  onNoteUpdate, 
  onNoteDelete,
  onHabitToggle,
  selectedDate,
  onDateSelect
}: CalendarMonthProps) => {
  const [newNoteText, setNewNoteText] = useState("");
  const [newNoteCategory, setNewNoteCategory] = useState<Note['category']>('personal');
  const [newNotePriority, setNewNotePriority] = useState<Note['priority']>('medium');
  const [newNoteTimeSlot, setNewNoteTimeSlot] = useState("");
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

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

  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  };

  const noteTemplates = [
    { text: "Morning workout", category: 'health' as const, timeSlot: "07:00" },
    { text: "Team meeting", category: 'work' as const, timeSlot: "10:00" },
    { text: "Lunch with friends", category: 'personal' as const, timeSlot: "12:00" },
    { text: "Project review", category: 'work' as const, timeSlot: "14:00" },
    { text: "Grocery shopping", category: 'personal' as const, timeSlot: "16:00" },
  ];

  const handleDateClick = (date: Date) => {
    if (selectedDate && isSameDay(selectedDate, date)) {
      onDateSelect(null);
    } else {
      onDateSelect(date);
    }
  };

  const addNote = () => {
    if (newNoteText.trim() && selectedDate) {
      const newNote: Omit<Note, 'id'> = {
        date: format(selectedDate, "yyyy-MM-dd"),
        text: newNoteText.trim(),
        category: newNoteCategory,
        priority: newNotePriority,
        timeSlot: newNoteTimeSlot || undefined,
      };
      onNoteAdd(newNote);
      setNewNoteText("");
      setNewNoteTimeSlot("");
    }
  };

  const addTemplate = (template: typeof noteTemplates[0]) => {
    if (selectedDate) {
      const newNote: Omit<Note, 'id'> = {
        date: format(selectedDate, "yyyy-MM-dd"),
        text: template.text,
        category: template.category,
        priority: 'medium',
        timeSlot: template.timeSlot,
      };
      onNoteAdd(newNote);
    }
  };

  const startEditing = (note: Note) => {
    setEditingNote(note.id);
    setEditText(note.text);
  };

  const saveEdit = () => {
    if (editingNote && editText.trim()) {
      onNoteUpdate(editingNote, { text: editText.trim() });
      setEditingNote(null);
      setEditText("");
    }
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setEditText("");
  };

  const getDateNotes = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return notes
      .filter(note => note.date === dateKey)
      .sort((a, b) => {
        // Sort by time slot first, then by priority
        if (a.timeSlot && b.timeSlot) {
          return a.timeSlot.localeCompare(b.timeSlot);
        }
        if (a.timeSlot && !b.timeSlot) return -1;
        if (!a.timeSlot && b.timeSlot) return 1;
        
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  };

  const getDateHabits = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return habits.filter(habit => habit.completedDates.includes(dateKey));
  };

  const getSelectedDateNotes = () => {
    if (!selectedDate) return [];
    return getDateNotes(selectedDate);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedDate && !editingNote) {
        let newDate: Date | null = null;
        
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            newDate = new Date(selectedDate);
            newDate.setDate(selectedDate.getDate() - 1);
            break;
          case 'ArrowRight':
            e.preventDefault();
            newDate = new Date(selectedDate);
            newDate.setDate(selectedDate.getDate() + 1);
            break;
          case 'ArrowUp':
            e.preventDefault();
            newDate = new Date(selectedDate);
            newDate.setDate(selectedDate.getDate() - 7);
            break;
          case 'ArrowDown':
            e.preventDefault();
            newDate = new Date(selectedDate);
            newDate.setDate(selectedDate.getDate() + 7);
            break;
          case 'Enter':
            e.preventDefault();
            if (newNoteText.trim()) {
              addNote();
            }
            break;
        }
        
        if (newDate) {
          onDateSelect(newDate);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedDate, editingNote, newNoteText]);

  return (
    <div className="p-2 sm:p-4">
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-400 dark:text-gray-500 py-1 sm:py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-4">
        {/* Empty cells for days before month starts */}
        {emptyCells.map((_, index) => (
          <div key={`empty-${index}`} className="h-8 sm:h-10" />
        ))}
        
        {/* Actual days */}
        {days.map((date) => {
          const dayNumber = format(date, "d");
          const isCurrentDay = isToday(date);
          const isPastDay = isPast(date) && !isCurrentDay;
          const isFutureDay = isFuture(date);
          const dayNotes = getDateNotes(date);
          const dayHabits = getDateHabits(date);
          const isSelected = selectedDate && isSameDay(selectedDate, date);
          
          const highPriorityNotes = dayNotes.filter(n => n.priority === 'high');
          const hasTimeSlots = dayNotes.some(n => n.timeSlot);
          
          return (
            <button
              key={format(date, "yyyy-MM-dd")}
              onClick={() => handleDateClick(date)}
              className={cn(
                "h-8 sm:h-10 w-full text-xs rounded-sm transition-all duration-200 hover:scale-105 relative",
                "flex flex-col items-center justify-center p-0.5 sm:p-1",
                {
                  // Past days - muted
                  "text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700": isPastDay,
                  
                  // Today - highlighted
                  "bg-blue-500 text-white font-medium shadow-md": isCurrentDay,
                  
                  // Future days - normal
                  "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100": isFutureDay,
                  
                  // Selected date
                  "ring-2 ring-blue-300 dark:ring-blue-500": isSelected,
                }
              )}
            >
              <span className="font-medium text-xs sm:text-sm">{dayNumber}</span>
              
              {/* Note and habit indicators */}
              <div className="flex items-center justify-center gap-0.5 mt-0.5">
                {/* High priority indicator */}
                {highPriorityNotes.length > 0 && (
                  <AlertCircle className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-red-500" />
                )}
                
                {/* Time slot indicator */}
                {hasTimeSlots && (
                  <Clock className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-blue-500" />
                )}
                
                {/* Note dots */}
                {dayNotes.slice(0, 2).map((note, index) => (
                  <div
                    key={note.id}
                    className={cn(
                      "w-1 h-1 rounded-full",
                      categories[note.category].color
                    )}
                  />
                ))}
                
                {/* Habit indicators */}
                {dayHabits.slice(0, 1).map((habit) => (
                  <div
                    key={habit.id}
                    className={cn("w-1 h-1 rounded-full", habit.color)}
                  />
                ))}
                
                {(dayNotes.length + dayHabits.length) > 3 && (
                  <div className="w-1 h-1 rounded-full bg-gray-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Note section for selected date */}
      {selectedDate && (
        <div className="space-y-3 animate-fade-in">
          <div className="border-t pt-3 border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {format(selectedDate, "MMMM d, yyyy")}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {getSelectedDateNotes().length} note{getSelectedDateNotes().length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Quick templates - responsive layout */}
            <div className="mb-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Quick add:</div>
              <div className="flex gap-1 flex-wrap">
                {noteTemplates.map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => addTemplate(template)}
                    className="h-6 px-2 text-xs flex-shrink-0"
                  >
                    {template.text}
                  </Button>
                ))}
              </div>
            </div>

            {/* Existing notes */}
            {getSelectedDateNotes().length > 0 && (
              <div className="space-y-2 mb-3">
                {getSelectedDateNotes().map((note) => (
                  <div
                    key={note.id}
                    className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs"
                  >
                    <div className="flex items-center gap-1 mt-1 flex-shrink-0">
                      <div className={cn("w-2 h-2 rounded-full", categories[note.category].color)} />
                      <div className={cn("w-1.5 h-1.5 rounded-full", priorityColors[note.priority])} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {editingNote === note.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="min-h-[60px] text-xs"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && e.ctrlKey) {
                                saveEdit();
                              }
                            }}
                          />
                          <div className="flex gap-1">
                            <Button size="sm" onClick={saveEdit} className="h-6 px-2 text-xs">
                              Save
                            </Button>
                            <Button variant="ghost" size="sm" onClick={cancelEdit} className="h-6 px-2 text-xs">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between gap-2">
                            <div className="text-gray-800 dark:text-gray-200 break-words">{note.text}</div>
                            <div className="flex gap-1 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEditing(note)}
                                className="h-5 w-5 p-0 text-gray-400 hover:text-blue-500"
                              >
                                <Edit3 className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onNoteDelete(note.id)}
                                className="h-5 w-5 p-0 text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs mt-1 flex-wrap">
                            <span>{categories[note.category].label}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="capitalize">{note.priority} priority</span>
                            {note.timeSlot && (
                              <>
                                <span className="hidden sm:inline">•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {note.timeSlot}
                                </span>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add new note - responsive layout */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={newNoteCategory}
                  onChange={(e) => setNewNoteCategory(e.target.value as Note['category'])}
                  className="text-xs border border-gray-200 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
                >
                  {Object.entries(categories).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                
                <select
                  value={newNotePriority}
                  onChange={(e) => setNewNotePriority(e.target.value as Note['priority'])}
                  className="text-xs border border-gray-200 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                
                <input
                  type="time"
                  value={newNoteTimeSlot}
                  onChange={(e) => setNewNoteTimeSlot(e.target.value)}
                  className="text-xs border border-gray-200 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
                  placeholder="Time"
                />
              </div>
              
              <div className="flex gap-2">
                <Textarea
                  placeholder="Add a note for this day... (Press Enter to save)"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="flex-1 text-xs resize-none min-h-[60px]"
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
                  className="h-12 px-3 flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
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
