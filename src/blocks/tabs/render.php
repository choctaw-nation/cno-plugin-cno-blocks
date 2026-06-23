<?php
/**
 * Tabs Block Render Callback
 *
 * @var array     $attributes Block attributes.
 * @var string    $content    Block content.
 * @var \WP_Block $block      WP_Block instance.
 *
 * @package ChoctawNation
 */

$active_tab_index = $attributes['activeTabIndex'] ?? 0;
$tabs_list        = $block->context['cno/tabs-list'] ?? array();
$tabs_id          = $block->context['cno/tabs-id'] ?? null;

if ( empty( $tabs_id ) ) {
	// If malformed tabs, return early to avoid errors.
	return '';
}

$is_vertical = false;

$tag_processor = new WP_HTML_Tag_Processor( $content );

$tag_processor->next_tag( array( 'class_name' => 'wp-block-cno-tabs' ) );
$tag_processor->set_attribute( 'data-wp-interactive', 'cno/tabs' );

// Inspect inside the tab-list to see if its vertical or not.
$tag_processor->set_bookmark( 'cno/tabs_wrapper' );
while ( $tag_processor->next_tag( array( 'class_name' => 'wp-block-cno-tab-list' ) ) ) {
	if ( $tag_processor->has_class( 'is-vertical' ) ) {
		$is_vertical = true;
		break;
	}
}
$tag_processor->seek( 'cno/tabs_wrapper' );

$tag_processor->set_attribute(
	'data-wp-context',
	wp_json_encode(
		array(
			'tabsId'         => $tabs_id,
			'activeTabIndex' => $active_tab_index,
			'isVertical'     => $is_vertical,
		)
	)
);
$tag_processor->set_attribute( 'data-wp-init', 'callbacks.onTabsInit' );
$tag_processor->set_attribute( 'data-wp-on-window--resize', 'callbacks.updateScrollOffset' );
$tag_processor->set_attribute( 'data-wp-on--keydown', 'actions.handleTabKeyDown' );

$output = $tag_processor->get_updated_html();

/**
 * Builds a client side state for just this tabs instance.
 * This allows 3rd party extensibility of tabs while retaining
 * client side state management per cno/tabs instance, like context.
 */
wp_interactivity_state(
	'cno/tabs',
	array(
		$tabs_id => $tabs_list,
	)
);

echo $output;