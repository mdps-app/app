<script>
	import { tTop , check } from '$lib/pageMove';
    import { onMount } from 'svelte';
	onMount(() => {
		check.set(false);
	});

	tTop.set(380);
</script>

<h1>map</h1>
