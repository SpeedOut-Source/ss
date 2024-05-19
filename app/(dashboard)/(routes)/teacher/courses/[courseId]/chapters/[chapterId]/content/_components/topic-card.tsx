import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TopicType } from "@/lib/type";

export default function TopicCard({ topic }: { topic: TopicType }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{topic.title}</CardTitle>
        <CardDescription>{topic.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{topic.prompt}</p>
      </CardContent>
    </Card>
  );
}
