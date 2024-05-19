import { Loader2 } from "lucide-react";
import { Button } from "./button";

export default function LoadingButton({
  loading,
  content,
  loadingContent,
  onClick,
}: {
  loading: boolean;
  content: string;
  loadingContent: string;
  onClick: () => void;
}) {
  return (
    <Button onClick={onClick}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {loadingContent}
        </>
      ) : (
        content
      )}
    </Button>
  );
}
