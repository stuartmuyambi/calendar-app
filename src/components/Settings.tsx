
import { useState } from 'react';
import { Settings as SettingsIcon, X, Upload, Download, Trash2, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/ThemeContext';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  onImport: (data: any) => void;
  onClearData: () => void;
}

const Settings = ({ isOpen, onClose, onExport, onImport, onClearData }: SettingsProps) => {
  const { settings, updateSettings } = useTheme();
  const [customCategory, setCustomCategory] = useState('');

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          onImport(data);
        } catch (error) {
          console.error('Invalid JSON file:', error);
          alert('Invalid backup file format');
        }
      };
      reader.readAsText(file);
    }
  };

  const addCustomCategory = () => {
    if (customCategory.trim() && !settings.customCategories.includes(customCategory.trim())) {
      updateSettings({
        customCategories: [...settings.customCategories, customCategory.trim()]
      });
      setCustomCategory('');
    }
  };

  const removeCustomCategory = (category: string) => {
    updateSettings({
      customCategories: settings.customCategories.filter(c => c !== category)
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              Settings
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </h3>
            
            <div className="space-y-3">
              <div>
                <Label>Theme</Label>
                <div className="flex gap-2 mt-1">
                  <Button
                    variant={settings.theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSettings({ theme: 'light' })}
                  >
                    Light
                  </Button>
                  <Button
                    variant={settings.theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSettings({ theme: 'dark' })}
                  >
                    Dark
                  </Button>
                </div>
              </div>

              <div>
                <Label>Color Scheme</Label>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {['blue', 'green', 'purple', 'orange'].map((color) => (
                    <Button
                      key={color}
                      variant={settings.colorScheme === color ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateSettings({ colorScheme: color as any })}
                      className="capitalize"
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Default View</Label>
                <div className="flex gap-2 mt-1">
                  <Button
                    variant={settings.view === 'year' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSettings({ view: 'year' })}
                  >
                    Year
                  </Button>
                  <Button
                    variant={settings.view === 'week' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSettings({ view: 'week' })}
                  >
                    Week
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Custom Categories</h3>
            
            <div className="flex gap-2">
              <Input
                placeholder="Add custom category..."
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomCategory()}
              />
              <Button onClick={addCustomCategory} disabled={!customCategory.trim()}>
                Add
              </Button>
            </div>

            {settings.customCategories.length > 0 && (
              <div className="space-y-2">
                <Label>Custom Categories:</Label>
                <div className="flex flex-wrap gap-2">
                  {settings.customCategories.map((category) => (
                    <div
                      key={category}
                      className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{category}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomCategory(category)}
                        className="h-4 w-4 p-0 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Data Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Data Management</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button onClick={onExport} variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Data
              </Button>
              
              <div>
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                  id="import-file"
                />
                <Label htmlFor="import-file" className="cursor-pointer">
                  <Button variant="outline" className="w-full flex items-center gap-2" asChild>
                    <span>
                      <Upload className="w-4 h-4" />
                      Import Data
                    </span>
                  </Button>
                </Label>
              </div>
              
              <Button
                onClick={() => {
                  if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                    onClearData();
                  }
                }}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Keyboard Shortcuts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span>Search Notes</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">⌘K</kbd>
              </div>
              <div className="flex justify-between">
                <span>Toggle Goals</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">⌘G</kbd>
              </div>
              <div className="flex justify-between">
                <span>Toggle Habits</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">⌘H</kbd>
              </div>
              <div className="flex justify-between">
                <span>Dark Mode</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">⌘D</kbd>
              </div>
              <div className="flex justify-between">
                <span>Navigate Calendar</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">Arrow Keys</kbd>
              </div>
              <div className="flex justify-between">
                <span>Escape</span>
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">Close Modals</kbd>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
