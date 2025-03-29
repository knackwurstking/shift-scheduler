<script lang="ts">
	let { children } = $props();
</script>

<div class="ui-app-bar" data-position="top" data-fixed>
	<div class="left">
		<button
			class="date-picker"
			style="
                display: none;
                margin: 0.25rem;
                height: calc(100% - 0.5rem);
                text-wrap: nowrap;
            "
			data-variant="full"
		>
			YYYY / MM
		</button>

		<button
			class="back"
			style="display: none"
			data-variant="ghost"
			color="primary"
			data-icon
			aria-label="back"
			onclick={() => history.back()}
		>
			<div class="bi bi-chevron-left"></div>
		</button>
	</div>

	<div class="center">
		<h4 class="title ui-ellipsis">Shift Scheduler</h4>
	</div>

	<div class="right">
		<button class="edit" style="display: none" data-variant="ghost" data-icon aria-label="edit">
			<i class="bi bi-pen"></i>
		</button>

		<button class="today" style="display: none" data-variant="ghost" data-icon aria-label="today">
			<i class="bi bi-calendar-event"></i>
		</button>

		<button
			class="printer"
			style="display: none"
			data-variant="ghost"
			data-icon
			aria-label="printer"
		>
			<i class="bi bi-printer"></i>
		</button>

		<button
			class="settings"
			style="display: none"
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

{@render children()}
