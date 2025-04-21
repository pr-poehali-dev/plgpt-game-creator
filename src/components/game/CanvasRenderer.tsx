import { useRef, useEffect } from 'react';
import { GameState, GameType } from '@/lib/game-engine';

interface CanvasRendererProps {
  gameState: GameState;
  gameType: GameType;
  score: number;
}

export function CanvasRenderer({ gameState, gameType, score }: CanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const renderFrame = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      renderGame(ctx, gameState, gameType, score);
      requestAnimationFrame(renderFrame);
    };

    const frameId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(frameId);
  }, [gameState, gameType, score]);

  return (
    <canvas 
      ref={canvasRef} 
      width={800} 
      height={600} 
      className="w-full h-full object-contain"
    />
  );
}

function renderGame(
  ctx: CanvasRenderingContext2D, 
  gameState: GameState, 
  gameType: GameType, 
  score: number
): void {
  // Очищаем холст
  ctx.fillStyle = gameType === "shooter" ? "#111111" : "#f0f9ff";
  ctx.fillRect(0, 0, 800, 600);
  
  // Рисуем фоновые элементы в зависимости от типа игры
  renderBackground(ctx, gameType);
  
  // Рисуем игрока
  renderPlayer(ctx, gameState, gameType);
  
  // Рисуем пули
  if (gameType === "shooter") {
    renderBullets(ctx, gameState);
  }
  
  // Рисуем врагов или предметы
  renderEnemiesOrItems(ctx, gameState, gameType);
  
  // Рисуем счет
  renderScore(ctx, score);
  
  // Рисуем подсказки управления
  renderControlsHint(ctx, gameType);
  
  // Рисуем водяной знак
  renderWatermark(ctx);
}

function renderBackground(ctx: CanvasRenderingContext2D, gameType: GameType): void {
  if (gameType === "platformer") {
    // Рисуем платформы
    ctx.fillStyle = "#4ade80";
    ctx.fillRect(0, 500, 300, 20);
    ctx.fillRect(400, 400, 300, 20);
    ctx.fillRect(100, 300, 300, 20);
    ctx.fillRect(500, 200, 300, 20);
  } else if (gameType === "racing") {
    // Рисуем гоночную трассу
    ctx.fillStyle = "#e5e5e5";
    ctx.fillRect(200, 0, 400, 600);
    
    // Рисуем разметку трассы
    ctx.setLineDash([30, 30]);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(400, 0);
    ctx.lineTo(400, 600);
    ctx.stroke();
    
    // Рисуем обочину
    ctx.fillStyle = "#16a34a";
    ctx.fillRect(0, 0, 200, 600);
    ctx.fillRect(600, 0, 200, 600);
  } else if (gameType === "cooking") {
    // Рисуем кухонную стойку
    ctx.fillStyle = "#d4d4d8";
    ctx.fillRect(100, 400, 600, 200);
    
    // Рисуем плиту
    ctx.fillStyle = "#404040";
    ctx.fillRect(200, 450, 150, 100);
    
    // Рисуем разделочную доску
    ctx.fillStyle = "#a16207";
    ctx.fillRect(450, 450, 200, 100);
  }
}

function renderPlayer(
  ctx: CanvasRenderingContext2D, 
  gameState: GameState, 
  gameType: GameType
): void {
  ctx.fillStyle = gameType === "shooter" ? "#60a5fa" : "#f59e0b";
  ctx.beginPath();
  ctx.arc(gameState.playerX, gameState.playerY, 20, 0, Math.PI * 2);
  ctx.fill();
  
  if (gameType === "shooter") {
    // Рисуем оружие для шутеров
    const angle = Math.atan2(
      gameState.mouseY - gameState.playerY,
      gameState.mouseX - gameState.playerX
    );
    
    ctx.save();
    ctx.translate(gameState.playerX, gameState.playerY);
    ctx.rotate(angle);
    ctx.fillStyle = "#6b7280";
    ctx.fillRect(15, -3, 20, 6);
    ctx.restore();
  } else if (gameType === "racing") {
    // Рисуем детали машины
    ctx.fillStyle = "#000000";
    ctx.fillRect(gameState.playerX - 15, gameState.playerY - 10, 30, 5);
    ctx.fillRect(gameState.playerX - 15, gameState.playerY + 5, 30, 5);
  }
}

function renderBullets(ctx: CanvasRenderingContext2D, gameState: GameState): void {
  ctx.fillStyle = "#fcd34d";
  for (const bullet of gameState.bullets) {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function renderEnemiesOrItems(
  ctx: CanvasRenderingContext2D, 
  gameState: GameState, 
  gameType: GameType
): void {
  for (const enemy of gameState.enemies) {
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
      // Рисуем машины противников
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(enemy.x - 15, enemy.y - 20, 30, 40);
      ctx.fillStyle = "#000000";
      ctx.fillRect(enemy.x - 15, enemy.y - 15, 30, 5);
      ctx.fillRect(enemy.x - 15, enemy.y + 10, 30, 5);
    } else if (gameType === "cooking" || gameType === "puzzle") {
      // Рисуем предметы для сбора
      ctx.fillStyle = "#8b5cf6";
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, 12, 0, Math.PI * 2);
      ctx.fill();
      
      // Рисуем иконку предмета
      ctx.fillStyle = "#ffffff";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.fillText("+", enemy.x, enemy.y + 3);
    }
  }
}

function renderScore(ctx: CanvasRenderingContext2D, score: number): void {
  ctx.fillStyle = "#ffffff";
  ctx.font = "20px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`Счёт: ${score}`, 20, 30);
}

function renderControlsHint(ctx: CanvasRenderingContext2D, gameType: GameType): void {
  ctx.fillStyle = "#ffffff";
  ctx.font = "14px Arial";
  ctx.textAlign = "left";
  ctx.fillText("WASD - движение", 20, 580);
  
  if (gameType === "shooter") {
    ctx.fillText("Клик - стрельба", 200, 580);
  }
}

function renderWatermark(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.font = "16px Arial";
  ctx.textAlign = "right";
  ctx.fillText("PLGpt", 780, 580);
}
