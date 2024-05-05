import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut } from "lucide-react";
import axios from "axios";
import { usePathname } from "next/navigation";


export const SwitchMode = () => {
  const pathname = usePathname();
  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");

  async function switchMode(isTeacher: boolean) {
    await axios.patch("/api/switchMode", { isTeacher });
  }

  const tExit = async () => switchMode(false);
  const tEnter = async () => switchMode(true);

  return isTeacherPage || isCoursePage ? (
    <Link href="/" onClick={tExit}>
      <Button size="sm" variant="ghost">
        <LogOut className="h-4 w-4 mr-2" />
        Exit
      </Button>
    </Link>
  ) : (
    <Link href="/teacher/courses" onClick={tEnter}>
      <Button size="sm" variant="ghost">
        Teacher mode
      </Button>
    </Link>
  );
};
