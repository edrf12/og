import { error, redirect } from "@sveltejs/kit";
import { decryptData } from "../../utils";

export function load({ url, params }) {
	var data = decryptData(params.data);
	var password = url.searchParams.get("p");

	if (data.exp !== false) {
		var today = new Date().getTime();

		if (today - data.exp > 0) {
			throw error(410, "The link you tried to access has expired");
		}
	}

	if (password) {
		if (password == data.pas) {
			redirect(307, data.url);
			return;
		} else {
			return { invalidPass: true };
		}
	}

	return { passwordAuth: true, orcidAuth: false };
}
