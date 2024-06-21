<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import { signIn, signOut } from "@auth/sveltekit/client";

	var expires = false;

	function share(event) {
		var text = event.target.parentElement.querySelector("input").value;

		navigator.clipboard.writeText(text);
	}
</script>

<section>
	<h3>og</h3>

	{#if data.success}
		<h4>Here are your password protected URLs</h4>
		{#if data.shortened}
			<p>Shortened:</p>
			<div>
				<input type="text" readonly value={data.shortened} class="share" />
				<button on:click={share}>Copy</button>
			</div>
			<p>Unshortened:</p>
		{/if}
		<div>
			<input type="text" readonly value={data.unshortened} class="share" />
			<button on:click={share}>Copy</button>
		</div>
	{:else}
		{#if data.loginEnabled}
			{#if data.session}
				<p class="notice">
					Logged in as: {data.session.user.email}
					<br />
					If you want to use the public url shortener you need to:
					<br />
					<br />
					<button on:click={() => signOut()}> Logout </button>
				</p>
			{:else}
				<p class="notice">
					If you want to use the private url shortener you need to:
					<br />
					<br />
					<button on:click={() => signIn("discord")}> Login </button>
				</p>
			{/if}
		{/if}
		<p>Input the url you want to protect</p>
		<form method="">
			<input
				required
				name="url"
				type="url"
				placeholder="URL"
				autocomplete="off"
			/>
			<br />
			<input
				required
				name="pas"
				type="text"
				placeholder="Password"
				autocomplete="off"
			/>
			<br />
			<label>
				<input bind:checked={expires} name="expiry" type="checkbox" />
				Expires
			</label>
			{#if expires}
				<input required name="exp" type="datetime-local" />
				<br />
				<br />
			{:else}
				<br />
			{/if}
			<input type="submit" />
		</form>
	{/if}
</section>

<style>
	.share {
		width: 90%;
	}
</style>
