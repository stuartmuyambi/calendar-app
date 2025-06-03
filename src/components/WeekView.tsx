
import { useState, useMemo } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Note, Habit } from '@/utils/storage';

interface WeekViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  notes: Note[];
  habits: Habit[];
  onNoteAdd: (date: Date) => void;
  onHabitToggle: (habitId: string, date: string) => void;
}

const WeekView = ({ currentDate, onDateChange, notes, habits, onNoteAdd, onHabitToggle }: WeekViewProps) => {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(currentDate));

  const weekDays = useMemo(() => {
    const start = startOfWeek(weekStart);
    const end = endOfWeek(weekStart);
    return eachDayOfInterval({ start, end });
  }, [weekStart]);

  const getDateNotes = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return notes.filter(note => note.date === dateKey);
  };

  const getDateHabits = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return habits.map(habit => ({
      ...habit,
      completed: habit.completedDates.includes(dateKey)
    }));
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeekStart = new Date(weekStart);
    newWeekStart.setDate(newWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setWeekStart(newWeekStart);
  };

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigateWeek('prev')}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-lg font-medium">
            {format(weekStart, "MMM d")} - {format(endOfWeek(weekStart), "MMM d, yyyy")}
          </h3>
          <Button variant="ghost" size="sm" onClick={() => navigateWeek('next')}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const today = new Date();
            setWeekStart(startOfWeek(today));
            onDateChange(today);
          }}
        >
          Today
        </Button>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((date) => {
          const dayNotes = getDateNotes(date);
          const dayHabits = getDateHabits(date);
          const isCurrentDay = isToday(date);
          const isSelected = isSameDay(date, currentDate);

          return (
            <Card
              key={format(date, "yyyy-MM-dd")}
              className={`cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-blue-300' : ''
              } ${isCurrentDay ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
              onClick={() => onDateChange(date)}
            >
              <CardHeader className="pb-2">
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {format(date, "EEE")}
                  </div>
                  <div className={`text-lg font-medium ${
                    isCurrentDay ? 'text-blue-600 dark:text-blue-400' : ''
                  }`}>
                    {format(date, "d")}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                {/* Notes */}
                <div className="space-y-1 mb-3">
                  {dayNotes.slice(0, 3).map((note) => (
                    <div
                      key={note.id}
                      className="text-xs p-1 bg-gray-100 dark:bg-gray-700 rounded truncate"
                    >
                      {note.text}
                    </div>
                  ))}
                  {dayNotes.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{dayNotes.length - 3} more
                    </div>
                  )}
                </div>

                {/* Habits */}
                <div className="space-y-1">
                  {dayHabits.slice(0, 3).map((habit) => (
                    <div
                      key={habit.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onHabitToggle(habit.id, format(date, "yyyy-MM-dd"));
                      }}
                      className={`text-xs p-1 rounded cursor-pointer ${
                        habit.completed
                          ? `${habit.color} text-white`
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {habit.name}
                    </div>
                  ))}
                </div>

                {/* Add button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNoteAdd(date);
                  }}
                  className="w-full mt-2 h-6 text-xs"
                >
                  + Add
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;
