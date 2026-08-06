import { cn } from "@/lib/utils";

export const CallIcon = ({ className }) => (
  <img src="/call.png" alt="Call" className={cn("object-contain", className)} />
);

export const WhatsAppIcon = ({ className }) => (
  <img src="/whatsapp.png" alt="WhatsApp" className={cn("object-contain", className)} />
);
