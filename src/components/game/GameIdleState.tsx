import { Card, CardContent } from "@/components/ui/card";

export function GameIdleState() {
  return (
    <Card className="h-full flex items-center justify-center">
      <CardContent className="text-center py-10">
        <div className="text-muted-foreground mb-4">
          <div className="text-6xl mb-4">🎮</div>
          <p>Опиши 2D-игру, и я создам её для тебя!</p>
          <p className="text-xs mt-2">Наша нейросеть создаёт только 2D-игры</p>
        </div>
      </CardContent>
    </Card>
  );
}
