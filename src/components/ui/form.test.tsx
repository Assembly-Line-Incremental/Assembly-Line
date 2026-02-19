import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
} from "./form";
import { Input } from "./input";

function TestForm({ error, showMessage = true }: { error?: string; showMessage?: boolean }) {
	const form = useForm({
		defaultValues: { name: "" },
	});

	if (error) {
		form.setError("name", { message: error });
	}

	return (
		<Form {...form}>
			<FormField
				control={form.control}
				name="name"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Name</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
						<FormDescription>Enter your name</FormDescription>
						{showMessage && <FormMessage />}
					</FormItem>
				)}
			/>
		</Form>
	);
}

describe("Form", () => {
	it("renders form with label and description", () => {
		render(<TestForm />);
		expect(screen.getByText("Name")).toBeDefined();
		expect(screen.getByText("Enter your name")).toBeDefined();
	});

	it("renders form control input", () => {
		render(<TestForm />);
		expect(screen.getByRole("textbox")).toBeDefined();
	});

	it("renders error message when error is set", () => {
		render(<TestForm error="Required field" />);
		expect(screen.getByText("Required field")).toBeDefined();
	});

	it("renders FormMessage with children when no error", () => {
		const form = useFormWrapper();
		render(form);
		expect(screen.getByText("Custom message")).toBeDefined();
	});
});

function useFormWrapper() {
	function Wrapper() {
		const form = useForm({
			defaultValues: { name: "" },
		});

		return (
			<Form {...form}>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage>Custom message</FormMessage>
						</FormItem>
					)}
				/>
			</Form>
		);
	}
	return <Wrapper />;
}
