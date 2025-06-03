
import { useState } from "react";
import CalendarMonth from "./CalendarMonth";
import { ChevronLeft, ChevronRight, Target, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CalendarYear = () => {
  const [currentYear, setCurrentYear] = useState(2025);
  const [showGoals, setShowGoals] = useState(false);
  const [goals, setGoals] = useState({
    personal: [
      { id: 1, text: "Exercise 3x per week", completed: false },
      { id: 2, text: "Read 24 books", completed: false },
    ],
    professional: [
      { id: 3, text: "Learn new skill", completed: false },
      { id: 4, text: "Complete certification", completed: false },
    ],
    creative: [
      { id: 5, text: "Start a project", completed: false },
      { id: 6, text: "Learn photography", completed: false },
    ],
  });

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

  const toggleGoal = (category: keyof typeof goals, goalId: number) => {
    setGoals(prev => ({
      ...prev,
      [category]: prev[category].map(goal => 
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      )
    }));
  };

  const addGoal = (category: keyof typeof goals, text: string) => {
    if (text.trim()) {
      const newId = Math.max(...Object.values(goals).flat().map(g => g.id)) + 1;
      setGoals(prev => ({
        ...prev,
        [category]: [...prev[category], { id: newId, text: text.trim(), completed: false }]
      }));
    }
  };

  const getCompletionStats = () => {
    const allGoals = Object.values(goals).flat();
    const completed = allGoals.filter(g => g.completed).length;
    const total = allGoals.length;
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const stats = getCompletionStats();

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-light tracking-wider text-gray-800">
            PLAN THE THINGS <span className="text-gray-400">//</span> DO THE THINGS
          </h1>
          <p className="text-sm text-gray-500 mt-2">Your personal planning companion</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGoals(!showGoals)}
            className="flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            Goals
            {stats.total > 0 && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {stats.completed}/{stats.total}
              </span>
            )}
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentYear(currentYear - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <h2 className="text-xl md:text-3xl font-light tracking-widest text-gray-700 min-w-[140px] text-center">
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

      {/* Progress Overview */}
      {stats.total > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">{currentYear} Progress</h3>
                <p className="text-sm text-gray-600">{stats.completed} of {stats.total} goals completed</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{stats.percentage}%</div>
                <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
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

      {/* Goals Panel */}
      {showGoals && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              {currentYear} Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(goals).map(([category, categoryGoals]) => (
                <GoalCategory
                  key={category}
                  title={category.toUpperCase()}
                  goals={categoryGoals}
                  onToggle={(goalId) => toggleGoal(category as keyof typeof goals, goalId)}
                  onAdd={(text) => addGoal(category as keyof typeof goals, text)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {months.map((month, index) => (
          <Card key={month} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium tracking-wider text-gray-600">
                    {month}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
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
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center border-t pt-8">
        <p className="text-xs text-gray-400 tracking-wider mb-2">
          PLAN • EXECUTE • ACHIEVE
        </p>
        <p className="text-xs text-gray-300">
          Built with ❤️ for productivity enthusiasts
        </p>
      </div>
    </div>
  );
};

// Goal Category Component
interface Goal {
  id: number;
  text: string;
  completed: boolean;
}

interface GoalCategoryProps {
  title: string;
  goals: Goal[];
  onToggle: (goalId: number) => void;
  onAdd: (text: string) => void;
}

const GoalCategory = ({ title, goals, onToggle, onAdd }: GoalCategoryProps) => {
  const [newGoalText, setNewGoalText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (newGoalText.trim()) {
      onAdd(newGoalText);
      setNewGoalText("");
      setIsAdding(false);
    }
  };

  const completed = goals.filter(g => g.completed).length;
  const total = goals.length;

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium text-sm text-gray-600">{title}</h4>
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

      <div className="space-y-2">
        {goals.map((goal) => (
          <div key={goal.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={goal.completed}
              onChange={() => onToggle(goal.id)}
              className="rounded h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className={`text-sm flex-1 ${goal.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
              {goal.text}
            </span>
          </div>
        ))}

        {isAdding && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              placeholder="New goal..."
              className="flex-1 text-xs border border-gray-300 rounded px-2 py-1"
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
              autoFocus
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
        )}
      </div>
    </div>
  );
};

export default CalendarYear;
