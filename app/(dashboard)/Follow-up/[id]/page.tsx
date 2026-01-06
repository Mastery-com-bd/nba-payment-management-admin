import FollowUpDetails from "@/components/followupDetails/FollowUpDetails";

const FOllowUpDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
    const { id } = await params;
  return (
    <section>
      <FollowUpDetails id={id} />
    </section>
  );
};

export default FOllowUpDetailsPage;
