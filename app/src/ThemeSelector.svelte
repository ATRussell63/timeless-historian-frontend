<script>
    import * as Card from "$lib/components/ui/card";
    import Button from "$lib/components/ui/button/button.svelte";
    import Sun from "lucide-svelte/icons/sun";
    import Moon from "lucide-svelte/icons/moon";
    import { mode, toggleMode } from "mode-watcher";
</script>

<Button onclick={toggleMode} variant="outline" size="icon">
    {#if mode.current !== 'dark'}
    <Sun
        class="h-[1.2rem] w-[1.2rem]"
    />
    {:else}
    <Moon
        class="h-[1.2rem] w-[1.2rem]"
    />
    {/if}
</Button>
