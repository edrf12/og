import { error } from "@sveltejs/kit";
import fernet from "fernet";

export function decryptData(data) {
	var s = new fernet.Secret("0iVuiunRS3ngHN3pHQRYGXffMmxHdGyB78MGLxwGC3c");
	var encryptedData = new fernet.Token({
		secret: s,
		ttl: 0,
	});
	var decrypted;
	try {
		decrypted = encryptedData.decode(data);
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
	var s = new fernet.Secret("0iVuiunRS3ngHN3pHQRYGXffMmxHdGyB78MGLxwGC3c");
	var token = new fernet.Token({
		secret: s,
		ttl: 0,
	});
	var encrypted;
	try {
		encrypted = token.encode(JSON.stringify(data));
	} catch {
		throw error(500, "Error when encrypting data");
	}

	return encrypted;
}
