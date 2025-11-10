
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HardConfirmationDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  itemName: string;
  confirmButtonText: string;
  onConfirm: () => void;
  variant?: "default" | "destructive";
}

export function HardConfirmationDialog({
  trigger,
  title,
  description,
  itemName,
  confirmButtonText,
  onConfirm,
  variant = "default",
}: HardConfirmationDialogProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const isMatch = inputValue === itemName;

  useEffect(() => {
    if (open) {
      setInputValue("");
    }
  }, [open]);

  const handleConfirm = () => {
    if (isMatch) {
      onConfirm();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description} <span className="font-bold text-foreground">{itemName}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="confirmation-input">Nome do item</Label>
          <Input
            id="confirmation-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={itemName}
            autoComplete="off"
          />
        </div>
        <DialogFooter className="gap-2 sm:justify-end">
           <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            onClick={handleConfirm}
            disabled={!isMatch}
            variant={variant}
          >
            {confirmButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
