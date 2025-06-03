
import { useState } from "react";
import CalendarMonth from "./CalendarMonth";
import { ChevronLeft, ChevronRight, Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const CalendarYear = () => {
  const [currentYear, setCurrentYear] = useState(2025);
  const [showGoals, setShowGoals] = useState(false);

  const months = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
  ];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl md:text-4xl font-light tracking-wider text-gray-800">
            PLAN THE THINGS <span className="text-gray-400">//</span> DO THE THINGS
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGoals(!showGoals)}
            className="hidden md:flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            Goals
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
              TWENTY {currentYear === 2025 ? "TWENTY FIVE" : 
                      currentYear === 2024 ? "TWENTY FOUR" :
                      currentYear === 2026 ? "TWENTY SIX" : currentYear.toString()}
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

      {/* Goals Panel */}
      {showGoals && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            {currentYear} Goals
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm text-gray-600 mb-2">PERSONAL</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Exercise 3x per week</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Read 24 books</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm text-gray-600 mb-2">PROFESSIONAL</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Learn new skill</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Complete certification</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm text-gray-600 mb-2">CREATIVE</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Start a project</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Learn photography</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {months.map((month, index) => (
          <div key={month} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-medium tracking-wider text-gray-600">
                {month}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {monthNames[index]} {currentYear}
              </p>
            </div>
            <CalendarMonth 
              year={currentYear} 
              month={index} 
              monthName={month}
            />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-xs text-gray-400 tracking-wider">
          PLAN • EXECUTE • ACHIEVE
        </p>
      </div>
    </div>
  );
};

export default CalendarYear;
