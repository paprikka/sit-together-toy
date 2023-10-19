<script lang="ts">
	export let value: any;
	let isOpen = false;
</script>

<div class="container">
	<button on:click={() => (isOpen = !isOpen)}>debug</button>
	<pre hidden={!isOpen}>{JSON.stringify(value, null, 2)}</pre>
</div>

<style>
	.container {
		position: absolute;
		bottom: 1rem;
		left: 1rem;
		right: 1rem;
		max-height: 20vh;
		padding: 1rem;
		background-color: #222;
		display: flex;
		place-items: stretch;
		place-content: stretch;
	}

	.container button {
		position: absolute;
		top: -2rem;
		left: 0;
	}

	.container pre {
		overflow: auto;
	}
</style>
