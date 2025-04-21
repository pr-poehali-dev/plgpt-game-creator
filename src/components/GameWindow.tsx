
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayIcon, RefreshCw } from "lucide-react";

interface GameWindowProps {
  active: boolean;
  gameDescription: string;
}

export function GameWindow({ active, gameDescription }: GameWindowProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameTitle, setGameTitle] = useState("");

  useEffect(() => {
    if (active && gameDescription) {
      // Extract a game title from the description or use a default
      const words = gameDescription.split(" ");
      let title = words.slice(0, 3).join(" ");
      if (title.length > 20) title = title.substring(0, 20) + "...";
      setGameTitle(title);
      setIsPlaying(false);
    }
  }, [active, gameDescription]);

  if (!active) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center py-10">
          <div className="text-muted-foreground mb-4">
            <div className="text-6xl mb-4">🎮</div>
            <p>Опиши игру, и я создам её для тебя!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{gameTitle || "Новая игра"}</span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsPlaying(false)}
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Сбросить
            </Button>
            <Button 
              size="sm"
              onClick={() => setIsPlaying(true)}
            >
              <PlayIcon className="h-4 w-4 mr-1" /> Играть
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 relative">
        {isPlaying ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="relative w-full h-full bg-black/5 rounded-md overflow-hidden">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Interactive game elements would go here in a real implementation */}
                <div className="animate-pulse mb-4">
                  <div className="text-6xl mb-2">🎮</div>
                  <p className="text-2xl font-bold">Игра запущена!</p>
                </div>
                <p className="max-w-md text-muted-foreground">
                  Используйте клавиши WASD для передвижения и мышь для взаимодействия с игровыми объектами.
                </p>
              </div>
              <div className="absolute bottom-4 right-4 bg-background/80 px-2 py-1 rounded text-xs">
                PLGpt
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="text-6xl mb-4">🎲</div>
            <h3 className="text-xl font-medium mb-2">Игра готова к запуску</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {gameDescription ? (
                `Игра создана по вашему запросу. Нажмите "Играть", чтобы начать!`
              ) : (
                "Нажмите кнопку 'Играть', чтобы запустить игру."
              )}
            </p>
            <Button onClick={() => setIsPlaying(true)}>
              <PlayIcon className="h-4 w-4 mr-2" /> Играть сейчас
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
