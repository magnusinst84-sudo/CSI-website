import TypedEventsPage from "@/components/events/TypedEventsPage";

export default function WorkshopsPage() {
  return (
    <TypedEventsPage
      type="workshop"
      title="Workshops"
      subtitle="Hands-on learning sessions and technical workshops by CSI VIT Chennai."
      searchPlaceholder="Search workshops by title…"
      emptyTitle="No workshops yet"
      emptyDescription="Workshop events will appear here once they are scheduled. Check back for upcoming skill-building sessions."
      extraField="duration"
    />
  );
}
