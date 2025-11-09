import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

type PageHeaderProps = {
  title: string;
  onAdd: () => void;
  onSearch: (query: string) => void;
  searchPlaceholder: string;
  addLabel: string;
};

export function PageHeader({ title, onAdd, onSearch, searchPlaceholder, addLabel }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <div className="flex items-center gap-4">
        <Input
          type="search"
          placeholder={searchPlaceholder}
          className="w-64"
          onChange={(e) => onSearch(e.target.value)}
        />
        <Button onClick={onAdd} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          {addLabel}
        </Button>
      </div>
    </div>
  );
}
