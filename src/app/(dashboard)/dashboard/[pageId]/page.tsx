import { PageEditorGate } from "@/components/editor/page-editor-gate";

type Params = { pageId: string };

export default function PageDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  return <PageEditorGate params={params} />;
}
