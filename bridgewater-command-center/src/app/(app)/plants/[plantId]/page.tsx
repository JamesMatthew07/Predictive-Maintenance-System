import { PlantScreen } from "@/components/screens/plant-screen";

export default async function PlantPage({
  params,
}: {
  params: Promise<{ plantId: string }>;
}) {
  const { plantId } = await params;

  return <PlantScreen plantId={plantId} />;
}
