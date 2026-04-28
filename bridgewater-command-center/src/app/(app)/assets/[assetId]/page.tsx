import { AssetScreen } from "@/components/screens/asset-screen";

export default async function AssetPage({
  params,
}: {
  params: Promise<{ assetId: string }>;
}) {
  const { assetId } = await params;

  return <AssetScreen assetId={assetId} />;
}
