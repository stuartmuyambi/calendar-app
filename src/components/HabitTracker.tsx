
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Habit } from '@/utils/storage';

interface HabitTrackerProps {
  habits: Habit[];
  onHabitAdd: (habit: Omit<Habit, 'id'>) => void;
  onHabitDelete: (habitId: string) => void;
  onHabitToggle: (habitId: string, date: string) => void;
}

const HabitTracker = ({ habits, onHabitAdd, onHabitDelete, onHabitToggle }: HabitTrackerProps) => {
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('health');
  const [isAdding, setIsAdding] = useState(false);

  const colors = [
    'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400',
    'bg-purple-400', 'bg-pink-400', 'bg-indigo-400', 'bg-orange-400'
  ];

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      const newHabit: Omit<Habit, 'id'> = {
        name: newHabitName.trim(),
        category: newHabitCategory,
        completedDates: [],
        streak: 0,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      onHabitAdd(newHabit);
      setNewHabitName('');
      setIsAdding(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Daily Habits</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(!isAdding)}
            className="h-8 w-8 p-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="space-y-2 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded">
            <Input
              placeholder="Habit name..."
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddHabit()}
            />
            <div className="flex gap-2">
              <select
                value={newHabitCategory}
                onChange={(e) => setNewHabitCategory(e.target.value)}
                className="text-sm border border-gray-200 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
              >
                <option value="health">Health</option>
                <option value="productivity">Productivity</option>
                <option value="learning">Learning</option>
                <option value="social">Social</option>
                <option value="creative">Creative</option>
              </select>
              <Button size="sm" onClick={handleAddHabit}>
                Add
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {habits.map((habit) => {
            const isCompletedToday = habit.completedDates.includes(today);
            
            return (
              <div
                key={habit.id}
                className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <button
                  onClick={() => onHabitToggle(habit.id, today)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    isCompletedToday
                      ? `${habit.color} border-transparent`
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}
                >
                  {isCompletedToday && (
                    <div className="w-full h-full flex items-center justify-center text-white text-xs">
                      ✓
                    </div>
                  )}
                </button>
                
                <div className="flex-1">
                  <div className={`text-sm ${
                    isCompletedToday ? 'text-gray-500 line-through' : ''
                  }`}>
                    {habit.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {habit.streak} day streak • {habit.category}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onHabitDelete(habit.id)}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            );
          })}

          {habits.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No habits yet</p>
              <p className="text-xs">Click + to add your first habit</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitTracker;
