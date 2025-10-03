<script>
  import SidebarHomeButton from "./SidebarHomeButton.svelte";
  import SidebarButton from "./SidebarButton.svelte";
</script>

<div class="Sidebar flex flex-col items-end py-2 border">
  <SidebarHomeButton />
  <SidebarButton label="About" url="/about" />
</div>

<style>
  .Sidebar {
    background-color: hsl(var(--background));
    border-radius: 10px;
  }
</style>
