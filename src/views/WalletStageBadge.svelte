<script lang="ts">
	// Types/constants
	import type { RatedWallet } from '@/schema/wallet'
	import { type WalletLadderEvaluation, type WalletStage } from '@/schema/stages'
	import { stageToColor } from '@/utils/colors'
	import { getStageNumber } from '@/utils/stage'


	// Components
	import Tooltip from '@/components/Tooltip.svelte'
	import WalletStageSummary from './WalletStageSummary.svelte'


	// Props
	const {
		wallet,
		stage,
		ladderEvaluation,
		size = 'medium',
		onStageClick,
	}: {
		wallet: RatedWallet
		stage: WalletStage | 'NOT_APPLICABLE' | 'QUALIFIED_FOR_NO_STAGES' | null
		ladderEvaluation: WalletLadderEvaluation | null
		size?: 'small' | 'medium' | 'large'
		onStageClick?: (stageNumber: number) => void
	} = $props()


	// Derived
	const stageNumber = $derived(
		stage && ladderEvaluation ?
			getStageNumber(stage, ladderEvaluation)
		:
			null
	)

	const maxStages = $derived(
		ladderEvaluation?.ladder.stages.length ?? 3
	)

	const stageColor = $derived(
		stageToColor(stageNumber, maxStages)
	)

</script>


{#if stage && stage !== 'NOT_APPLICABLE' && stage !== 'QUALIFIED_FOR_NO_STAGES' && stageNumber !== null}
	{#if ladderEvaluation}
		<Tooltip
			buttonTriggerPlacement="behind"
			hoverTriggerPlacement="around"
		>
			{#snippet children()}
				<data
					data-badge={size}
					value={`STAGE_${stageNumber}`}
					style:--accent={stageColor}
				>
					<strong>
						Stage {stageNumber}
					</strong>
				</data>
			{/snippet}
			{#snippet TooltipContent()}
				<WalletStageSummary {wallet} {stage} {ladderEvaluation} {onStageClick} />
			{/snippet}
		</Tooltip>
	{:else}
		<data
			data-badge={size}
			value={`STAGE_${stageNumber}`}
			style:--accent={stageColor}
		>
			<strong>
				Stage {stageNumber}
			</strong>
		</data>
	{/if}
{:else if stage === 'QUALIFIED_FOR_NO_STAGES'}
	{#if ladderEvaluation}
		<Tooltip
			buttonTriggerPlacement="behind"
			hoverTriggerPlacement="around"
		>
			{#snippet children()}
				<data
					data-badge={size}
					value="NO_STAGES"
					title="Wallet did not qualify for any stages"
				>
					<small>No Stage</small>
				</data>
			{/snippet}
			{#snippet TooltipContent()}
				<WalletStageSummary {wallet} stage={stage} {ladderEvaluation} />
			{/snippet}
		</Tooltip>
	{:else}
		<data
			data-badge={size}
			value="NO_STAGES"
			title="Wallet did not qualify for any stages"
		>
			<small>No Stage</small>
		</data>
	{/if}
{:else}
	{#if ladderEvaluation}
		<Tooltip
			buttonTriggerPlacement="behind"
			hoverTriggerPlacement="around"
		>
			{#snippet children()}
				<data
					data-badge={size}
					value="NOT_APPLICABLE"
					title="Stage rating not applicable to this wallet"
				>
					<small>N/A</small>
				</data>
			{/snippet}
			{#snippet TooltipContent()}
				<WalletStageSummary {wallet} stage={stage} {ladderEvaluation} />
			{/snippet}
		</Tooltip>
	{:else}
		<data
			data-badge={size}
			value="NOT_APPLICABLE"
			title="Stage rating not applicable to this wallet"
		>
			<small>N/A</small>
		</data>
	{/if}
{/if}


<style>
	data {
		&[value='NO_STAGES'],
		&[value='NOT_APPLICABLE'] {
			--accent: var(--rating-unrated);
		}
	}
</style>

