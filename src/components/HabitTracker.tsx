
import { useState } from 'react';
import { Plus, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Habit } from '@/utils/storage';
import { format, subDays, eachDayOfInterval } from 'date-fns';

interface HabitTrackerProps {
  habits: Habit[];
  onHabitAdd: (habit: Omit<Habit, 'id'>) => void;
  onHabitDelete: (habitId: string) => void;
  onHabitToggle: (habitId: string, date: string) => void;
}

const HabitTracker = ({ habits, onHabitAdd, onHabitDelete, onHabitToggle }: HabitTrackerProps) => {
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('health');

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-teal-500'
  ];

  const categories = [
    'health',
    'fitness',
    'learning',
    'productivity',
    'mindfulness',
    'social',
    'creative',
    'other'
  ];

  // Get last 7 days for habit tracking grid
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date()
  });

  const addHabit = () => {
    if (newHabitName.trim()) {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const newHabit: Omit<Habit, 'id'> = {
        name: newHabitName.trim(),
        category: newHabitCategory,
        completedDates: [],
        streak: 0,
        color: randomColor
      };
      onHabitAdd(newHabit);
      setNewHabitName('');
    }
  };

  const isHabitCompleted = (habit: Habit, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return habit.completedDates.includes(dateStr);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Habit Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new habit */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="New habit..."
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addHabit()}
              className="flex-1"
            />
            <select
              value={newHabitCategory}
              onChange={(e) => setNewHabitCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <Button onClick={addHabit} disabled={!newHabitName.trim()}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Habit list and tracking grid */}
        <div className="space-y-3">
          {habits.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No habits yet. Add one above!</p>
          ) : (
            habits.map((habit) => (
              <div key={habit.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${habit.color}`} />
                    <span className="font-medium text-sm">{habit.name}</span>
                    <span className="text-xs text-gray-500 capitalize">({habit.category})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {habit.streak > 0 && (
                      <span className="text-xs text-orange-600 dark:text-orange-400">
                        🔥 {habit.streak}
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onHabitDelete(habit.id)}
                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* 7-day tracking grid */}
                <div className="flex gap-1">
                  {last7Days.map((date) => {
                    const isCompleted = isHabitCompleted(habit, date);
                    const dateStr = format(date, 'yyyy-MM-dd');
                    
                    return (
                      <button
                        key={dateStr}
                        onClick={() => onHabitToggle(habit.id, dateStr)}
                        className={`w-6 h-6 rounded text-xs font-medium transition-all ${
                          isCompleted
                            ? `${habit.color} text-white`
                            : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                        title={format(date, 'MMM d')}
                      >
                        {format(date, 'd')}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitTracker;
