import { encryptData } from "../utils";

import {
	SHORT_API_KEY,
	SHORT_DOMAIN,
	SHORT_PROVIDER,
	SHORT_API_KEY_PUBLIC,
	SHORT_DOMAIN_PUBLIC,
	SHORT_PROVIDER_PUBLIC,
	AUTH_ENABLED,
	LOGIN_ALLOWED,
} from "$env/static/private";

const allowedUsers = JSON.parse(LOGIN_ALLOWED);
const loginEnabled = AUTH_ENABLED == "true";

function isValidUrl(string) {
	try {
		new URL(string);
		return true;
	} catch (err) {
		return false;
	}
}

export async function load({ locals, url }) {
	const session = await locals.auth();

	var destination = url.searchParams.get("url");
	var password = url.searchParams.get("pas");
	var expiry = url.searchParams.get("exp");
	var provider = SHORT_PROVIDER;
	var domain = SHORT_DOMAIN;
	var apikey = SHORT_API_KEY;

	if (loginEnabled) {
		if (!(session && allowedUsers.includes(session.user.email))) {
			provider = SHORT_PROVIDER_PUBLIC;
			domain = SHORT_DOMAIN_PUBLIC;
			apikey = SHORT_API_KEY_PUBLIC;
		}
	} else if (!provider) {
		provider = SHORT_PROVIDER_PUBLIC;
		domain = SHORT_DOMAIN_PUBLIC;
		apikey = SHORT_API_KEY_PUBLIC;
	}

	if (destination && password) {
		// Just URL validation
		if (isValidUrl(destination) == false) {
			return {
				success: false,
				reason: 1,
				session: session,
				loginEnabled: loginEnabled,
			}; // The url is not valid
		}

		var data;

		if (expiry) {
			var date = new Date(expiry);

			data = {
				url: destination,
				pas: password,
				exp: date.getTime(),
			};
		} else {
			data = {
				url: destination,
				pas: password,
				exp: false,
			};
		}

		if (data == null) {
			return {
				success: false,
				reason: 2,
				session: session,
				loginEnabled: loginEnabled,
			}; // There was an error encrypting the data
		}

		var protectedURL = `${url.origin}/${encryptData(data)}`;

		//Shorten the URL (If a provider is given)
		if (provider == "shortio") {
			var shortener = {
				domain: domain,
				originalURL: protectedURL,
			};

			var response = await fetch("https://api.short.io/links", {
				method: "POST",
				headers: {
					accept: "application/json",
					"Content-Type": "application/json",
					authorization: apikey,
				},
				body: JSON.stringify(shortener),
			});
			var json = await response.json();

			if (json.shortURL) {
				return {
					success: true,
					shortened: json.shortURL,
					unshortened: protectedURL,
				};
			} else {
				return { success: false, reason: 3 }; // The service did not return a short url (And shorteners are enabled)
			}
		} else if (provider == "tinyurl") {
			var tinyurl = {
				domain: domain,
				url: protectedURL,
			};

			var response = await fetch("https://api.tinyurl.com/create", {
				method: "POST",
				headers: {
					accept: "application/json",
					"Content-Type": "application/json",
					authorization: `Bearer ${apikey}`,
				},
				body: JSON.stringify(tinyurl),
			});
			var json = await response.json();

			console.log(json);
			if (json.data.tiny_url) {
				return {
					success: true,
					shortened: json.data.tiny_url,
					unshortened: protectedURL,
				};
			} else {
				return { success: false, reason: 3 }; // The service did not return a short url (And shorteners are enabled)
			}
		} else {
			return { success: true, unshortened: protectedURL, reason: 4 }; // Give a reason for no short URL (Shorteners are disabled)
		}
	}

	return {
		success: false,
		reason: 0,
		session: session,
		loginEnabled: loginEnabled,
	}; // We don't know what went wrong
}
