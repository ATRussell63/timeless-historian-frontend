<script>
    import TopNavButton from "./TopNavButton.svelte";
    import TopNavLoginButton from "./TopNavLoginButton.svelte";
    import TopNavDisabledButton from "./TopNavDisabledButton.svelte";
</script>

<nav class="bg-white text-white pt-8 pb-0 flex items-center justify-center">
    <!-- <div class='flex flex-col w-[203px]'>
    </div> -->
    <!-- <div class='flex flex-col'> -->
      <div class='flex flex-row pb-0 items-end h-[46px] w-full'>
        <div class='mr-auto' style='visibility:hidden;'>
        <TopNavLoginButton />
        </div>
        <div class='mr-2'>
        <TopNavButton label='Search' url='/search'/>
        </div>
        <div class='ml-2'>
        <TopNavButton label='Bulk Search' url='/bulk'/>
        </div>
        <div class='ml-auto'>
        <TopNavLoginButton />
        </div>
      </div>
    <!-- </div> -->
    <!-- <div class="flex flex-col w-[203px]"> -->
      
    <!-- </div> -->
  </nav>

<style>

nav {
  background: rgba(76, 175, 80, 0.0);
  /* background-color: black; */
	/* box-shadow: 0 8px 8px -6px rgba(0, 0, 0, 0.3); */
}

</style>