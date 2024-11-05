import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, X } from 'lucide-react';
import verifyJWT from '@/app/scripts/verifyJWT';

const FileSelector = ({ onClose }: { onClose: () => void }) => {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchFileList = async () => {
    try {
      const response = await fetch('dashboard/api/getDataFiles');
      const data = await response.json();
      setFiles(data.files);
    } catch (error) {
			console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch file list"
      });
    }
  };

  React.useEffect(() => {
    fetchFileList();
  }, []);

  const handleSelectFile = (filename: string, checked: boolean) => {
    if (checked) {
      setSelectedFiles(prev => [...prev, filename]);
    } else {
      setSelectedFiles(prev => prev.filter(f => f !== filename));
    }
  };

  const handleImport = async () => {
    setIsLoading(true);
    
    try {
      // Get student info first
      const studentInfo = await verifyJWT(true);
      if (!studentInfo) {
        throw new Error("Not authenticated");
      }

      for (const filename of selectedFiles) {
        const response = await fetch('/dashboard/api/importQuestionSet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            filename,
            studentInfo 
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to import ${filename}`);
        }
      }
      
      toast({
        title: "Success",
        description: `Imported ${selectedFiles.length} question sets successfully`
      });
      
      setSelectedFiles([]);
      onClose(); // Close drawer after successful import
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to import question sets"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Section with Close Button */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Import Question Sets</h2>
          <p className="text-muted-foreground">
            Select question sets to import into your database. You can choose multiple files to import them in bulk.
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <div className="space-y-4">
        {/* File Selection Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              {files.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No question sets available to import.
                </p>
              ) : (
                files.map((file) => (
                  <div key={file} className="flex items-center gap-6 py-1">
                    <Checkbox
                      id={file}
                      checked={selectedFiles.includes(file)}
                      onCheckedChange={(checked) => 
                        handleSelectFile(file, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={file}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						style={{marginLeft: "0.5rem"}}
                    >
                      {file}
                    </label>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Section */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
          </p>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={selectedFiles.length === 0 || isLoading}
              className="min-w-[140px]"
            >
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isLoading ? 'Importing...' : 'Import Files'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileSelector;
