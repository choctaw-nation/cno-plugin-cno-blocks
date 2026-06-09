<?php
/**
 * Tab Panel Block Render Callback
 *
 * @var array     $attributes Block attributes.
 * @var string    $content    Block content.
 * @var \WP_Block $block      Block instance.
 * @package ChoctawNation
 */

$tabs_id = $block->context['cno/tabs-id'] ?? '';

static $tab_counters = array();

if ( ! isset( $tab_counters[ $tabs_id ] ) ) {
	$tab_counters[ $tabs_id ] = 0;
}

$tab_index = $tab_counters[ $tabs_id ];
++$tab_counters[ $tabs_id ];

$tag_processor = new WP_HTML_Tag_Processor( $content );
$tag_processor->next_tag( array( 'class_name' => 'wp-block-cno-tab-panel' ) );

// Use the user's custom anchor if present, otherwise fall back to
// the generated position-based ID.
$tab_id = (string) $tag_processor->get_attribute( 'id' );
if ( empty( $tab_id ) ) {
	$tab_id = ! empty( $tabs_id )
		? $tabs_id . '-tab-' . $tab_index
		: 'tab-' . $tab_index;
	$tag_processor->set_attribute( 'id', $tab_id );
}

/**
 * Add interactivity to the tab element.
 */
$tag_processor->set_attribute(
	'data-wp-interactive',
	'cno/tabs/private'
);
$tag_processor->set_attribute(
	'data-wp-context',
	wp_json_encode(
		array(
			'tab' => array(
				'id' => $tab_id,
			),
		)
	)
);

/**
 * Process accessibility and interactivity attributes.
 */
$tag_processor->set_attribute( 'role', 'tabpanel' );
$tag_processor->set_attribute( 'aria-labelledby', 'tab__' . $tab_id );
$tag_processor->set_attribute( 'data-wp-bind--hidden', '!state.isActiveTab' );
$tag_processor->set_attribute( 'tabindex', 0 );

echo (string) $tag_processor->get_updated_html();