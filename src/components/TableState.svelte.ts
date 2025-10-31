// Types
import type { Snippet } from 'svelte'

export type Column<RowValue, CellValue, ColumnId extends string = string> = {
	id: ColumnId
	name: string
	value: (row: RowValue) => CellValue

	isSticky?: boolean

	sort?: {
		isDefault?: boolean
		defaultDirection: SortDirection
		compare?: (a: CellValue, b: CellValue, rowA: RowValue, rowB: RowValue) => number
	}

	HeaderTitle?: Snippet<
		[
			{
				column: Column<RowValue, CellValue, ColumnId>
			},
		]
	>

	Cell?: Snippet<
		[
			{
				row: RowValue
				column: Column<RowValue, CellValue, ColumnId>
				value: CellValue
			},
		]
	>

	subcolumns?: Column<RowValue, CellValue, ColumnId>[]
	isDefaultExpanded?: boolean
}

type SortDirection = 'asc' | 'desc'

type SortState<ColumnId extends string = string> = {
	columnId: ColumnId
	direction: SortDirection
}

import { SvelteMap, SvelteSet } from 'svelte/reactivity'

// State
export class TableState<RowValue, CellValue, ColumnId extends string = string> {
	columns: Column<RowValue, CellValue, ColumnId>[] = $state([])

	#columnsById = $derived(
		new SvelteMap(
			this.columns
				.flatMap(function flatten(column): (typeof column)[] {
					return [column, ...(column.subcolumns?.flatMap(flatten) ?? [])]
				})
				.map(column => [column.id, column]),
		),
	)

	#isColumnExpanded = $state(new SvelteSet<ColumnId>())

	columnsVisible = $derived.by(() => {
		const getVisibleColumns = (
			columns: Column<RowValue, CellValue, ColumnId>[],
		): Column<RowValue, CellValue, ColumnId>[] =>
			columns.flatMap(column =>
				column.subcolumns?.length && this.#isColumnExpanded.has(column.id)
					? getVisibleColumns(column.subcolumns)
					: [column],
			)

		return getVisibleColumns(this.columns)
	})

	#defaultColumnSort?: SortState<ColumnId>

	sortState?: SortState<ColumnId> = $state(this.#defaultColumnSort)

	sortedColumn = $derived(
		this.sortState?.columnId && this.#columnsById.get(this.sortState.columnId),
	)

	maxHeaderLevel = $derived.by(() => {
		const getMaxLevel = (columns: Column<RowValue, CellValue, ColumnId>[]): number =>
			Math.max(
				1,
				...columns.map(column =>
					!column.subcolumns?.length ? 1 : 1 + getMaxLevel(column.subcolumns),
				),
			)

		return getMaxLevel(this.columns)
	})

	rows = $state<RowValue[]>([])

	#rowIsDisabled?: (row: RowValue, table: TableState<RowValue, CellValue, ColumnId>) => boolean

	#displaceDisabledRows: boolean

	rowsSorted = $derived.by(() => {
		if (!this.sortState) {
			return this.rows
		}

		const { columnId, direction } = this.sortState

		const column = this.#columnsById.get(columnId)

		return this.rows.toSorted((a, b) => {
			if (this.#displaceDisabledRows && this.#rowIsDisabled) {
				const isRowADisplaced = this.#rowIsDisabled(a, this)
				const isRowBDisplaced = this.#rowIsDisabled(b, this)

				if (isRowADisplaced || isRowBDisplaced) {
					return isRowADisplaced && isRowBDisplaced ? 0 : isRowADisplaced ? 1 : -1
				}
			}

			const aVal = column?.value(a)
			const bVal = column?.value(b)

			return aVal === undefined || aVal === null
				? direction === 'asc'
					? 1
					: -1
				: bVal === undefined || bVal === null
					? direction === 'asc'
						? -1
						: 1
					: column?.sort?.compare
						? direction === 'asc'
							? column.sort.compare(aVal, bVal, a, b)
							: column.sort.compare(bVal, aVal, b, a)
						: typeof aVal === 'string' && typeof bVal === 'string'
							? direction === 'asc'
								? aVal.localeCompare(bVal)
								: bVal.localeCompare(aVal)
							: aVal < bVal
								? direction === 'asc'
									? -1
									: 1
								: aVal > bVal
									? direction === 'asc'
										? 1
										: -1
									: 0
		})
	})

	pageSize: number = $state(Infinity)

	currentPage = $state(1)

	rowsVisible = $derived(
		this.rowsSorted.slice(
			(this.currentPage - 1) * this.pageSize || 0,
			((this.currentPage - 1) * this.pageSize || 0) + this.pageSize,
		),
	)

	totalPages = $derived(Math.max(1, Math.ceil(this.rows.length / this.pageSize)))

	canGoBack = $derived(this.rows.length > 0 && this.currentPage > 1)

	canGoForward = $derived(this.rows.length > 0 && this.currentPage < this.totalPages)

	constructor({
		data,
		columns,
		pageSize,
		rowIsDisabled,
		displaceDisabledRows,
	}: {
		data: RowValue[]
		columns: Column<RowValue, CellValue, ColumnId>[]
		pageSize?: number
		rowIsDisabled?: (row: RowValue, table: TableState<RowValue, CellValue, ColumnId>) => boolean
		displaceDisabledRows?: boolean
	}) {
		this.rows = [...data]
		this.columns = columns
		this.pageSize = pageSize || Infinity

		const defaultSortedColumn = this.columns.find(column => column.sort?.isDefault)

		this.#defaultColumnSort = this.sortState = defaultSortedColumn && {
			columnId: defaultSortedColumn.id,
			direction: defaultSortedColumn.sort?.defaultDirection ?? 'asc',
		}

		this.#rowIsDisabled = rowIsDisabled
		this.#displaceDisabledRows = displaceDisabledRows ?? false

		const initializeIsColumnExpanded = (columns: Column<RowValue, CellValue, ColumnId>[]) => {
			columns.forEach(column => {
				if (column.isDefaultExpanded) {
					this.#isColumnExpanded.add(column.id)
				}

				if (column.subcolumns?.length) {
					initializeIsColumnExpanded(column.subcolumns)
				}
			})
		}

		initializeIsColumnExpanded(columns)
	}

	toggleColumnSort = (columnId: ColumnId) => {
		const column = this.#columnsById.get(columnId)

		if (!column?.sort) {
			return false
		}

		this.sortState =
			this.sortState?.columnId !== columnId
				? {
						columnId,
						direction: column.sort.defaultDirection,
					}
				: this.sortState?.direction === column.sort.defaultDirection
					? {
							columnId,
							direction: column.sort.defaultDirection === 'asc' ? 'desc' : 'asc',
						}
					: this.#defaultColumnSort

		return true
	}

	isColumnExpanded = (columnId: ColumnId): boolean => this.#isColumnExpanded.has(columnId)

	toggleIsColumnExpanded = (columnId: ColumnId) => {
		if (this.#isColumnExpanded.has(columnId)) {
			this.#isColumnExpanded.delete(columnId)
		} else {
			this.#isColumnExpanded.add(columnId)
		}
	}
}
