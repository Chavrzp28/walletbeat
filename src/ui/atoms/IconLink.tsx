import type SvgIcon from '@mui/material/SvgIcon'
import type React from 'react'

import { cx } from '@/utils/cx'

export function IconLink({
	href,
	IconComponent,
	target = undefined,
	gap = '0.25rem',
	color = undefined,
	style = undefined,
	rel = 'noopener noreferrer nofollow',
	children = undefined,
}: {
	href: string
	IconComponent: typeof SvgIcon
	target?: string
	gap?: string
	color?: string
	style?: React.CSSProperties
	rel?: string
	children?: React.ReactNode
}): React.JSX.Element {
	// Convert gap to Tailwind spacing class
	const gapClass = gap === '0.25rem' ? 'gap-1' : 'gap-2'

	// Default color to link-color CSS variable
	const linkColor = color ?? 'var(--link-color)'

	return (
		<span className='inline-block'>
			<a
				href={href}
				target={target}
				rel={rel}
				style={{
					color: linkColor,
					...style,
				}}
				className={cx('inline-flex flex-row items-baseline underline', gapClass)}
			>
				<IconComponent className='inline-block' fontSize='inherit' />
				<span className='inline-block'>{children}</span>
			</a>
		</span>
	)
}
