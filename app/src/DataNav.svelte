<script>
    import TopNavButton from "./TopNavButton.svelte";
</script>

<nav class="bg-white text-white pt-6 pb-0 flex items-center justify-center">
  <div class="flex flex-row pb-0 ml-4 justify-center items-end gap-2 h-[46px] w-full">
    <TopNavButton label="Top Jewels" url="/data/joats" parent=false />
    <TopNavButton label="Class Affinity" url="/data/class_aff" parent=false />
    <TopNavButton label="VIPs" url="/data/vips" parent=false />
    <TopNavButton label="Keystones by League" url="/data/keystone" parent=false />
  </div>
</nav>

<style>
  nav {
    background: rgba(76, 175, 80, 0);
  }
</style>