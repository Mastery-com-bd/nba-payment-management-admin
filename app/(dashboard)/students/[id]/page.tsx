import StudentDetails from "@/components/studentDetails/StudentDetails";

const STudentDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
     const {id} = await params;
  return <section>
<StudentDetails id={id}/>
  </section>;
};

export default STudentDetailsPage;