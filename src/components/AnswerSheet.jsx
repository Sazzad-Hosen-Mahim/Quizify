/* eslint-disable react/prop-types */
// import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Answers({ open, onOpenChange, children }) {
  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center z-50",
        open ? "visible" : "invisible"
      )}
    >
      <div
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 transition-opacity",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={() => onOpenChange(false)}
      ></div>
      <div
        className={cn(
          "bg-[#055766] rounded-lg shadow-lg p-6 w-full h-[700px] max-w-md transition-transform",
          open ? "scale-100" : "scale-95"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function AnswerContent({ children }) {
  return <div className="p-4">{children}</div>;
}

export function AnswerHeader({ children }) {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="text-lg font-semibold">{children}</div>
      {/* <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
        <X size={20} />
      </button> */}
    </div>
  );
}

export function AnswerTitle({ children }) {
  return <h2 className="text-xl font-bold">{children}</h2>;
}

export function AnswerFooter({ children }) {
  return <div className="p-4 border-t flex justify-end gap-2">{children}</div>;
}
