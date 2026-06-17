<?php
/**
 * Admin Screen
 *
 * @package ChoctawNation
 */

namespace ChoctawNation\CNO_Blocks\WP;

/**
 * Admin Screen Class
 */
class Admin_Screen {
	/**
	 * The plugin directory path
	 *
	 * @var string $dir_path
	 */
	public string $dir_path;

	/**
	 * The plugin directory URL
	 *
	 * @var string $dir_url
	 */
	public string $dir_url;

	/**
	 * Admin page hook suffix
	 *
	 * @var string|null
	 */
	public ?string $admin_page_hook = null;

	/**
	 * Constructor
	 *
	 * @param string $dir_path The plugin directory path.
	 * @param string $dir_url The plugin directory URL.
	 */
	public function __construct( string $dir_path, string $dir_url ) {
		$this->dir_path = $dir_path;
		$this->dir_url  = $dir_url;
	}
	/**
	 * Add the plugin options page to admin menu
	 *
	 * @return void
	 */
	public function add_admin_menu(): void {
		$this->admin_page_hook = add_menu_page(
			'Blocks Settings',
			'Blocks Settings',
			'manage_options',
			'cno-site-blocks-settings',
			array( $this, 'render_admin_page' ),
			'dashicons-block-default',
			60
		);
	}

	/**
	 * Render the admin mount point
	 *
	 * @return void
	 */
	public function render_admin_page(): void {
		echo '<div id="cno-site-blocks-admin"></div>';
	}

	/**
	 * Enqueue admin assets for the plugin page
	 *
	 * @param string $hook The current admin page hook.
	 * @return void
	 */
	public function enqueue_admin_assets( string $hook ): void {
		if ( $this->admin_page_hook !== $hook ) {
			return;
		}
		$handle     = 'admin/cno-site-blocks-admin';
		$script_url = $this->dir_url . "build/{$handle}.js";
		$asset_file = require_once $this->dir_path . "build/{$handle}.asset.php";
		wp_enqueue_script(
			$handle,
			$script_url,
			$asset_file['dependencies'],
			$asset_file['version'],
			array( 'strategy' => 'defer' )
		);
		wp_add_inline_script(
			$handle,
			'window.cnoSiteBlocksAdminData = ' . wp_json_encode(
				array(
					'restRoot' => 'cno-site-blocks/v1/',
					'nonce'    => wp_create_nonce( 'wp_rest' ),
					'settings' => get_option( 'cno_site_blocks_settings', array() ),
				)
			) . ';',
			'before'
		);
	}
}