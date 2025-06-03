
import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import CalendarMonth from "./CalendarMonth";
import WeekView from "./WeekView";
import HabitTracker from "./HabitTracker";
import NoteSearch from "./NoteSearch";
import StatsDashboard from "./StatsDashboard";
import { ChevronLeft, ChevronRight, Target, Plus, Settings, Search, Calendar, Users, Moon, Sun, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { saveToStorage, loadFromStorage, Note, Goal, Habit, Goals } from "@/utils/storage";

const CalendarYear = () => {
  const { settings, updateSettings, toggleTheme } = useTheme();
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showGoals, setShowGoals] = useState(false);
  const [showHabits, setShowHabits] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [goals, setGoals] = useState<Goals>({
    personal: [],
    professional: [],
    creative: [],
  });
  const [habits, setHabits] = useState<Habit[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const data = loadFromStorage();
    setNotes(data.notes || []);
    setGoals(data.goals || { personal: [], professional: [], creative: [] });
    setHabits(data.habits || []);
  }, []);

  // Save data to localStorage whenever data changes
  useEffect(() => {
    saveToStorage({ notes, goals, habits });
  }, [notes, goals, habits]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            setShowSearch(true);
            break;
          case 'g':
            e.preventDefault();
            setShowGoals(!showGoals);
            break;
          case 'h':
            e.preventDefault();
            setShowHabits(!showHabits);
            break;
          case 'd':
            e.preventDefault();
            toggleTheme();
            break;
        }
      }
      
      if (e.key === 'Escape') {
        setShowSearch(false);
        setSelectedDate(null);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showGoals, showHabits, toggleTheme]);

  const months = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
  ];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getYearText = (year: number) => {
    const yearMap: { [key: number]: string } = {
      2023: "TWENTY THREE",
      2024: "TWENTY FOUR", 
      2025: "TWENTY FIVE",
      2026: "TWENTY SIX",
      2027: "TWENTY SEVEN",
      2028: "TWENTY EIGHT",
      2029: "TWENTY NINE",
      2030: "THIRTY"
    };
    return yearMap[year] || year.toString();
  };

  // Note management
  const addNote = useCallback((note: Omit<Note, 'id'>) => {
    const newNote: Note = {
      ...note,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    setNotes(prev => [...prev, newNote]);
  }, []);

  const updateNote = useCallback((noteId: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, ...updates } : note
    ));
  }, []);

  const deleteNote = useCallback((noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  }, []);

  // Goal management
  const toggleGoal = useCallback((category: keyof typeof goals, goalId: number) => {
    setGoals(prev => ({
      ...prev,
      [category]: prev[category].map(goal => {
        if (goal.id === goalId) {
          const completed = !goal.completed;
          const today = new Date().toISOString().split('T')[0];
          let newStreak = goal.streak;
          
          if (completed) {
            if (goal.lastCompletedDate === today) {
              newStreak = goal.streak;
            } else {
              newStreak = goal.streak + 1;
            }
          }
          
          return {
            ...goal,
            completed,
            progress: completed ? 100 : goal.progress,
            streak: newStreak,
            lastCompletedDate: completed ? today : goal.lastCompletedDate
          };
        }
        return goal;
      })
    }));
  }, [goals]);

  const addGoal = useCallback((category: keyof typeof goals, text: string, deadline?: string) => {
    if (text.trim()) {
      const newId = Math.max(...Object.values(goals).flat().map(g => g.id), 0) + 1;
      setGoals(prev => ({
        ...prev,
        [category]: [...prev[category], { 
          id: newId, 
          text: text.trim(), 
          completed: false, 
          progress: 0,
          deadline,
          streak: 0
        }]
      }));
    }
  }, [goals]);

  const updateGoalProgress = useCallback((category: keyof typeof goals, goalId: number, progress: number) => {
    setGoals(prev => ({
      ...prev,
      [category]: prev[category].map(goal => 
        goal.id === goalId ? { 
          ...goal, 
          progress,
          completed: progress >= 100
        } : goal
      )
    }));
  }, []);

  // Habit management
  const addHabit = useCallback((habit: Omit<Habit, 'id'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    setHabits(prev => [...prev, newHabit]);
  }, []);

  const deleteHabit = useCallback((habitId: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== habitId));
  }, []);

  const toggleHabit = useCallback((habitId: string, date: string) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const completedDates = habit.completedDates.includes(date)
          ? habit.completedDates.filter(d => d !== date)
          : [...habit.completedDates, date];
        
        // Calculate streak
        const today = new Date();
        let streak = 0;
        for (let i = 0; i < 365; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(checkDate.getDate() - i);
          const dateStr = checkDate.toISOString().split('T')[0];
          
          if (completedDates.includes(dateStr)) {
            streak++;
          } else {
            break;
          }
        }
        
        return {
          ...habit,
          completedDates,
          streak
        };
      }
      return habit;
    }));
  }, []);

  // Export functionality
  const exportData = () => {
    const data = { notes, goals, habits, settings };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendar-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCompletionStats = () => {
    const allGoals = Object.values(goals).flat();
    const completed = allGoals.filter(g => g.completed).length;
    const total = allGoals.length;
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const stats = getCompletionStats();

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-light tracking-wider text-gray-800 dark:text-gray-200">
            PLAN THE THINGS <span className="text-gray-400">//</span> DO THE THINGS
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Your personal planning companion</p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Stats
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
            <span className="text-xs text-gray-400">⌘K</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGoals(!showGoals)}
            className="flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            Goals
            {stats.total > 0 && (
              <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                {stats.completed}/{stats.total}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHabits(!showHabits)}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Habits
          </Button>

          <div className="flex items-center gap-1 border-l pl-2 border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-8 w-8 p-0"
            >
              {settings.theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={exportData}
              className="h-8 w-8 p-0"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 border-l pl-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded p-1">
              <Button
                variant={settings.view === 'year' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => updateSettings({ view: 'year' })}
                className="h-7 px-2 text-xs"
              >
                Year
              </Button>
              <Button
                variant={settings.view === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => updateSettings({ view: 'week' })}
                className="h-7 px-2 text-xs"
              >
                Week
              </Button>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentYear(currentYear - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <h2 className="text-xl md:text-3xl font-light tracking-widest text-gray-700 dark:text-gray-300 min-w-[140px] text-center">
              {getYearText(currentYear)}
            </h2>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentYear(currentYear + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Dashboard */}
      {showStats && (
        <StatsDashboard 
          notes={notes}
          goals={goals}
          habits={habits}
        />
      )}

      {/* Progress Overview */}
      {stats.total > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">{currentYear} Progress</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stats.completed} of {stats.total} goals completed</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.percentage}%</div>
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals and Habits Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {showGoals && (
          <GoalPanel 
            goals={goals}
            onToggle={toggleGoal}
            onAdd={addGoal}
            onUpdateProgress={updateGoalProgress}
          />
        )}
        
        {showHabits && (
          <HabitTracker
            habits={habits}
            onHabitAdd={addHabit}
            onHabitDelete={deleteHabit}
            onHabitToggle={toggleHabit}
          />
        )}
      </div>

      {/* Main Calendar View */}
      {settings.view === 'week' ? (
        <WeekView
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          notes={notes}
          habits={habits}
          onNoteAdd={(date) => setSelectedDate(date)}
          onHabitToggle={toggleHabit}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {months.map((month, index) => (
            <Card key={month} className="overflow-hidden hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium tracking-wider text-gray-600 dark:text-gray-400">
                      {month}
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {monthNames[index]} {currentYear}
                    </p>
                  </div>
                  <Settings className="w-4 h-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <CalendarMonth 
                  year={currentYear} 
                  month={index} 
                  monthName={month}
                  notes={notes}
                  habits={habits}
                  onNoteAdd={addNote}
                  onNoteUpdate={updateNote}
                  onNoteDelete={deleteNote}
                  onHabitToggle={toggleHabit}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Search Modal */}
      <NoteSearch
        notes={notes}
        onNoteSelect={(note) => {
          const noteDate = new Date(note.date);
          setCurrentDate(noteDate);
          setSelectedDate(noteDate);
        }}
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
      />

      {/* Footer */}
      <div className="mt-12 text-center border-t pt-8 border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-400 dark:text-gray-500 tracking-wider mb-2">
          PLAN • EXECUTE • ACHIEVE
        </p>
        <p className="text-xs text-gray-300 dark:text-gray-600">
          Built with ❤️ for productivity enthusiasts
        </p>
        <div className="text-xs text-gray-300 dark:text-gray-600 mt-2 space-x-4">
          <span>⌘K Search</span>
          <span>⌘G Goals</span>
          <span>⌘H Habits</span>
          <span>⌘D Dark Mode</span>
        </div>
      </div>
    </div>
  );
};

// Enhanced Goal Panel Component with new features
interface GoalPanelProps {
  goals: Goals;
  onToggle: (category: keyof Goals, goalId: number) => void;
  onAdd: (category: keyof Goals, text: string, deadline?: string) => void;
  onUpdateProgress: (category: keyof Goals, goalId: number, progress: number) => void;
}

const GoalPanel = ({ goals, onToggle, onAdd, onUpdateProgress }: GoalPanelProps) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Goals & Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          {Object.entries(goals).map(([category, categoryGoals]) => (
            <GoalCategory
              key={category}
              title={category.toUpperCase()}
              goals={categoryGoals}
              onToggle={(goalId) => onToggle(category as keyof Goals, goalId)}
              onAdd={(text, deadline) => onAdd(category as keyof Goals, text, deadline)}
              onUpdateProgress={(goalId, progress) => onUpdateProgress(category as keyof Goals, goalId, progress)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced Goal Category Component
interface GoalCategoryProps {
  title: string;
  goals: Goal[];
  onToggle: (goalId: number) => void;
  onAdd: (text: string, deadline?: string) => void;
  onUpdateProgress: (goalId: number, progress: number) => void;
}

const GoalCategory = ({ title, goals, onToggle, onAdd, onUpdateProgress }: GoalCategoryProps) => {
  const [newGoalText, setNewGoalText] = useState("");
  const [newGoalDeadline, setNewGoalDeadline] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (newGoalText.trim()) {
      onAdd(newGoalText, newGoalDeadline || undefined);
      setNewGoalText("");
      setNewGoalDeadline("");
      setIsAdding(false);
    }
  };

  const completed = goals.filter(g => g.completed).length;
  const total = goals.length;

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium text-sm text-gray-600 dark:text-gray-300">{title}</h4>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{completed}/{total}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(!isAdding)}
            className="h-6 w-6 p-0"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {goals.map((goal) => (
          <div key={goal.id} className="space-y-2">
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={goal.completed}
                onChange={() => onToggle(goal.id)}
                className="rounded h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mt-0.5"
              />
              <div className="flex-1 space-y-1">
                <span className={`text-sm ${goal.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  {goal.text}
                </span>
                
                {goal.deadline && (
                  <div className="text-xs text-gray-500">
                    Due: {format(new Date(goal.deadline), 'MMM d, yyyy')}
                  </div>
                )}
                
                {goal.streak > 0 && (
                  <div className="text-xs text-orange-600 dark:text-orange-400">
                    🔥 {goal.streak} day streak
                  </div>
                )}
                
                {!goal.completed && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 min-w-[3rem]">{goal.progress}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={goal.progress}
                      onChange={(e) => onUpdateProgress(goal.id, parseInt(e.target.value))}
                      className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isAdding && (
          <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <input
              type="text"
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              placeholder="New goal..."
              className="w-full text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAdd()}
              autoFocus
            />
            <div className="flex gap-2">
              <input
                type="date"
                value={newGoalDeadline}
                onChange={(e) => setNewGoalDeadline(e.target.value)}
                className="flex-1 text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAdd}
                className="h-6 px-2 text-xs"
              >
                Add
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarYear;
