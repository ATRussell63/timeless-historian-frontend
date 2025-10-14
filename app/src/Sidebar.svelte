<script>
  import SidebarHomeButton from "./SidebarHomeButton.svelte";
  import SidebarButton from "./SidebarButton.svelte";
</script>

<div class="bg-background rounded-xl flex flex-col items-end py-1 lg:py-2 border">
  <SidebarHomeButton />
  <SidebarButton label="About" url="/about" />
</div>

<style>
</style>
