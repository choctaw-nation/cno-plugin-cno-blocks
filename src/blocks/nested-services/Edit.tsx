/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { Spinner } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { useCurrentPostSiblings } from './useCurrentPostSiblings';
import { chevronRight, leftArrow } from './icons';

export default function Edit() {
	const {
		parentTitle,
		parentIsActive,
		children: postChildren,
		isResolving,
	} = useCurrentPostSiblings();
	const blockProps = useBlockProps();

	if ( isResolving || ! postChildren ) {
		return (
			<div { ...blockProps }>
				<Spinner />
			</div>
		);
	}

	return (
		<div { ...blockProps }>
			<p
				style={ {
					margin: 0,
					fontWeight: 'bold',
					display: 'flex',
					alignItems: 'center',
					gap: '.5rem',
				} }
			>
				{ ! parentIsActive && leftArrow }
				{ parentTitle }
			</p>
			<hr />
			<ul>
				{ postChildren.map( ( child ) => (
					<li
						style={ {
							display: 'flex',
							alignItems: 'center',
							gap: '.5rem',
							fontWeight: `${
								child.isActive ? 'bold' : 'normal'
							}`,
						} }
						key={ child.title }
					>
						{ chevronRight }
						<p
							style={ { marginBlock: '.25rem' } }
							dangerouslySetInnerHTML={ { __html: child.title } }
						/>
					</li>
				) ) }
			</ul>
			{ postChildren.length === 0 && <p>No child posts found.</p> }
		</div>
	);
}
