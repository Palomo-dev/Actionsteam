
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, X } from "lucide-react";

interface ImageUploaderProps {
  isUploading: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  currentImage: string;
  type: 'favicon' | 'cover';
}

export const ImageUploader = ({
  isUploading,
  onFileChange,
  onReset,
  currentImage,
  type
}: ImageUploaderProps) => {
  const [key, setKey] = useState(Date.now());

  return (
    <div className="flex items-center gap-4">
      <img 
        src={type === 'favicon' 
          ? '/lovable-uploads/4214daa3-9e22-4021-a2ab-52ad77cb1261.png' 
          : '/lovable-uploads/78ca5367-79a5-4962-adfb-9713841136c7.png'
        }
        alt={`Current ${type}`} 
        className={type === 'favicon' ? "w-8 h-8 border rounded" : "w-32 h-16 object-cover rounded border"}
      />
      <div className="flex gap-2">
        <Input
          key={key}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          disabled={isUploading}
          className="max-w-xs"
        />
        <Button
          variant="destructive"
          size="icon"
          onClick={onReset}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
