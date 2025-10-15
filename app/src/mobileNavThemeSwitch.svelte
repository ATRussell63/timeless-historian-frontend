<script>
    import Switch from "$lib/components/ui/switch/switch.svelte";
    import { Sun, Moon } from "lucide-svelte";
    import { mode, toggleMode } from "mode-watcher";

</script>

<div class='flex flex-row mt-5 mx-auto items-center'>
    <span class='mr-4 fontinSmallCaps themeSwitchLabel' >Theme:</span>
    <Moon />
    <Switch class='mx-2' checked={mode.current === 'light'} onCheckedChange={toggleMode} />
    <Sun />
</div>

<style>
    .themeSwitchLabel {
        font-size: 20px;
    }
</style>