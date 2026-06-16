<?php
/**
 * Job Class that helps parse and format Gravity Forms data for use in blocks.
 *
 * @package ChoctawNation
 * @subpackage CNO_Blocks
 */

namespace ChoctawNation\CNO_Blocks\Jobs;

/**
 * Class Gravity_Forms_Parser
 */
class Gravity_Forms_Parser {
	/**
	 * Parse Gravity Forms data into a format suitable for block consumption.
	 *
	 * @param array $data The raw Gravity Forms data.
	 */
	public static function parse( array $data ): array {
		if ( isset( $data['is_active'] ) && '0' === (string) $data['is_active'] ) {
			return array( 'isActive' => false );
		}

		$parsed_data = array();

		$keys = array(
			'id',
			'is_active',
			'button',
			'limitEntries',
			'limitEntriesCount',
			'limitEntriesPeriod',
			'limitEntriesMessage',
			'scheduleForm',
			'scheduleStart',
			'scheduleStartHour',
			'scheduleStartMinute',
			'scheduleStartAmPm',
			'scheduleEnd',
			'scheduleEndHour',
			'scheduleEndMinute',
			'scheduleEndAmPm',
			'schedulePendingMessage',
			'scheduleMessage',
		);

		foreach ( $keys as $key ) {
			if ( array_key_exists( $key, $data ) ) {
				$parsed_data[ $key ] = $data[ $key ];
			}
		}

		$parsed_data['fields']        = self::parse_fields( $data['fields'] ?? array() );
		$parsed_data['confirmations'] = self::parse_confirmations( $data['confirmations'] ?? array() );

		return $parsed_data;
	}

	/**
	 * Recursively parse Gravity Forms fields, including nested fields, into a format suitable for block consumption.
	 *
	 * @param array $fields The raw fields data from Gravity Forms.
	 */
	private static function parse_fields( array $fields ): array {
		$parsed_fields = array();

		foreach ( $fields as $field ) {
			$parsed_fields[] = self::parse_field( $field );
		}

		return $parsed_fields;
	}

	/**
	 * Parse an individual Gravity Forms field, including its properties and any nested inputs or choices, into a format suitable for block consumption.
	 *
	 * @param array $field The raw field data from Gravity Forms.
	 */
	private static function parse_field( $field ): array {
		$parsed_field = array(
			'type'                  => $field['type'] ?? '',
			'id'                    => $field['id'] ?? null,
			'label'                 => $field['label'] ?? '',
			'isRequired'            => $field['isRequired'] ?? false,
			'maxLength'             => $field['maxLength'] ?? '',
			'visibility'            => $field['visibility'] ?? 'visible',
			'enableAutocomplete'    => $field['enableAutocomplete'] ?? false,
			'autocompleteAttribute' => $field['autocompleteAttribute'] ?? '',
			'defaultValue'          => $field['defaultValue'] ?? '',
		);

		if ( ! empty( $field['inputs'] ) && is_array( $field['inputs'] ) ) {
			$parsed_field['inputs'] = array_values(
				array_filter(
					$field['inputs'],
					static function ( $input ) {
						return empty( $input['isHidden'] );
					}
				)
			);
		}

		if ( ! empty( $field['choices'] ) && is_array( $field['choices'] ) ) {
			$parsed_field['choices'] = $field['choices'];
		}

		if ( ! empty( $field['fields'] ) && is_array( $field['fields'] ) ) {
			$parsed_field['fields'] = self::parse_fields( $field['fields'] );
		}

		return array_filter(
			$parsed_field,
			static function ( $value ) {
				return null !== $value && '' !== $value && array() !== $value;
			}
		);
	}

	/**
	 * Parse Gravity Forms confirmations into a format suitable for block consumption.
	 *
	 * @param array $confirmations The raw confirmations data from Gravity Forms.
	 * @return array The parsed confirmations data.
	 */
	private static function parse_confirmations( array $confirmations ): array {
		$parsed_confirmations = array();

		foreach ( $confirmations as $confirmation ) {
			$parsed_confirmations[] = array(
				'id'        => $confirmation['id'] ?? null,
				'name'      => $confirmation['name'] ?? '',
				'type'      => $confirmation['type'] ?? '',
				'message'   => $confirmation['message'] ?? '',
				'url'       => $confirmation['url'] ?? '',
				'pageId'    => $confirmation['pageId'] ?? null,
				'isDefault' => isset( $confirmation['isDefault'] ) ? (bool) $confirmation['isDefault'] : false,
			);
		}

		return $parsed_confirmations;
	}
}
