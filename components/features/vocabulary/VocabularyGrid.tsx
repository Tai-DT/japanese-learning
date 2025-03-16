// components/features/vocabulary/VocabularyGrid.tsx
import { VocabularyItem } from "@/types";
import VocabularyCard from "./VocabularyCard";

interface VocabularyGridProps {
  vocabulary: VocabularyItem[];
}

export default function VocabularyGrid({ vocabulary }: VocabularyGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vocabulary.map((item) => (
        <VocabularyCard key={item.id} item={item} />
      ))}
    </div>
  );
}
