
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Note, Goal, Habit } from '@/utils/storage';

interface StatsDashboardProps {
  notes: Note[];
  goals: { [category: string]: Goal[] };
  habits: Habit[];
}

const StatsDashboard = ({ notes, goals, habits }: StatsDashboardProps) => {
  const stats = useMemo(() => {
    const allGoals = Object.values(goals).flat();
    const completedGoals = allGoals.filter(g => g.completed).length;
    const totalGoals = allGoals.length;
    
    const notesThisMonth = notes.filter(note => {
      const noteDate = new Date(note.date);
      const now = new Date();
      return noteDate.getMonth() === now.getMonth() && 
             noteDate.getFullYear() === now.getFullYear();
    }).length;

    const activeHabits = habits.filter(habit => {
      const today = new Date().toISOString().split('T')[0];
      return habit.completedDates.includes(today);
    }).length;

    const avgGoalProgress = totalGoals > 0 
      ? allGoals.reduce((sum, goal) => sum + goal.progress, 0) / totalGoals 
      : 0;

    return {
      completedGoals,
      totalGoals,
      notesThisMonth,
      activeHabits,
      totalHabits: habits.length,
      avgGoalProgress: Math.round(avgGoalProgress),
      goalCompletionRate: totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0,
    };
  }, [notes, goals, habits]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Goals Completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats.completedGoals}/{stats.totalGoals}
          </div>
          <p className="text-xs text-gray-500">
            {stats.goalCompletionRate}% completion rate
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Notes This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {stats.notesThisMonth}
          </div>
          <p className="text-xs text-gray-500">
            Keep tracking your progress
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Active Habits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {stats.activeHabits}/{stats.totalHabits}
          </div>
          <p className="text-xs text-gray-500">
            Habits completed today
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Average Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {stats.avgGoalProgress}%
          </div>
          <p className="text-xs text-gray-500">
            Overall goal progress
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsDashboard;
