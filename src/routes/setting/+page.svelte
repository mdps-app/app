<script>
	import { tTop , check } from '$lib/pageMove';
    import { onMount } from 'svelte';
	onMount(() => {
		check.set(false);
	});

	tTop.set(490);
</script>

<h1>setting</h1>