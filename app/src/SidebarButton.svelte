<script>
    import Button from "$lib/components/ui/button/button.svelte";
    let { url, label } = $props();
</script>

<Button href={url} variant="link">
    <span class="trajan sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[24px]">{label}</span>
</Button>
