<script lang="ts">
	let editMode = $state(false);
</script>

<svelte:head>
	<title>Shift Scheduler</title>
</svelte:head>

<div class="item-container ui-flex-grid-row ui-none-select" class:edit-mode={editMode}>
	<div class="item item1" style="left: -100%"></div>

	<div class="item item2" style="left: 0"></div>

	<div class="item item3" style="left: 100%"></div>
</div>

<div
	class="edit-mode ui-flex-grid-row ui-auto-scroll-x ui-hide-scrollbar"
	class:open={editMode}
	style="--gap: 0.5rem"
></div>

<style>
	.item-container {
		--week-days-height: 2.5rem;
		--edit-mode-height: 4.5rem;

		position: relative;
		overflow: hidden;
		width: 100%;
		height: 100%;
		transition: height 0.25s ease;
	}

	.item-container.edit-mode {
		height: calc(100% - var(--edit-mode-height));
	}

	.edit-mode {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		height: var(--edit-mode-height);
		transform: translateY(100%);
		transition: transform 0.25s ease;
	}

	.edit-mode.open {
		transform: translateY(0);
	}

	.item {
		position: absolute;
		top: 0;
		bottom: 0;
		min-width: 100%;
	}

	.item-content {
		width: calc(100% - 0.25rem);
		height: calc(100% - 0.25rem);
	}

	.week-days {
		height: var(--week-days-height);
		padding: 1px 0;
	}

	.days {
		height: 100%;
		padding: 1px 0;
	}

	.week-day,
	.day {
		border-radius: var(--ui-radius);
		border: var(--ui-border-width) var(--ui-border-style) var(--ui-border-color);
	}

	.item-container.no-border .week-days,
	.item-container.no-border .days {
		border: none;
	}

	.week-day {
		width: calc(100% / 7);
		overflow: hidden;
		height: 100%;
		font-size: 115%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.saturday,
	.sunday {
		font-weight: bold;
	}

	.saturday,
	.sunday {
		background-color: var(--ui-muted);
		color: var(--ui-muted-text);
	}

	.day {
		height: 100%;
		overflow: hidden;
		cursor: pointer;
	}

	.day.today::after {
		content: '';
		position: absolute;
		z-index: 9;
		top: -1rem;
		left: -1rem;
		width: 2rem;
		height: 2rem;
		border-radius: var(--ui-radius);
		border-bottom-right-radius: 50%;
		background-color: orange;
		filter: blur(1rem);
		animation: fade-in 0.5s;
	}

	.day.note::before {
		content: '';
		position: absolute;
		z-index: 8;
		bottom: -1rem;
		right: -1rem;
		width: 2rem;
		height: 2rem;
		border-radius: var(--ui-radius);
		border-top-left-radius: 50%;
		background-color: red;
		filter: blur(1rem);
		animation: fade-in 0.5s;
	}

	.day .date {
		position: absolute;
		top: 0;
		left: 0;
		padding: 0.5vmin;
		font-size: 3vmin;
		font-size: clamp(0rem, 3vmin, 1rem);
		border-radius: inherit;
	}

	.day .shift {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 5vmin;
		font-weight: bold;
		color: var(--shift-color, var(--ui-text));
		border-radius: inherit;
	}

	@media (orientation: landscape) {
		.day .shift {
			left: 4vmin;
		}
	}

	@media (orientation: portrait) {
		.day .shift {
			top: 5vmin;
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.shift-card.active {
		border-color: var(--ui-text);
	}
</style>
