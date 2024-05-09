export function ShowContent({ content }: { content: string }) {
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <p className="text-sm mt-2">{content}</p>
    </div>
  );
}
