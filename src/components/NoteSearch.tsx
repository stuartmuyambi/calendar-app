
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Note } from '@/utils/storage';

interface NoteSearchProps {
  notes: Note[];
  onNoteSelect: (note: Note) => void;
  isOpen: boolean;
  onClose: () => void;
}

const NoteSearch = ({ notes, onNoteSelect, isOpen, onClose }: NoteSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotes = notes.filter(note =>
    note.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-4 max-h-96 overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No notes found</p>
          ) : (
            <div className="space-y-2">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => {
                    onNoteSelect(note);
                    onClose();
                  }}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="flex items-start gap-2">
                    <div className={`w-3 h-3 rounded-full mt-1 ${
                      note.priority === 'high' ? 'bg-red-400' :
                      note.priority === 'medium' ? 'bg-yellow-400' :
                      'bg-green-400'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{note.text}</p>
                      <p className="text-xs text-gray-500">{note.date} • {note.category}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteSearch;
