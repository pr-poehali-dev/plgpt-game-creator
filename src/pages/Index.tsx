
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Settings } from "@/components/Settings";
import { GameWindow } from "@/components/GameWindow";
import { ChatMessage } from "@/components/ChatMessage";
import { Sun, Moon, SendIcon } from "lucide-react";

const Index = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Привет! Я PLGpt, нейросеть для создания 2D игр. Опиши игру, которую хочешь создать, и я сделаю её для тебя! Например: 'Создай шутер с астероидами' или 'Сделай гоночную игру с препятствиями'." },
  ]);
  const [input, setInput] = useState("");
  const [gameActive, setGameActive] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  const handleSubmit = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages([...messages, { role: "user", content: input }]);
    
    // Simulate AI response
    setTimeout(() => {
      // Analyze the user request for game type
      const request = input.toLowerCase();
      let responseMessage = "";
      
      if (request.includes("3d") || request.includes("3 d")) {
        responseMessage = "Извини, но на данный момент я могу создавать только 2D-игры. Давай попробуем создать 2D-версию этой игры?";
      } else {
        const gameType = getGameTypeFromRequest(request);
        responseMessage = `Отлично! Я создал для тебя ${gameType} игру "${input}". Можешь начать играть прямо сейчас, используя клавиши WASD для управления${gameType === "шутер" ? " и мышь для стрельбы" : ""}.`;
      }
      
      setMessages(prev => [
        ...prev, 
        { 
          role: "assistant", 
          content: responseMessage 
        }
      ]);
      setGameActive(true);
    }, 1500);
    
    setInput("");
  };

  const getGameTypeFromRequest = (request: string): string => {
    if (request.includes("стрел") || request.includes("шутер") || request.includes("shooter")) {
      return "шутер";
    } else if (request.includes("голово") || request.includes("puzzle") || request.includes("загад")) {
      return "головоломку";
    } else if (request.includes("платформер") || request.includes("платформ") || request.includes("jump") || request.includes("прыж")) {
      return "платформер";
    } else if (request.includes("гонк") || request.includes("racing") || request.includes("машин") || request.includes("car")) {
      return "гоночную";
    } else if (request.includes("готов") || request.includes("cook") || request.includes("кух")) {
      return "кулинарную";
    }
    return "новую";
  };

  return (
    <div className={`min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300`}>
      {/* Header */}
      <header className="border-b border-border py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">PLGpt</h1>
            <span className="text-sm text-muted-foreground">Создавай 2D-игры с помощью ИИ</span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              aria-label={theme === "light" ? "Переключить на тёмную тему" : "Переключить на светлую тему"}
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setSettingsOpen(true)}
            >
              Настройки
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto flex-1 flex flex-col md:flex-row gap-6 py-6">
        {/* Chat Panel */}
        <div className="flex-1 flex flex-col">
          <Card className="flex-1 mb-4 p-4 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
            </div>
            <div className="flex gap-2">
              <Textarea
                placeholder="Опиши 2D-игру, которую хочешь создать..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <Button onClick={handleSubmit} className="self-end">
                <SendIcon className="mr-2 h-4 w-4" /> Отправить
              </Button>
            </div>
          </Card>
        </div>

        {/* Game Display */}
        <div className="flex-1">
          <GameWindow active={gameActive} gameDescription={messages.length > 1 ? messages[messages.length - 2].content : ""} />
        </div>
      </div>

      {/* Settings Modal */}
      {settingsOpen && <Settings onClose={() => setSettingsOpen(false)} theme={theme} onThemeChange={toggleTheme} />}
    </div>
  );
};

export default Index;
