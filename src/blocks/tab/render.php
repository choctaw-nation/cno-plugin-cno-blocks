<?php
/**
 * Render callback for cno/tab.
 *
 * Injects the tab label and IAPI directives into the saved button HTML.
 * Per-item context (index, id, label) is provided by the parent tab-list
 * render callback before this is called.
 *
 * @var array     $attributes Block attributes.
 * @var string    $content    Block content (styled button from save.js).
 * @var \WP_Block $block      WP_Block instance.
 *
 * @package WordPress
 */

$tab_index = $block->context['cno/tab-index'] ?? 0;
$tab_id    = $block->context['cno/tab-id'] ?? '';
$tab_label = $block->context['cno/tab-label'] ?? '';

if ( empty( $tab_id ) ) {
	$tab_id = 'tab-' . $tab_index;
}
$block_attributes = get_block_wrapper_attributes(
	array(
		'type'                        => 'button',
		'id'                          => 'tab__' . esc_attr( $tab_id ),
		'aria-controls'               => esc_attr( $tab_id ),
		'data-wp-on--click'           => 'actions.handleTabClick',
		'data-wp-on--keydown'         => 'actions.handleTabKeyDown',
		'data-wp-bind--aria-selected' => 'state.isActiveTab',
		'data-wp-bind--tabindex'      => 'state.tabIndexAttribute',
		'data-tab-index'              => $tab_index,
	)
);
?>
<button <?php echo $block_attributes; ?>>
	<?php
	echo $content;
	printf( '<div>%s</div>', wp_kses_post( $tab_label ) );
	?>
</button>