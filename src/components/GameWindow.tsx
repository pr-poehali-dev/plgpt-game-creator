
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayIcon, RefreshCw, Pause } from "lucide-react";

interface GameWindowProps {
  active: boolean;
  gameDescription: string;
}

export function GameWindow({ active, gameDescription }: GameWindowProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameTitle, setGameTitle] = useState("");
  const [gameType, setGameType] = useState<"shooter" | "puzzle" | "platformer" | "racing" | "cooking">("shooter");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const [score, setScore] = useState(0);

  // Game state variables
  const gameStateRef = useRef({
    playerX: 400,
    playerY: 300,
    enemies: [] as {x: number, y: number, dx: number, dy: number}[],
    bullets: [] as {x: number, y: number, dx: number, dy: number}[],
    items: [] as {x: number, y: number, type: string}[],
    keysPressed: {} as Record<string, boolean>,
    mouseX: 0,
    mouseY: 0,
    isMouseDown: false,
    lastShotTime: 0,
  });

  // Analyze game description to set appropriate game type
  useEffect(() => {
    if (!gameDescription) return;
    
    const desc = gameDescription.toLowerCase();
    if (desc.includes("стрел") || desc.includes("шутер") || desc.includes("shooter") || desc.includes("стрельб")) {
      setGameType("shooter");
    } else if (desc.includes("голово") || desc.includes("puzzle") || desc.includes("загад")) {
      setGameType("puzzle");
    } else if (desc.includes("платформер") || desc.includes("платформ") || desc.includes("jump")) {
      setGameType("platformer");
    } else if (desc.includes("гонк") || desc.includes("racing") || desc.includes("машин") || desc.includes("car")) {
      setGameType("racing");
    } else if (desc.includes("готов") || desc.includes("cook") || desc.includes("кух")) {
      setGameType("cooking");
    }

    // Extract a game title from the description
    const words = gameDescription.split(" ");
    let title = words.slice(0, 3).join(" ");
    if (title.length > 20) title = title.substring(0, 20) + "...";
    setGameTitle(title);
    
    // Reset game state
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

    // Generate initial game elements based on type
    initializeGameElements();
  }, [gameDescription]);

  const initializeGameElements = () => {
    const gameState = gameStateRef.current;
    gameState.enemies = [];
    gameState.items = [];
    
    // Generate enemies or items based on game type
    for (let i = 0; i < 5; i++) {
      gameState.enemies.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        dx: (Math.random() - 0.5) * 4,
        dy: (Math.random() - 0.5) * 4
      });
      
      if (gameType === "cooking" || gameType === "puzzle") {
        gameState.items.push({
          x: 100 + Math.random() * 600,
          y: 100 + Math.random() * 400,
          type: ["ingredient", "tool", "power"][Math.floor(Math.random() * 3)]
        });
      }
    }
  };

  // Setup game event handlers
  useEffect(() => {
    if (!isPlaying) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      gameStateRef.current.keysPressed[e.key] = true;
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      gameStateRef.current.keysPressed[e.key] = false;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
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
    
    // Start game loop
    startGameLoop();
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      
      // Cancel animation frame
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isPlaying, gameType]);

  const startGameLoop = () => {
    const loop = () => {
      updateGame();
      renderGame();
      frameRef.current = requestAnimationFrame(loop);
    };
    
    frameRef.current = requestAnimationFrame(loop);
  };

  const updateGame = () => {
    const gameState = gameStateRef.current;
    
    // Update player position based on key presses
    if (gameState.keysPressed["w"] || gameState.keysPressed["ArrowUp"]) {
      gameState.playerY = Math.max(30, gameState.playerY - 5);
    }
    if (gameState.keysPressed["s"] || gameState.keysPressed["ArrowDown"]) {
      gameState.playerY = Math.min(570, gameState.playerY + 5);
    }
    if (gameState.keysPressed["a"] || gameState.keysPressed["ArrowLeft"]) {
      gameState.playerX = Math.max(30, gameState.playerX - 5);
    }
    if (gameState.keysPressed["d"] || gameState.keysPressed["ArrowRight"]) {
      gameState.playerX = Math.min(770, gameState.playerX + 5);
    }
    
    // Handle shooting for shooter games
    if ((gameState.isMouseDown || gameState.keysPressed[" "]) && gameType === "shooter") {
      const now = Date.now();
      if (now - gameState.lastShotTime > 300) { // Control fire rate
        const angle = Math.atan2(gameState.mouseY - gameState.playerY, gameState.mouseX - gameState.playerX);
        gameState.bullets.push({
          x: gameState.playerX,
          y: gameState.playerY,
          dx: Math.cos(angle) * 8,
          dy: Math.sin(angle) * 8
        });
        gameState.lastShotTime = now;
      }
    }
    
    // Update bullets
    for (let i = 0; i < gameState.bullets.length; i++) {
      const bullet = gameState.bullets[i];
      bullet.x += bullet.dx;
      bullet.y += bullet.dy;
      
      // Remove bullets that are off-screen
      if (bullet.x < 0 || bullet.x > 800 || bullet.y < 0 || bullet.y > 600) {
        gameState.bullets.splice(i, 1);
        i--;
        continue;
      }
      
      // Check for collision with enemies
      for (let j = 0; j < gameState.enemies.length; j++) {
        const enemy = gameState.enemies[j];
        const dx = bullet.x - enemy.x;
        const dy = bullet.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 25) { // Hit!
          gameState.enemies.splice(j, 1);
          gameState.bullets.splice(i, 1);
          i--;
          
          // Add score and spawn new enemy
          setScore(prevScore => prevScore + 10);
          
          gameState.enemies.push({
            x: Math.random() < 0.5 ? -50 : 850,
            y: Math.random() * 600,
            dx: (Math.random() - 0.5) * 4,
            dy: (Math.random() - 0.5) * 4
          });
          
          break;
        }
      }
    }
    
    // Update enemies
    for (let i = 0; i < gameState.enemies.length; i++) {
      const enemy = gameState.enemies[i];
      
      if (gameType === "shooter" || gameType === "platformer") {
        // Chase player in shooter games
        const dx = gameState.playerX - enemy.x;
        const dy = gameState.playerY - enemy.y;
        const angle = Math.atan2(dy, dx);
        enemy.dx = Math.cos(angle) * (1 + Math.random());
        enemy.dy = Math.sin(angle) * (1 + Math.random());
      }
      
      enemy.x += enemy.dx;
      enemy.y += enemy.dy;
      
      // Bounce off edges for racing/puzzle games
      if (gameType === "racing" || gameType === "puzzle" || gameType === "cooking") {
        if (enemy.x < 0 || enemy.x > 800) enemy.dx *= -1;
        if (enemy.y < 0 || enemy.y > 600) enemy.dy *= -1;
      }
      
      // Check for collision with player
      const dx = gameState.playerX - enemy.x;
      const dy = gameState.playerY - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 40) {
        if (gameType === "shooter" || gameType === "platformer") {
          // Game over logic would go here
          // For now, just relocate the enemy
          enemy.x = Math.random() < 0.5 ? -50 : 850;
          enemy.y = Math.random() * 600;
        } else if (gameType === "cooking" || gameType === "puzzle") {
          // Collect item in cooking/puzzle games
          gameState.enemies.splice(i, 1);
          i--;
          setScore(prevScore => prevScore + 5);
          
          // Add a new item
          if (gameState.enemies.length < 3) {
            gameState.enemies.push({
              x: Math.random() * 800,
              y: Math.random() * 600,
              dx: (Math.random() - 0.5) * 3,
              dy: (Math.random() - 0.5) * 3
            });
          }
        }
      }
    }
  };

  const renderGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = gameType === "shooter" ? "#111111" : "#f0f9ff";
    ctx.fillRect(0, 0, 800, 600);
    
    // Draw background elements based on game type
    if (gameType === "platformer") {
      // Draw platform floors
      ctx.fillStyle = "#4ade80";
      ctx.fillRect(0, 500, 300, 20);
      ctx.fillRect(400, 400, 300, 20);
      ctx.fillRect(100, 300, 300, 20);
      ctx.fillRect(500, 200, 300, 20);
    } else if (gameType === "racing") {
      // Draw race track
      ctx.fillStyle = "#e5e5e5";
      ctx.fillRect(200, 0, 400, 600);
      
      // Draw track markings
      ctx.setLineDash([30, 30]);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(400, 0);
      ctx.lineTo(400, 600);
      ctx.stroke();
      
      // Draw sides
      ctx.fillStyle = "#16a34a";
      ctx.fillRect(0, 0, 200, 600);
      ctx.fillRect(600, 0, 200, 600);
    } else if (gameType === "cooking") {
      // Draw kitchen counter
      ctx.fillStyle = "#d4d4d8";
      ctx.fillRect(100, 400, 600, 200);
      
      // Draw stove
      ctx.fillStyle = "#404040";
      ctx.fillRect(200, 450, 150, 100);
      
      // Draw cutting board
      ctx.fillStyle = "#a16207";
      ctx.fillRect(450, 450, 200, 100);
    }
    
    // Draw player
    ctx.fillStyle = gameType === "shooter" ? "#60a5fa" : "#f59e0b";
    ctx.beginPath();
    ctx.arc(gameStateRef.current.playerX, gameStateRef.current.playerY, 20, 0, Math.PI * 2);
    ctx.fill();
    
    if (gameType === "shooter") {
      // Draw gun for shooter games
      const angle = Math.atan2(
        gameStateRef.current.mouseY - gameStateRef.current.playerY,
        gameStateRef.current.mouseX - gameStateRef.current.playerX
      );
      
      ctx.save();
      ctx.translate(gameStateRef.current.playerX, gameStateRef.current.playerY);
      ctx.rotate(angle);
      ctx.fillStyle = "#6b7280";
      ctx.fillRect(15, -3, 20, 6);
      ctx.restore();
    } else if (gameType === "racing") {
      // Draw car details
      ctx.fillStyle = "#000000";
      ctx.fillRect(gameStateRef.current.playerX - 15, gameStateRef.current.playerY - 10, 30, 5);
      ctx.fillRect(gameStateRef.current.playerX - 15, gameStateRef.current.playerY + 5, 30, 5);
    }
    
    // Draw bullets
    if (gameType === "shooter") {
      ctx.fillStyle = "#fcd34d";
      for (const bullet of gameStateRef.current.bullets) {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Draw enemies or items
    for (const enemy of gameStateRef.current.enemies) {
      if (gameType === "shooter") {
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, 15, 0, Math.PI * 2);
        ctx.fill();
      } else if (gameType === "platformer") {
        ctx.fillStyle = "#f97316";
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, 15, 0, Math.PI * 2);
        ctx.fill();
      } else if (gameType === "racing") {
        // Draw enemy cars
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(enemy.x - 15, enemy.y - 20, 30, 40);
        ctx.fillStyle = "#000000";
        ctx.fillRect(enemy.x - 15, enemy.y - 15, 30, 5);
        ctx.fillRect(enemy.x - 15, enemy.y + 10, 30, 5);
      } else if (gameType === "cooking" || gameType === "puzzle") {
        // Draw collectible items
        ctx.fillStyle = "#8b5cf6";
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw item icon
        ctx.fillStyle = "#ffffff";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.fillText("+", enemy.x, enemy.y + 3);
      }
    }
    
    // Draw score
    ctx.fillStyle = "#ffffff";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Счёт: ${score}`, 20, 30);
    
    // Draw controls hint
    ctx.font = "14px Arial";
    ctx.fillText("WASD - движение", 20, 580);
    
    if (gameType === "shooter") {
      ctx.fillText("Клик - стрельба", 200, 580);
    }
    
    // Draw watermark
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "16px Arial";
    ctx.textAlign = "right";
    ctx.fillText("PLGpt", 780, 580);
  };

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
              onClick={() => {
                setIsPlaying(false);
                setScore(0);
                initializeGameElements();
              }}
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Сбросить
            </Button>
            <Button 
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <><Pause className="h-4 w-4 mr-1" /> Пауза</>
              ) : (
                <><PlayIcon className="h-4 w-4 mr-1" /> Играть</>
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 relative">
        <div className="h-full flex flex-col items-center justify-center text-center">
          <div className="relative w-full h-[600px] bg-black/5 rounded-md overflow-hidden">
            {isPlaying ? (
              <canvas 
                ref={canvasRef} 
                width={800} 
                height={600} 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="mb-4">
                  <div className="text-6xl mb-2">
                    {gameType === "shooter" ? "🎯" : 
                     gameType === "puzzle" ? "🧩" : 
                     gameType === "platformer" ? "🏃" : 
                     gameType === "racing" ? "🏎️" : "🍳"}
                  </div>
                  <p className="text-2xl font-bold">{gameTitle || "Игра готова!"}</p>
                </div>
                <p className="max-w-md text-muted-foreground">
                  Используйте клавиши WASD для передвижения{gameType === "shooter" ? " и мышь для стрельбы" : ""}.
                  Нажмите "Играть", чтобы начать!
                </p>
              </div>
            )}
            <div className="absolute bottom-4 right-4 bg-background/80 px-2 py-1 rounded text-xs">
              PLGpt
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
