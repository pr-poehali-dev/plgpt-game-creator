import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  GameState, 
  GameType, 
  initialGameState, 
  initializeGameElements, 
  updateGame, 
  analyzeGameDescription
} from "@/lib/game-engine";
import { CanvasRenderer } from "./game/CanvasRenderer";
import { GameControls } from "./game/GameControls";
import { GameStartPrompt } from "./game/GameStartPrompt";
import { GameIdleState } from "./game/GameIdleState";

interface GameWindowProps {
  active: boolean;
  gameDescription: string;
}

export function GameWindow({ active, gameDescription }: GameWindowProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameTitle, setGameTitle] = useState("");
  const [gameType, setGameType] = useState<GameType>("shooter");
  const frameRef = useRef<number>(0);
  const [score, setScore] = useState(0);
  const gameStateRef = useRef<GameState>({...initialGameState});

  // Анализируем описание игры, чтобы установить соответствующий тип игры
  useEffect(() => {
    if (!gameDescription) return;
    
    const { gameType: detectedType, gameTitle: detectedTitle } = analyzeGameDescription(gameDescription);
    setGameType(detectedType);
    setGameTitle(detectedTitle);
    
    // Сбрасываем состояние игры
    resetGame();
    
  }, [gameDescription]);

  // Настраиваем обработчики событий игры
  useEffect(() => {
    if (!isPlaying) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      gameStateRef.current.keysPressed[e.key] = true;
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      gameStateRef.current.keysPressed[e.key] = false;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      gameStateRef.current.mouseX = e.clientX - rect.left;
      gameStateRef.current.mouseY = e.clientY - rect.top;
    };
    
    const handleMouseDown = () => {
      gameStateRef.current.isMouseDown = true;
    };
    
    const handleMouseUp = () => {
      gameStateRef.current.isMouseDown = false;
    };
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    
    // Запускаем игровой цикл
    startGameLoop();
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      
      // Отменяем анимацию
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isPlaying, gameType]);

  // Функция для запуска игрового цикла
  const startGameLoop = () => {
    const loop = () => {
      // Обновляем состояние игры
      updateGame(gameStateRef.current, gameType, setScore);
      // Запрашиваем следующий кадр
      frameRef.current = requestAnimationFrame(loop);
    };
    
    frameRef.current = requestAnimationFrame(loop);
  };

  // Сброс игры и инициализация элементов
  const resetGame = () => {
    setIsPlaying(false);
    setScore(0);
    gameStateRef.current = {
      playerX: 400,
      playerY: 300,
      enemies: [],
      bullets: [],
      items: [],
      keysPressed: {},
      mouseX: 0,
      mouseY: 0,
      isMouseDown: false,
      lastShotTime: 0,
    };
    initializeGameElements(gameStateRef.current, gameType);
  };

  // Если игра не активна, показываем состояние ожидания
  if (!active) {
    return <GameIdleState />;
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>
          <GameControls 
            isPlaying={isPlaying} 
            gameTitle={gameTitle} 
            onTogglePlay={() => setIsPlaying(!isPlaying)} 
            onReset={resetGame} 
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 relative">
        <div className="h-full flex flex-col items-center justify-center text-center">
          <div className="relative w-full h-[600px] bg-black/5 rounded-md overflow-hidden">
            {isPlaying ? (
              <CanvasRenderer 
                gameState={gameStateRef.current} 
                gameType={gameType} 
                score={score} 
              />
            ) : (
              <GameStartPrompt gameType={gameType} gameTitle={gameTitle} />
            )}
            <div className="absolute bottom-4 right-4 bg-background/80 px-2 py-1 rounded text-xs">
              PLGpt • 2D Игры
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
