import { getIsTeacher } from "@/actions/get-is-teacher"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

const TeacherLayout = async ({ children }: { children: React.ReactNode }) => {
	const { userId } = auth()
	const isTeacher = await getIsTeacher(userId);
	// console.log(userId, "userId", "teacherId")

	if (!isTeacher) {
		return redirect("/")
	}

	return <>{children}</>
}

export default TeacherLayout
