<?php
/**
 * Name Field Partial
 *
 * @package ChoctawNation
 * @subpackage CNO_Interactivity_Blocks
 */

?>
<fieldset data-wp-bind--hidden="!callbacks.isNameField" data-wp-bind--disabled="state.isLoading">
	<legend class="form-label has-base-font-size d-flex align-items-center gap-1">
		<span data-wp-text="context.field.label"></span>
		<span class="text-danger has-root-font-size" data-wp-bind--hidden="!context.field.isRequired">
			(Required)
		</span>
	</legend>

	<div class="d-flex column-gap-3 row-gap-2 flex-wrap">
		<template data-wp-each--input="context.field.inputs" data-wp-each-key="context.input.id">
			<div class="col-auto flex-grow-1" data-wp-class--d-none="callbacks.isHiddenInput">
				<div class="invalid-feedback" data-wp-bind--id="callbacks.nameInputErrorId" data-wp-bind--hidden="!callbacks.hasNameInputError" data-wp-text="callbacks.nameInputError"></div>
				<input class="form-control" type="text" data-wp-bind--id="callbacks.nameInputId" data-wp-bind--name="callbacks.nameInputName"
					data-wp-bind--required="context.field.isRequired" data-wp-bind--value="callbacks.prefilledNameInputValue" data-wp-bind--autocomplete="callbacks.nameInputAutocomplete"
					data-wp-bind--aria-invalid="callbacks.hasNameInputError" data-wp-bind--aria-describedby="callbacks.nameInputErrorId" data-wp-on--input="actions.updateNameInputValue"
					data-wp-class--is-invalid="callbacks.hasNameInputError" />
				<label class="form-label has-root-font-size" data-wp-bind--for="callbacks.nameInputId">
					<span data-wp-text="context.input.label"></span>
				</label>
			</div>
		</template>
	</div>
</fieldset>