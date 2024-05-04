import Image from "next/image"

export const Logo = () => {
	return <div className="flex gap-1 items-center">
		<Image height={130} width={70} alt="logo" src="/logo.png" />
		<p className="text-2xl">SkillSynth</p>
	</div>
}
