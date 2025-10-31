<script lang="ts">
	// Types/constants
	import type { Snippet, ComponentProps } from 'svelte'


	// Props
	let {
		isExpanded = $bindable(false),

		// eslint-disable-next-line prefer-const -- Other prop must be mutable.
		showAccordionMarker = false,

		// eslint-disable-next-line prefer-const -- Other prop must be mutable.
		tooltipMaxWidth,
		tooltipButtonTriggerPlacement = 'around',
		tooltipHoverTriggerPlacement = 'around',

		// eslint-disable-next-line prefer-const -- Other prop must be mutable.
		children,

		// eslint-disable-next-line prefer-const -- Other prop must be mutable.
		ExpandedContent: ExpandedContent,
	}: {
		isExpanded: boolean
		showAccordionMarker?: boolean

		tooltipMaxWidth?: string
		tooltipButtonTriggerPlacement?: ComponentProps<typeof Tooltip>['buttonTriggerPlacement']
		tooltipHoverTriggerPlacement?: ComponentProps<typeof Tooltip>['hoverTriggerPlacement']

		children: Snippet
		ExpandedContent: Snippet<[{ isInTooltip?: boolean }]>
	} = $props()


	// Components
	// Transitions/animations
	import { expoOut } from 'svelte/easing'
	import { fade } from 'svelte/transition'

	import BlockTransition from '@/components/BlockTransition.svelte'
	import Tooltip from '@/components/Tooltip.svelte'
</script>


<BlockTransition>
	<details
		class="with-expanded-content"
		bind:open={isExpanded}
	>
		<summary
			class:no-marker={!showAccordionMarker}
		>
			<Tooltip
				isEnabled={!isExpanded}
				buttonTriggerPlacement={tooltipButtonTriggerPlacement}
				hoverTriggerPlacement={tooltipHoverTriggerPlacement}
				style="
					--popover-padding: 0;
					--popover-backgroundColor: transparent;
					--popover-borderColor: transparent;
				"
			>
				{@render children()}

				{#snippet TooltipContent()}
					{#if !isExpanded}
						<div
							class="expanded-tooltip-content"
							style:max-width={tooltipMaxWidth}
						>
							{@render ExpandedContent({ isInTooltip: true })}
						</div>
					{/if}
				{/snippet}
			</Tooltip>
		</summary>

		{#if isExpanded}
			<div
				class="expanded-content"
				transition:fade={{ duration: 200, easing: expoOut }}
			>
				{@render ExpandedContent({ isInTooltip: false })}
			</div>
		{/if}
	</details>
</BlockTransition>


<style>
	details {
		display: grid;

		transition-property: gap;

		&[open] {
			gap: 0.75em;
		}

		summary {
			&.no-marker {
				gap: 0;

				&::after {
					display: none;
				}
			}
		}

		.expanded-content {
			display: grid;
			grid-template-columns: minmax(0, 1fr);

			inline-size: 0;
			min-inline-size: 100%;
			min-inline-size: -webkit-fill-available;

			font-size: 0.66em;
			text-align: center;
		}

		.expanded-tooltip-content {
			max-width: 16em;
		}
	}
</style>
