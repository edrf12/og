<script>
	import { enhance } from "$app/forms";

	/** @type {import('./$types').PageData} */
	export let data;

	// var password = "";

	// async function submit() {
	// 	fetch("?", {
	// 		method: "POST",
	// 		body: JSON.stringify({ password: password, data: data.data }),
	// 	});
	// }
</script>

<section>
	<h3>This URL is password protected</h3>
	<p>Input the password given by the person who created the link to proceed</p>

	<form method="POST" use:enhance>
		<label>
			<input
				style={data.invalidPass ? "border-color:red" : ""}
				name="password"
				type="password"
				placeholder="Password"
			/>
			{data.invalidPass ? "The provided password does not match!" : ""}
		</label>
		<br />
		<input type="submit" />
	</form>
</section>
