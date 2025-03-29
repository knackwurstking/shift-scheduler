<script lang="ts">
	let { children } = $props();
</script>

<div class="ui-app-bar" data-position="top" data-fixed>
	<div class="left">
		<button
			class="date-picker"
			style="
                margin: 0.25rem;
                height: calc(100% - 0.5rem);
                text-wrap: nowrap;
            "
			data-variant="full"
		>
			YYYY / MM
		</button>
	</div>

	<div class="right">
		<button class="edit" data-variant="ghost" data-icon aria-label="edit">
			<i class="bi bi-pen"></i>
		</button>

		<button class="today" data-variant="ghost" data-icon aria-label="today">
			<i class="bi bi-calendar-event"></i>
		</button>

		<button class="printer" data-variant="ghost" data-icon aria-label="printer">
			<i class="bi bi-printer"></i>
		</button>

		<button
			class="settings"
			data-variant="ghost"
			data-icon
			aria-label="settings"
			onclick={() => {
				location.hash = '#settings';
			}}
		>
			<i class="bi bi-gear"></i>
		</button>
	</div>
</div>

<div style="padding-top: var(--ui-app-bar-height); width: 100%; height: 100%;">
	{@render children()}
</div>
