import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function Edit() {
	const blockProps = useBlockProps();
	const { children, ...innerBlocksProps } = useInnerBlocksProps( {
		className: 'wp-block-cno-diamond-button-list-item__content',
	} );
	return (
		<li { ...blockProps }>
			<div className="wp-block-cno-diamond-button-list-item__diamond" />
			<div { ...innerBlocksProps }>{ children }</div>
		</li>
	);
}
