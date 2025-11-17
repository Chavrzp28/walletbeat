<script lang="ts">
	// Types/constants
	import { type WalletLadderEvaluation, type WalletStage } from '@/schema/stages'
	import { stageToColor } from '@/utils/colors'
	import { getStageNumber } from '@/utils/stage'


	// Props
	const {
		stage,
		ladderEvaluation,
		size = 'medium',
	}: {
		stage: WalletStage | 'NOT_APPLICABLE' | 'QUALIFIED_FOR_NO_STAGES' | null
		ladderEvaluation: WalletLadderEvaluation | null
		size?: 'small' | 'medium' | 'large'
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

	const dataValue = $derived.by(() => {
		if (stage === 'QUALIFIED_FOR_NO_STAGES') {
			return 'NO_STAGES'
		} else if (stage === 'NOT_APPLICABLE' || stage === null) {
			return 'NOT_APPLICABLE'
		} else if (stage && stageNumber !== null) {
			return `STAGE_${stageNumber}`
		} else {
			return 'NOT_APPLICABLE'
		}
	})

	const dataTitle = $derived.by(() => {
		if (stage === 'QUALIFIED_FOR_NO_STAGES') {
			return 'Wallet did not qualify for any stages'
		} else if (stage === 'NOT_APPLICABLE' || stage === null) {
			return 'Stage rating not applicable to this wallet'
		} else {
			return undefined
		}
	})

</script>


<data
	data-badge={size}
	value={dataValue}
	title={dataTitle}
	style:--accent={stage && stage !== 'NOT_APPLICABLE' && stage !== 'QUALIFIED_FOR_NO_STAGES' && stageNumber !== null ? stageColor : undefined}
>
	{#if stage === 'QUALIFIED_FOR_NO_STAGES'}
		<small>No Stage</small>
	{:else if stage === 'NOT_APPLICABLE' || stage === null}
		<small>N/A</small>
	{:else if stage && stageNumber !== null}
		<strong>
			Stage {stageNumber}
		</strong>
	{:else}
		<small>N/A</small>
	{/if}
</data>


<style>
	data {
		&[value='NO_STAGES'],
		&[value='NOT_APPLICABLE'] {
			--accent: var(--rating-unrated);
		}
	}
</style>

