import PaymentDetails from "@/components/paymentDetails/PaymentDetails";


const PaymentDetailsPage = async({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
     const { id } = await params;
  return <section>
    <PaymentDetails id={id}/>
  </section>;
};

export default PaymentDetailsPage;