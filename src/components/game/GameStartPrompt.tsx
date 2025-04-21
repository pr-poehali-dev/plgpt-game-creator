import { GameType } from "@/lib/game-engine";

interface GameStartPromptProps {
  gameType: GameType;
  gameTitle: string;
}

export function GameStartPrompt({ gameType, gameTitle }: GameStartPromptProps) {
  const gameEmoji = {
    shooter: "🎯",
    puzzle: "🧩",
    platformer: "🏃",
    racing: "🏎️",
    cooking: "🍳"
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="mb-4">
        <div className="text-6xl mb-2">
          {gameEmoji[gameType]}
        </div>
        <p className="text-2xl font-bold">{gameTitle || "Игра готова!"}</p>
      </div>
      <p className="max-w-md text-muted-foreground">
        Используйте клавиши WASD для передвижения
        {gameType === "shooter" ? " и мышь для стрельбы" : ""}.
        Нажмите "Играть", чтобы начать!
      </p>
    </div>
  );
}
