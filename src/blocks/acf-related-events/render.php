<?php
/**
 * Render callback for related events block.
 *
 * @var array     $attributes Block attributes.
 * @var string    $content    Block content (styled button from save.js).
 * @var \WP_Block $block      WP_Block instance.
 *
 * @package WordPress
 */

$event_ids = get_field( 'related_events' );
if ( empty( $event_ids ) ) {
	return;
}
$timezone    = wp_timezone();
$events_data = array_map(
	function ( $event ) use ( $timezone, $attributes ) {
		$is_published = 'publish' === get_post_status( $event );
		if ( ! $is_published ) {
			return null; // Skip unpublished events
		}
		$is_virtual_event = get_post_meta( $event, 'virtual_event', true ) === '1';
		$start_date       = get_post_meta( $event, 'start_date', true );
		if ( ! $start_date ) {
			return null; // Skip events without a start date
		}
		$js_start_date = DateTime::createFromFormat( 'Ymd', $start_date, $timezone );
		return array(
			'id'              => $event,
			'title'           => get_the_title( $event ),
			'permalink'       => get_permalink( $event ),
			'isVirtual'       => $is_virtual_event,
			'prettyStartDate' => $js_start_date ? $js_start_date->format( $attributes['dateFormat'] ) : $start_date,
			'startDate'       => $js_start_date ? $js_start_date->format( DATE_ATOM ) : $start_date,
		);
	},
	$event_ids
);
usort(
	$events_data,
	function ( $a, $b ) {
		return strtotime( $a['startDate'] ) <=> strtotime( $b['startDate'] );
	}
);
$block_attributes = get_block_wrapper_attributes();
?>
<ol <?php echo $block_attributes; ?>>
	<?php
	foreach ( $events_data as $event_data ) {
		$markup  = '<li class="wp-block-cno-acf-related-events__event">';
		$markup .= sprintf(
			'<i class="fa-solid %s"></i><a href="%s" class="wp-block-cno-acf-related-events__event-title">%s</a><time datetime="%s">%s</time>',
			'fa-calendar-days',
			$event_data['permalink'],
			$event_data['title'],
			$event_data['startDate'],
			$event_data['prettyStartDate']
		);
		$markup .= '</li>';
		echo $markup;
	}
	?>
</ol>