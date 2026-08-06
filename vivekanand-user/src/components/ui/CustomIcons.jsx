import { cn } from "@/lib/utils";

export const CallIcon = ({ className }) => (
  <img src="/call.png" alt="Call" className={cn("object-contain scale-[1.3]", className)} />
);

export const WhatsAppIcon = ({ className }) => (
  <img src="/whatsapp.png" alt="WhatsApp" className={cn("object-contain scale-[1.3]", className)} />
);

