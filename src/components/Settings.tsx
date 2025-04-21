
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Moon, Sun, HelpCircle } from "lucide-react";

interface SettingsProps {
  onClose: () => void;
  theme: "light" | "dark";
  onThemeChange: () => void;
}

export function Settings({ onClose, theme, onThemeChange }: SettingsProps) {
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Настройки</DialogTitle>
            <DialogDescription>
              Настройте внешний вид и другие параметры приложения PLGpt.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Тема оформления</Label>
                <div className="text-sm text-muted-foreground">
                  Выберите светлую или тёмную тему
                </div>
              </div>
              <div className="flex items-center">
                <Sun className="h-4 w-4 mr-2" />
                <Switch 
                  checked={theme === "dark"}
                  onCheckedChange={onThemeChange}
                />
                <Moon className="h-4 w-4 ml-2" />
              </div>
            </div>

            {/* Support Button */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Поддержка</Label>
                <div className="text-sm text-muted-foreground">
                  Связаться с командой поддержки
                </div>
              </div>
              <Button variant="outline" onClick={() => setSupportDialogOpen(true)}>
                <HelpCircle className="h-4 w-4 mr-2" />
                Поддержка
              </Button>
            </div>

            {/* PLGpt Watermark */}
            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <div className="font-medium">PLGpt</div>
                <div className="text-sm text-muted-foreground">
                  Создавай лучшие игры с помощью нейросети
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={onClose}>Закрыть</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Support Alert Dialog */}
      <AlertDialog open={supportDialogOpen} onOpenChange={setSupportDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Поддержка</AlertDialogTitle>
            <AlertDialogDescription>
              Чтобы связаться с поддержкой напишите нам в Telegram - @mPho0enix
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Понятно</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
