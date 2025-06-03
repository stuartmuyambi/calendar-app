
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Note, Goals, Habit } from '@/utils/storage';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, subWeeks } from 'date-fns';
import { Calendar, Target, TrendingUp, Activity } from 'lucide-react';

interface StatsDashboardProps {
  notes: Note[];
  goals: Goals;
  habits: Habit[];
}

const StatsDashboard = ({ notes, goals, habits }: StatsDashboardProps) => {
  const stats = useMemo(() => {
    // Note statistics
    const totalNotes = notes.length;
    const notesByCategory = notes.reduce((acc, note) => {
      acc[note.category] = (acc[note.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const notesByPriority = notes.reduce((acc, note) => {
      acc[note.priority] = (acc[note.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Goal statistics
    const allGoals = Object.values(goals).flat();
    const completedGoals = allGoals.filter(g => g.completed).length;
    const goalCompletionRate = allGoals.length > 0 ? (completedGoals / allGoals.length) * 100 : 0;

    // Habit statistics
    const totalHabits = habits.length;
    const avgHabitStreak = habits.length > 0 
      ? habits.reduce((sum, h) => sum + h.streak, 0) / habits.length 
      : 0;

    // Weekly activity (last 4 weeks)
    const weeklyActivity = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = startOfWeek(subWeeks(new Date(), i));
      const weekEnd = endOfWeek(weekStart);
      const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
      
      const weekNotes = weekDays.reduce((count, day) => {
        const dayStr = format(day, 'yyyy-MM-dd');
        return count + notes.filter(n => n.date === dayStr).length;
      }, 0);

      const weekHabitCompletions = weekDays.reduce((count, day) => {
        const dayStr = format(day, 'yyyy-MM-dd');
        return count + habits.reduce((habitCount, habit) => 
          habitCount + (habit.completedDates.includes(dayStr) ? 1 : 0), 0
        );
      }, 0);

      weeklyActivity.push({
        week: format(weekStart, 'MMM d'),
        notes: weekNotes,
        habits: weekHabitCompletions
      });
    }

    return {
      totalNotes,
      notesByCategory,
      notesByPriority,
      completedGoals,
      totalGoals: allGoals.length,
      goalCompletionRate,
      totalHabits,
      avgHabitStreak,
      weeklyActivity
    };
  }, [notes, goals, habits]);

  const categoryData = Object.entries(stats.notesByCategory).map(([category, count]) => ({
    name: category,
    value: count
  }));

  const priorityData = Object.entries(stats.notesByPriority).map(([priority, count]) => ({
    name: priority,
    value: count
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Notes</p>
                <p className="text-2xl font-bold">{stats.totalNotes}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Goal Progress</p>
                <p className="text-2xl font-bold">{Math.round(stats.goalCompletionRate)}%</p>
                <p className="text-xs text-gray-500">{stats.completedGoals}/{stats.totalGoals} completed</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Habits</p>
                <p className="text-2xl font-bold">{stats.totalHabits}</p>
              </div>
              <Activity className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Streak</p>
                <p className="text-2xl font-bold">{Math.round(stats.avgHabitStreak)}</p>
                <p className="text-xs text-gray-500">days</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="notes" fill="#3B82F6" name="Notes" />
                <Bar dataKey="habits" fill="#10B981" name="Habits" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Note Categories */}
        {categoryData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notes by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Priority Breakdown */}
      {priorityData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notes by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {priorityData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-3 h-3 rounded-full`}
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="capitalize text-sm">{item.name} Priority</span>
                  </div>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StatsDashboard;
