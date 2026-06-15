<?php
/**
 * Gravity Form field router partial.
 *
 * @package ChoctawNation
 * @subpackage CNO_Interactivity_Blocks
 */

?>
<div class="mb-3" data-wp-class--d-none="callbacks.isHiddenField">
	<div data-wp-bind--hidden="!callbacks.isNameField">
		<?php require __DIR__ . '/fields/name.php'; ?>
	</div>

	<div data-wp-bind--hidden="!callbacks.isStandardInputField">
		<?php require __DIR__ . '/fields/input.php'; ?>
	</div>

</div>