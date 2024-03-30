<script lang="ts">
	import { tTop, check } from '$lib/pageMove';
	import { onMount } from 'svelte';
	onMount(() => {
		check.set(false);
	});

	tTop.set(160);

</script>

<h1>dashboard</h1>
