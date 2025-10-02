<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import THLightLogo from "$lib/images/TH-Logo-White.svg";
    import THBlackLogo from "$lib/images/TH-Logo-Black.svg";
</script>

<Button class="h-11 sidebarButton" variant="link" href="/">
    <div>
        <img
            class="mr-3 thLogo absolute scale-100 dark:scale-0"
            src={THBlackLogo}
            alt="TH Logo"
        />
        <img
            class="mr-3 thLogo scale-0 dark:scale-100"
            src={THLightLogo}
            alt="TH Logo"
        />
    </div>
    <span class="sidebarHomeButtonText">Home</span>
</Button>
