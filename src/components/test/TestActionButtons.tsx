
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface TestActionButtonsProps {
  onCancel: () => void;
  onSave: () => void;
  isSaving: boolean;
}

const TestActionButtons: React.FC<TestActionButtonsProps> = ({
  onCancel,
  onSave,
  isSaving
}) => {
  return (
    <div className="flex justify-end space-x-4">
      <Button 
        variant="outline" 
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button 
        onClick={onSave}
        disabled={isSaving}
        className="flex items-center gap-2"
      >
        {isSaving ? 'Saving...' : (
          <>
            <Save size={16} />
            Save Changes
          </>
        )}
      </Button>
    </div>
  );
};

export default TestActionButtons;
