<script>
    import * as Drawer from "$lib/components/ui/drawer/index.js";
    import Button from "$lib/components/ui/button/button.svelte";
    import mobileNavThemeSwitch from "./mobileNavThemeSwitch.svelte";
    import THLightLogo from "$lib/images/TH-Logo-White.svg";
    import THBlackLogo from "$lib/images/TH-Logo-Black.svg";
    import { derived } from "svelte/store";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { mode } from "mode-watcher";
    import MobileNavThemeSwitch from "./mobileNavThemeSwitch.svelte";
    import { account_name } from "./store";
    import { logout } from "./store";
    import { LogOut } from "lucide-svelte";

    const pageTitle = $derived.by(() => {
        const title = $page.data.title ?? document.title
        if (title === "Timeless Historian") {
            return title;
        } else {
            return title.split('Timeless Historian - ')[1]
        }
    });

    let isOpen = $state(false);

    function closeNav(href) {
        isOpen = false
        goto(href)
    }

    const menuButtons = [
        { label: 'Home', href: '/'},
        { label: 'About', href: '/about'},
        { label: 'Search', href: '/search'},
        { label: 'Bulk', href: '/bulk'},
    ]

    function logAndClose() {
        logout()
        isOpen = false
    }
</script>

<div class="flex flex-row mb-2 h-12 bg-foreground">
    <Drawer.Root direction="left" bind:open={isOpen}>
        <Drawer.Trigger class=''>
            <div class="flex flex-row items-center justify-between h-[48px]">
                <Button class="h-[48px] sidebarButton mx-0 my-0 px-3 py-0 rounded-none bg-background" variant="link">
                    <div>
                        {#if mode.current !== 'dark'}
                        <img
                            class="h-[32px]"
                            src={THBlackLogo}
                            alt="TH Logo"
                        />
                        {:else}
                        <img
                            class="h-[32px]"
                            src={THLightLogo}
                            alt="TH Logo"
                        />
                        {/if}
                    </div>
                </Button>
                <span class="absolute left-1/2 -translate-x-1/2 text-background w-full max-w-[70%]" style="font-family: Trajan; font-size: 20px;">
                    {pageTitle}
                </span>
            </div>
        </Drawer.Trigger>
        <Drawer.Content class='flex flex-col'>
            <div class='flex flex-row rounded-none bg-background h-14 border-b-1 py-8 items-center justify-center'>
                <span class='menuButton'>
                    Menu
                </span>
            </div>
            {#each menuButtons as mb}
            <Button class='rounded-none bg-accent dark:bg-card h-14 border-b-1' variant='link' onclick={() => {closeNav(mb.href)}}>
                <span class='menuButton'>
                    {mb.label}
                </span>
            </Button>
            {/each}
            <MobileNavThemeSwitch />
            {#if $account_name !== null}
            <div class='flex flex-row justify-center mt-auto mb-30 bg-accent dark:bg-card py-6 border-y-1'>
            <div class='flex flex-col items-center text-[20px]'>
            <span class='fontin'>Logged in as {$account_name}</span>
            <Button class='mt-6 fontinSmallCaps text-[20px] p-6' onclick={logAndClose}>Logout<LogOut class='ml-2' /></Button>
            </div>
            </div>
            {/if}
        </Drawer.Content>
    </Drawer.Root>
</div>


<style>
    .menuButton {
        font-family: 'Trajan';
        font-size: 24px;
    }
</style>