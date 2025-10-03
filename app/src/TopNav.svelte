<script>
  import TopNavButton from "./TopNavButton.svelte";
  import TopNavLoginButton from "./TopNavLoginButton.svelte";
</script>

<nav class="bg-white text-white pt-8 pb-0 flex items-center justify-center">
  <div class="flex flex-row pb-0 items-end h-[46px] w-full">
    <div class="mr-auto" style="visibility:hidden;">
      <TopNavLoginButton />
    </div>
    <div class="mr-2">
      <TopNavButton label="Search" url="/search" />
    </div>
    <div class="ml-2">
      <TopNavButton label="Bulk Search" url="/bulk" />
    </div>
    <div class="ml-auto">
      <TopNavLoginButton />
    </div>
  </div>
</nav>

<style>
  nav {
    background: rgba(76, 175, 80, 0);
  }
</style>
