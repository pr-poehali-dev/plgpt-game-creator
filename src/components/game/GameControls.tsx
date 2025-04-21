import { Button } from "@/components/ui/button";
import { RefreshCw, Pause, PlayIcon } from "lucide-react";

interface GameControlsProps {
  isPlaying: boolean;
  gameTitle: string;
  onTogglePlay: () => void;
  onReset: () => void;
}

export function GameControls({ 
  isPlaying, 
  gameTitle, 
  onTogglePlay, 
  onReset 
}: GameControlsProps) {
  return (
    <div className="flex justify-between items-center w-full">
      <span>{gameTitle || "Новая игра"}</span>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onReset}
        >
          <RefreshCw className="h-4 w-4 mr-1" /> Сбросить
        </Button>
        <Button 
          size="sm"
          onClick={onTogglePlay}
        >
          {isPlaying ? (
            <><Pause className="h-4 w-4 mr-1" /> Пауза</>
          ) : (
            <><PlayIcon className="h-4 w-4 mr-1" /> Играть</>
          )}
        </Button>
      </div>
    </div>
  );
}
