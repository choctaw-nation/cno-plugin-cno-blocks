<?php
/**
 * Single Input Field Partial
 *
 * Renders a single input field for the Gravity Form Renderer block.
 *
 * @package ChoctawNation
 * @subpackage CNO_Interactivity_Blocks
 */

?>
<div data-wp-bind--hidden="callbacks.isNameField">
	<label class="form-label has-base-font-size d-flex align-items-center gap-1" data-wp-bind--for="callbacks.fieldInputId">
		<span data-wp-text="context.field.label"></span>
		<span class="text-danger" data-wp-bind--hidden="!context.field.isRequired">
			(Required)
		</span>
	</label>

	<input class="form-control" data-wp-bind--id="callbacks.fieldInputId" data-wp-bind--name="callbacks.fieldName" data-wp-bind--type="callbacks.inputType"
		data-wp-bind--disabled="state.isLoading" data-wp-bind--hidden="callbacks.isTextareaField" data-wp-bind--required="context.field.isRequired"
		data-wp-bind--value="callbacks.prefilledFieldValue" data-wp-bind--aria-invalid="callbacks.hasFieldError" data-wp-bind--autocomplete="callbacks.autocompleteValue"
		data-wp-bind--aria-describedby="callbacks.fieldErrorId" data-wp-on--input="actions.updateFieldValue" data-wp-class--is-invalid="callbacks.hasFieldError" />

	<textarea class="form-control" rows="5" data-wp-bind--id="callbacks.fieldInputId" data-wp-bind--name="callbacks.fieldName" data-wp-bind--required="context.field.isRequired"
		data-wp-bind--disabled="state.isLoading" data-wp-bind--hidden="!callbacks.isTextareaField" data-wp-bind--value="callbacks.prefilledFieldValue"
		data-wp-bind--maxlength="context.field.maxLength" data-wp-bind--aria-invalid="callbacks.hasFieldError" data-wp-bind--aria-describedby="callbacks.fieldErrorId"
		data-wp-on--input="actions.updateFieldValue" data-wp-class--is-invalid="callbacks.hasFieldError"></textarea>

	<div class="invalid-feedback" data-wp-bind--id="callbacks.fieldErrorId" data-wp-bind--hidden="!callbacks.hasFieldError" data-wp-text="callbacks.fieldError"></div>
</div>
