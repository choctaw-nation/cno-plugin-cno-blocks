<?php
/**
 * Plugin Settings
 *
 * @package ChoctawNation
 */

namespace ChoctawNation\CNO_Blocks\WP;

/**
 * Manages plugin settings retrieval and storage.
 */
class Plugin_Settings {
	public const OPTION_KEY = 'cno_site_blocks_settings';

	/**
	 * Get the current plugin settings from the WordPress options table.
	 *
	 * @return array The current settings, or defaults if not set.
	 */
	public function get_settings(): array {
		return get_option( self::OPTION_KEY, $this->get_defaults() );
	}

	/**
	 * Update the plugin settings in the WordPress options table.
	 *
	 * @param array $settings The settings to save.
	 * @return void
	 */
	public function set_settings( array $settings ): void {
		update_option( self::OPTION_KEY, $settings );
	}

	/**
	 * Get the default settings for the plugin.
	 *
	 * @return array The default settings.
	 */
	public function get_defaults(): array {
		return array( 'siteKey' => '' );
	}

	/**
	 * Initialize the default option on plugin activation if it does not already exist.
	 *
	 * @return void
	 */
	public function initialize_defaults(): void {
		if ( false === get_option( self::OPTION_KEY ) ) {
			add_option( self::OPTION_KEY, $this->get_defaults() );
		}
	}

	/**
	 * Register the setting with WordPress so it can be read and validated.
	 *
	 * @return void
	 */
	public function register(): void {
		register_setting(
			self::OPTION_KEY . '_group',
			self::OPTION_KEY,
			array(
				'type'              => 'array',
				'sanitize_callback' => array( $this, 'sanitize' ),
				'default'           => $this->get_defaults(),
			)
		);
	}

	/**
	 * Return the WordPress option key.
	 *
	 * @return string
	 */
	public function get_option_key(): string {
		return self::OPTION_KEY;
	}

	/**
	 * Sanitize and validate settings input before saving to the database.
	 *
	 * @param array $input The raw input from the settings form.
	 * @return array The sanitized settings ready for storage.
	 */
	public function sanitize( array $input ): array {
		$sanitized = array();
		if ( isset( $input['siteKey'] ) ) {
			$sanitized['siteKey'] = sanitize_text_field( $input['siteKey'] );
		}
		return array_merge( $this->get_defaults(), $sanitized );
	}
}