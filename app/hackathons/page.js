import TypedEventsPage from "@/components/events/TypedEventsPage";

export default function HackathonsPage() {
  return (
    <TypedEventsPage
      type="hackathon"
      title="Hackathons"
      subtitle="Compete, collaborate, and build innovative solutions at CSI VIT Chennai hackathons."
      searchPlaceholder="Search hackathons by title…"
      emptyTitle="No hackathons yet"
      emptyDescription="Hackathon events will appear here once they are published. Stay tuned for upcoming coding marathons and innovation challenges."
      extraField="teamSize"
    />
  );
}
