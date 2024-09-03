"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    onChange?: (value: number) => void;
  }
>(({ className, value, onChange, ...props }, ref) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickPosition = event.clientX - rect.left;
    const newValue = (clickPosition / rect.width) * 100;
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn("relative h-2 w-full overflow-hidden bg-black-5", className)}
      onClick={handleClick}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="size-full flex-1 bg-white-1 transition-all"
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          background: "linear-gradient(to right,#3fffa2  0%, #ffdb3a 45%, #f97535 100%)"
        }}

      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
