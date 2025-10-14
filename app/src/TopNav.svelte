<script>
  import TopNavButton from "./TopNavButton.svelte";
  import TopNavLoginButton from "./TopNavLoginButton.svelte";
</script>

<nav class="bg-white text-white pt-8 pb-0 flex items-center justify-center">
  <div class="flex flex-row pb-0 ml-4 justify-center items-end gap-2 h-[46px] w-full">
    <div class='grow-2'></div>
    <TopNavButton label="Search" url="/search" />
    <TopNavButton label="Bulk Search" url="/bulk" />
    <div class='grow-1'></div>
    <TopNavLoginButton />
  </div>
</nav>

<style>
  nav {
    background: rgba(76, 175, 80, 0);
  }
</style>
