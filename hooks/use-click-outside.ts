import { useEffect, type RefObject } from "react"

export function useClickOutside(
	ref: RefObject<HTMLElement | null>,
	onOutsideClick: () => void,
) {
	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			if (!ref.current?.contains(e.target as Node)) {
				onOutsideClick()
			}
		}

		document.addEventListener("mousedown", handleClick)
		return () => document.removeEventListener("mousedown", handleClick)
	}, [ref, onOutsideClick])
}
