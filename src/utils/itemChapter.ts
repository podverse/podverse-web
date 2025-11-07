import { DTOItemChapter } from "podverse-helpers";

type ChapterNavigationParams = {
  currentChapter: DTOItemChapter;
  chapters: DTOItemChapter[];
  direction: "previous" | "next";
};

export function getAdjacentChapter({
  currentChapter,
  chapters,
  direction,
}: ChapterNavigationParams): DTOItemChapter | null {
  if (!currentChapter || !Array.isArray(chapters) || chapters.length === 0) return null;

  const filteredChapters = chapters.filter(ch => ch.table_of_contents !== false);

  const sortedChapters = filteredChapters.slice().sort((a, b) => {
    const aStart = typeof a.start_time === "string" ? parseFloat(a.start_time) : a.start_time;
    const bStart = typeof b.start_time === "string" ? parseFloat(b.start_time) : b.start_time;
    return aStart - bStart;
  });

  const currentIdx = sortedChapters.findIndex(
    ch => ch.id_text === currentChapter.id_text
  );

  if (currentIdx === -1) return null;

  if (direction === "next" && currentIdx < sortedChapters.length - 1) {
    return sortedChapters[currentIdx + 1];
  }
  if (direction === "previous" && currentIdx > 0) {
    return sortedChapters[currentIdx - 1];
  }

  return null;
}
