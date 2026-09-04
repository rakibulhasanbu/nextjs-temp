import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Construction } from "lucide-react"

export function ComingSoon({ slice }: { slice: string }) {
  return (
    <Empty className="rounded-lg border border-dashed bg-card">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Construction />
        </EmptyMedia>
        <EmptyTitle>Not built yet</EmptyTitle>
        <EmptyDescription>
          This screen ships in {slice}. The route, navigation and app shell are wired up now.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
