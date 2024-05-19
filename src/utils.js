import { error } from "@sveltejs/kit";
import fernet from "fernet";

var s = new fernet.Secret("0iVuiunRS3ngHN3pHQRYGXffMmxHdGyB78MGLxwGC3c");

export function decryptData(data) {
	var encryptedData = new fernet.Token({
		secret: s,
		token: data,
		ttl: 0,
	});
	var decrypted;
	try {
		decrypted = encryptedData.decode();
	} catch {
		throw error(400, "Invalid token");
	}

	var jsonData;
	try {
		jsonData = JSON.parse(decrypted);
	} catch {
		throw error(400, "Token could not be parsed");
	}
	return jsonData;
}

export function encryptData(data) {
	var token = new fernet.Token({
		secret: s,
		token: JSON.stringify(data),
		ttl: 0,
	});
	var encrypted;
	try {
		encrypted = token.encode();
	} catch {
		throw error(500, "Error when encrypting data");
	}

	return encrypted;
}
