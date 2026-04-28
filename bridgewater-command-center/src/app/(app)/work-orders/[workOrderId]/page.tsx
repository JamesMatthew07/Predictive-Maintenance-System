import { WorkOrderScreen } from "@/components/screens/work-order-screen";

export default async function WorkOrderPage({
  params,
}: {
  params: Promise<{ workOrderId: string }>;
}) {
  const { workOrderId } = await params;

  return <WorkOrderScreen workOrderId={workOrderId} />;
}
