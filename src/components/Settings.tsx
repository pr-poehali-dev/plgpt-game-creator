
import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface SettingsProps {
  onClose: () => void;
  theme: "light" | "dark";
  onThemeChange: () => void;
}

export function Settings({ onClose, theme, onThemeChange }: SettingsProps) {
  const [showSupportMessage, setShowSupportMessage] = useState(false);
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Настройки</DialogTitle>
          <DialogDescription>
            Настройте приложение PLGpt под свои предпочтения.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="theme-mode">Тёмная тема</Label>
              <p className="text-sm text-muted-foreground">
                Переключение между светлым и тёмным режимом
              </p>
            </div>
            <Switch 
              id="theme-mode" 
              checked={theme === "dark"}
              onCheckedChange={onThemeChange}
            />
          </div>
          
          <Separator />
          
          {/* Support Button */}
          <div>
            <Label>Поддержка</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Нужна помощь? Свяжитесь с нашей командой поддержки
            </p>
            <Button 
              variant="outline" 
              onClick={() => setShowSupportMessage(true)}
              className="w-full"
            >
              Связаться с поддержкой
            </Button>
            
            {showSupportMessage && (
              <div className="mt-2 p-3 bg-muted rounded-md text-sm relative">
                <button 
                  onClick={() => setShowSupportMessage(false)}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
                <p>Чтобы связаться с поддержкой, напишите нам в Telegram - @mPho0enix</p>
              </div>
            )}
          </div>
          
          <Separator />
          
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                PLGpt
              </div>
              <span className="text-xs text-muted-foreground">v1.0.0</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Создавай лучшие игры с помощью нейросети
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
