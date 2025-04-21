// Модуль игрового движка, который содержит основную игровую логику
import { useRef } from 'react';

export type GameType = 'shooter' | 'puzzle' | 'platformer' | 'racing' | 'cooking';

export interface Enemy {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export interface Bullet {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export interface Item {
  x: number;
  y: number;
  type: string;
}

export interface GameState {
  playerX: number;
  playerY: number;
  enemies: Enemy[];
  bullets: Bullet[];
  items: Item[];
  keysPressed: Record<string, boolean>;
  mouseX: number;
  mouseY: number;
  isMouseDown: boolean;
  lastShotTime: number;
}

export const initialGameState: GameState = {
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

export function initializeGameElements(gameState: GameState, gameType: GameType): void {
  gameState.enemies = [];
  gameState.items = [];
  
  // Генерируем врагов или предметы в зависимости от типа игры
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
}

export function analyzeGameDescription(description: string): {gameType: GameType, gameTitle: string} {
  if (!description) return { gameType: 'shooter', gameTitle: '' };
  
  const desc = description.toLowerCase();
  let gameType: GameType = 'shooter';
  
  if (desc.includes("стрел") || desc.includes("шутер") || desc.includes("shooter") || desc.includes("стрельб")) {
    gameType = "shooter";
  } else if (desc.includes("голово") || desc.includes("puzzle") || desc.includes("загад")) {
    gameType = "puzzle";
  } else if (desc.includes("платформер") || desc.includes("платформ") || desc.includes("jump") || desc.includes("прыж")) {
    gameType = "platformer";
  } else if (desc.includes("гонк") || desc.includes("racing") || desc.includes("машин") || desc.includes("car")) {
    gameType = "racing";
  } else if (desc.includes("готов") || desc.includes("cook") || desc.includes("кух")) {
    gameType = "cooking";
  }

  // Извлекаем название игры из описания
  const words = description.split(" ");
  let title = words.slice(0, 3).join(" ");
  if (title.length > 20) title = title.substring(0, 20) + "...";
  
  return { gameType, gameTitle: title };
}

export function updateGame(gameState: GameState, gameType: GameType, setScore: React.Dispatch<React.SetStateAction<number>>): void {
  // Обновляем позицию игрока на основе нажатых клавиш
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
  
  // Обрабатываем стрельбу для шутеров
  if ((gameState.isMouseDown || gameState.keysPressed[" "]) && gameType === "shooter") {
    const now = Date.now();
    if (now - gameState.lastShotTime > 300) { // Контролируем скорострельность
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
  
  // Обновляем пули
  for (let i = 0; i < gameState.bullets.length; i++) {
    const bullet = gameState.bullets[i];
    bullet.x += bullet.dx;
    bullet.y += bullet.dy;
    
    // Удаляем пули, которые вышли за пределы экрана
    if (bullet.x < 0 || bullet.x > 800 || bullet.y < 0 || bullet.y > 600) {
      gameState.bullets.splice(i, 1);
      i--;
      continue;
    }
    
    // Проверяем столкновение с врагами
    for (let j = 0; j < gameState.enemies.length; j++) {
      const enemy = gameState.enemies[j];
      const dx = bullet.x - enemy.x;
      const dy = bullet.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 25) { // Попадание!
        gameState.enemies.splice(j, 1);
        gameState.bullets.splice(i, 1);
        i--;
        
        // Добавляем очки и создаем нового врага
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
  
  // Обновляем врагов
  for (let i = 0; i < gameState.enemies.length; i++) {
    const enemy = gameState.enemies[i];
    
    if (gameType === "shooter" || gameType === "platformer") {
      // Преследуем игрока в шутерах
      const dx = gameState.playerX - enemy.x;
      const dy = gameState.playerY - enemy.y;
      const angle = Math.atan2(dy, dx);
      enemy.dx = Math.cos(angle) * (1 + Math.random());
      enemy.dy = Math.sin(angle) * (1 + Math.random());
    }
    
    enemy.x += enemy.dx;
    enemy.y += enemy.dy;
    
    // Отскакиваем от краев для игр-гонок/головоломок
    if (gameType === "racing" || gameType === "puzzle" || gameType === "cooking") {
      if (enemy.x < 0 || enemy.x > 800) enemy.dx *= -1;
      if (enemy.y < 0 || enemy.y > 600) enemy.dy *= -1;
    }
    
    // Проверяем столкновение с игроком
    const dx = gameState.playerX - enemy.x;
    const dy = gameState.playerY - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 40) {
      if (gameType === "shooter" || gameType === "platformer") {
        // Здесь может быть логика game over
        // Пока просто перемещаем врага
        enemy.x = Math.random() < 0.5 ? -50 : 850;
        enemy.y = Math.random() * 600;
      } else if (gameType === "cooking" || gameType === "puzzle") {
        // Собираем предмет в играх готовки/головоломках
        gameState.enemies.splice(i, 1);
        i--;
        setScore(prevScore => prevScore + 5);
        
        // Добавляем новый предмет
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
}
