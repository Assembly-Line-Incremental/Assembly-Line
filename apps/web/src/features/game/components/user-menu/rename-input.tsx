"use client";

import { useEffect, useRef, useState } from "react";

export interface RenameInputProps {
	initialName: string;
	onCommit: (name: string) => void;
	onCancel: () => void;
}

export function RenameInput({ initialName, onCommit, onCancel }: RenameInputProps) {
	const [value, setValue] = useState(initialName);
	const inputRef = useRef<HTMLInputElement>(null);
	const committedRef = useRef(false);

	useEffect(() => {
		inputRef.current?.select();
	}, []);

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			e.preventDefault();
			const trimmed = value.trim();
			if (trimmed.length > 0) {
				committedRef.current = true;
				onCommit(trimmed);
			}
		} else if (e.key === "Escape") {
			e.preventDefault();
			committedRef.current = true;
			onCancel();
		}
	}

	return (
		<input
			ref={inputRef}
			aria-label="Rename save"
			value={value}
			onChange={(e) => setValue(e.target.value)}
			onKeyDown={handleKeyDown}
			onBlur={() => {
				if (committedRef.current) return;
				const trimmed = value.trim();
				if (trimmed.length > 0) onCommit(trimmed);
				else onCancel();
			}}
			maxLength={32}
			className="w-full rounded bg-white/8 px-2 py-0.5 text-[12px] font-semibold text-white/90 ring-1 ring-[#00D4FF]/40 outline-none focus:ring-[#00D4FF]/70"
		/>
	);
}
