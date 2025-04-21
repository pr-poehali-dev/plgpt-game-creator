
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: {
    role: string;
    content: string;
  };
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  
  return (
    <div className={cn(
      "flex items-start gap-3 p-3 rounded-lg", 
      isUser ? "bg-muted/50 flex-row-reverse" : "bg-primary/5"
    )}>
      <Avatar className={cn("w-8 h-8", isUser && "bg-primary")}>
        <AvatarFallback>{isUser ? "Вы" : "AI"}</AvatarFallback>
        {!isUser && (
          <AvatarImage src="/placeholder.svg" alt="PLGpt Avatar" />
        )}
      </Avatar>
      <div className={cn("flex-1", isUser && "text-right")}>
        <div className="text-sm font-medium mb-1">
          {isUser ? "Вы" : "PLGpt"}
        </div>
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    </div>
  );
}
