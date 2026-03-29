import { CheckCircle2, ImageIcon, UploadIcon, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useOutletContext } from "react-router";
import { PROGRESS_INCREMENT, PROGRESS_INTERVAL_MS, REDIRECT_DELAY_MS, MAX_IMAGE_SIZE_BYTES } from "@/lib/constants";

interface UploadProps {
  onComplete?: (data: string) => void;
}

interface AuthContext {
  isSignedIn: boolean;
}

const Upload = ({ onComplete }: UploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { isSignedIn } = useOutletContext<AuthContext>();

  const processFile = (selectedFile: File) => {
    if (!isSignedIn) return;

    setError(null);

    // Runtime validation
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload a valid image file (JPG, PNG).");
      return;
    }

    if (selectedFile.size > MAX_IMAGE_SIZE_BYTES) {
      setError("The image file is too large. Maximum size is 10MB.");
      return;
    }

    setFile(selectedFile);
    setProgress(0);

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target?.result as string;

      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + PROGRESS_INCREMENT;
          if (next >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onComplete?.(base64Data);

            }, REDIRECT_DELAY_MS);
            return 100;
          }
          return next;
        });
      }, PROGRESS_INTERVAL_MS);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (isSignedIn) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (!isSignedIn) return;

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  return (
    <div className="upload">
      {!file ? (
        <div
          className={`dropzone ${isDragging ? "is-dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="drop-input"
            accept=".jpg,.jpeg,.png"
            disabled={!isSignedIn}
            onChange={handleFileChange}
          />
          <div className="drop-content">
            <div className="drop-icon">
              <UploadIcon size={20} />
            </div>
            <p>
              {isSignedIn
                ? "Drag and drop your image here"
                : "Please sign in to upload an image"}
            </p>
            <p className="help">Maximum file size 10MB</p>
            {error && (
              <div className="error-message flex items-center gap-2 text-destructive mt-2 text-sm font-medium animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="upload-status">
          <div className="status-content">
            <div className="status-icon">
              {progress === 100 ? (
                <CheckCircle2 className="check" />
              ) : (
                <ImageIcon className="image" />
              )}
            </div>
            <h3>{file.name}</h3>
            <div className="progress">
              <div className="bar" style={{ width: `${progress}%` }} />
              <p className="status-text">
                {progress < 100 ? "Analyzing floor plan..." : "Redirecting..."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;

