import React from "react";
import toast, { Toaster, ToastOptions } from "react-hot-toast";
import styles from "../../styles/components/Toast/Toast.module.scss";

const duration = 4000;

export function showToast(
	message: string,
  type: "success" | "error"
) {
	if (type === "success") {
		toast.success(message, { duration });
	} else if (type === "error") {
		toast.error(message, { duration });
	}
}

export function showToastPromise<T>(
	promise: Promise<T> | (() => Promise<T>),
	msgs: {
		loading: string;
		success: string;
		error: string;
	},
	options?: ToastOptions
	) {
		// Always show loading toast until promise resolves/rejects
		let toastId: string | number | undefined;
		const p = typeof promise === "function" ? promise() : promise;
		toastId = toast.loading(msgs.loading, {
			...options,
			className: styles.toast,
			duration: Infinity // keep loading toast until promise settles
		});

		p.then(
			() => {
				toast.dismiss(toastId);
				toast.success(msgs.success, {
					...options,
					className: styles.toast,
					duration
				});
			},
			() => {
				toast.dismiss(toastId);
				toast.error(msgs.error, {
					...options,
					className: styles.toast,
					duration
				});
			}
		);
		return p;
	}

export const Toast: React.FC = () => (
	<Toaster
		position="top-right"
		reverseOrder={false}
		gutter={8}
		toastOptions={{
      duration,
			className: styles.toast,
		}}
	/>
);
