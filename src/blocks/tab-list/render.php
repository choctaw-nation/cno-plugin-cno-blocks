<?php
/**
 * Tab List Render Callback
 *
 * @var array     $attributes Block attributes.
 * @var string    $content    Block content (rendered inner blocks from save.js).
 * @var \WP_Block $block      WP_Block instance.
 *
 * @package ChoctawNation
 */

$tabs_list = $block->context['cno/tabs-list'] ?? array();

if ( empty( $tabs_list ) ) {
	return $content;
}

// Re-render each tab with per-item context (index, id, label).
// Match by position so items align with their corresponding tabs.
$buttons_html = '';
$tab_position = 0;

foreach ( $block->parsed_block['innerBlocks'] ?? array() as $parsed_tab ) {
	if ( 'cno/tab' !== ( $parsed_tab['blockName'] ?? '' ) ) {
		continue;
	}

	$tab       = $tabs_list[ $tab_position ] ?? null;
	$tab_index = $tab_position;
	++$tab_position;

	// Skip tabs with no matching tab panel.
	if ( null === $tab ) {
		continue;
	}

	$item_context = array_merge(
		$block->context,
		array(
			'cno/tab-index' => $tab_index,
			'cno/tab-id'    => $tab['id'] ?? '',
			'cno/tab-label' => $tab['label'] ?? '',
		)
	);

	$tab_block     = new WP_Block( $parsed_tab, $item_context );
	$buttons_html .= $tab_block->render();
}

// Rebuild the wrapper using get_block_wrapper_attributes().
$wrapper_attributes = get_block_wrapper_attributes( array( 'role' => 'tablist' ) );
printf( '<div %s>%s</div>', $wrapper_attributes, $buttons_html );