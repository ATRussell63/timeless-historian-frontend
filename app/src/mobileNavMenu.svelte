<script>
    import * as Drawer from "$lib/components/ui/drawer/index.js";
    import Button from "$lib/components/ui/button/button.svelte";
    import mobileNavThemeSwitch from "./mobileNavThemeSwitch.svelte";
    import THLightLogo from "$lib/images/TH-Logo-White.svg";
    import THBlackLogo from "$lib/images/TH-Logo-Black.svg";
    import { derived } from "svelte/store";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import MobileNavThemeSwitch from "./mobileNavThemeSwitch.svelte";

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
</script>

<div class="flex flex-row mb-2 h-12 bg-foreground">
    <Drawer.Root direction="left" bind:open={isOpen}>
        <Drawer.Trigger class=''>
            <div class="flex flex-row items-center justify-between h-[48px]">
                <Button class="h-[48px] sidebarButton mx-0 my-0 px-3 py-0 rounded-none bg-background" variant="link" href="/">
                    <div>
                        <img
                            class="thLogo absolute scale-100 dark:scale-0"
                            src={THBlackLogo}
                            alt="TH Logo"
                        />
                        <img
                            class="thLogo scale-0 dark:scale-100"
                            src={THLightLogo}
                            alt="TH Logo"
                        />
                    </div>
                </Button>
                <span class="absolute left-1/2 -translate-x-1/2 text-background w-full max-w-[70%]" style="font-family: Trajan; font-size: 20px;">
                    {pageTitle}
                </span>
            </div>
        </Drawer.Trigger>
        <Drawer.Content>
            <Button class='rounded-none bg-background h-14 border-b-1 py-8' variant='ghost'>
                <span class='menuButton'>
                    Menu
                </span>
            </Button>
            {#each menuButtons as mb}
            <Button class='rounded-none bg-accent dark:bg-card h-14 border-b-1' variant='link' onclick={() => {closeNav(mb.href)}}>
                <span class='menuButton'>
                    {mb.label}
                </span>
            </Button>
            {/each}
            <MobileNavThemeSwitch />
        </Drawer.Content>
    </Drawer.Root>
</div>


<style>
    .menuButton {
        font-family: 'Trajan';
        font-size: 24px;
    }
</style>