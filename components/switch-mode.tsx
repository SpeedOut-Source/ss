import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, LogOut } from "lucide-react";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const SwitchMode = () => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/courses");

  async function switchMode(isTeacher: boolean) {
    setIsLoading(true);
    try {
      await axios.patch("/api/switchMode", { isTeacher });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const tExit = async () => switchMode(false);
  const tEnter = async () => switchMode(true);

  return isTeacherPage || isCoursePage ? (
    <Link href="/" onClick={tExit}>
      <Button size="sm" variant="ghost" disabled={isLoading}>
        {isLoading ? (
          <>
            {" "}
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
          </>
        ) : (
          <>
            <LogOut className="h-4 w-4 mr-2" />
            Exit
          </>
        )}
      </Button>
    </Link>
  ) : (
    <Link href="/teacher/courses" onClick={tEnter}>
      <Button size="sm" variant="ghost" disabled={isLoading}>
        {isLoading ? (
          <>
            {" "}
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
          </>
        ) : (
          "Teacher mode"
        )}
      </Button>
    </Link>
  );
};
