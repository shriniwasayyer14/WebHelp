var WebHelpTemplates = {};

WebHelpTemplates["../templates/WebHelpContainer.html"] = "<div id=\"webHelpMainContent\">\n" +
   "	<div class=\"tabbable\">\n" +
   "		<!-- Only required for left/right tabs -->\n" +
   "		<ul class=\"nav nav-tabs\">\n" +
   "			<li class=\"active\"><a href=\"#popularSequences\" data-toggle=\"tab\">Popular</a>\n" +
   "			</li>\n" +
   "			<li><a href=\"#whatsNew\" data-toggle=\"tab\">What's New?</a>\n" +
   "				<li><a href=\"#availableSequences\" data-toggle=\"tab\">Topics</a>\n" +
   "				</li>\n" +
   "				<li><a href=\"#addSequence\" data-toggle=\"tab\">Add/Edit Sequence</a>\n" +
   "				</li>\n" +
   "			</li>\n" +
   "		</ul>\n" +
   "		<div class=\"tab-content\">\n" +
   "			<div class=\"tab-pane active\" id=\"popularSequences\">\n" +
   "				<div id=\"popularSequencesContent\">No popular items yet!</div>\n" +
   "			</div>\n" +
   "			<div class=\"tab-pane\" id=\"whatsNew\">\n" +
   "				<div id=\"whatsNewContent\">\n" +
   "					No new items yet!\n" +
   "				</div>\n" +
   "			</div>\n" +
   "			<div class=\"tab-pane\" id=\"availableSequences\">\n" +
   "				<div id=\"availableSequencesContent\">\n" +
   "					Placeholder where you can search for existing sequences\n" +
   "				</div>\n" +
   "			</div>\n" +
   "\n" +
   "			<div class=\"tab-pane\" id=\"addSequence\">\n" +
   "				<div class=\"well\">\n" +
   "\n" +
   "					<section contenteditable=\"true\">\n" +
   "						<div>\n" +
   "							<input type=\"text\" id=\"sequenceTitleSetter\" value=\"Sequence title\" />\n" +
   "						</div>\n" +
   "						<table id=\"stepsTable\" class=\"table table-bordered table-hover\"></table>\n" +
   "					</section>\n" +
   "\n" +
   "					<button type=\"button\" id='sequencePreviewButton' class=\"btn btn-default centered actionButton\" aria-label=\"Left Align\" style=\"margin-top:20px;\" onclick=\"preview();\">\n" +
   "						<span class=\"iconClass-play\" aria-hidden=\"true \"></span> Preview\n" +
   "					</button>\n" +
   "\n" +
   "					<button type=\"button \" id='sequenceSaveButton' class=\"btn btn-default centered \" aria-label=\"Left Align \" style=\"margin-top:20px; \" onclick=\"saveToDB(); \">\n" +
   "						<span class=\"iconClass-save\" aria-hidden=\"true\"></span> Save\n" +
   "					</button>\n" +
   "					<button type=\"button\" id='clearStepsButton ' class=\"btn btn-default centered\" aria-label=\"Left Align\" style=\"margin-top:20px;\" onclick=\"clearStepsInSequence();\">\n" +
   "						<span class=\"iconClass-clear\" aria-hidden=\"true \"></span> Clear\n" +
   "					</button>\n" +
   "				</div>\n" +
   "\n" +
   "				<div class=\"well \">Available actions:\n" +
   "					<div class=\"well-sm \">\n" +
   "						<button data-toggle=\"tooltip \" data-placement=\"top \" title=\"Click and drag over elements on the page to select them \" class=\"btn btn-success \" role=\"button \" id=\"startDragDropButton \" onClick=\"startSelectionOfElement(true); \"><span class=\"iconClass-add\"></span> Add element step\n" +
   "						</button>\n" +
   "						<button class=\"btn btn-info\" role=\"button\" id=\"startEmptyStepButton\" onClick=\"startSelectionOfElement(false);\">\n" +
   "							<span class=\"iconClass-add\"></span> Add page step\n" +
   "						</button>\n" +
   "						<button class=\"btn btn-danger \" id=\"cancelDragDropButton \" role=\"button \" onClick=\"jQueryDragSelector.off(); \"><span class=\"iconClass-remove\"></span> Cancel\n" +
   "						</button>\n" +
   "					</div>\n" +
   "				</div>\n" +
   "				<div class=\"alert alert-danger\" id=\"noElementsSelectedDiv\" style=\"display: none;\">\n" +
   "					<button type=\"button\" class=\"close\" onclick=\"jQuery('#noElementsSelectedDiv ').hide();\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span>\n" +
   "					</button>\n" +
   "					No elements were selected, please try again\n" +
   "				</div>\n" +
   "\n" +
   "				<div class=\"alert alert-danger\" id=\"noStepsInPreviewDiv\" style=\"display: none;\">\n" +
   "					<button type=\"button\" class=\"close\" onclick=\"jQuery('#noStepsInPreviewDiv ').hide();\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span>\n" +
   "					</button>\n" +
   "					No steps to preview. Please add steps.\n" +
   "				</div>\n" +
   "			</div>\n" +
   "		</div>\n" +
   "	</div>\n" +
   "</div>\n" +
   "\n" +
   "<div id=\"contentConsumptionModal\" class=\"modal\">\n" +
   "	<div class=\"modal-dialog\">\n" +
   "		<div class=\"modal-content\" style=\"width: 800px;\">\n" +
   "			<div class=\"modal-header ai-modal-title\">\n" +
   "				<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span>\n" +
   "				</button>\n" +
   "				\"What would you like to learn?\n" +
   "			</div>\n" +
   "			<div class=\"modal-body\"></div>\n" +
   "			<div class=\"modal-footer\">\n" +
   "				<button data-dismiss=\"modal\" class=\"btn btn-default\">Close</button>\n" +
   "			</div>\n" +
   "		</div>\n" +
   "	</div>\n" +
   "</div>";
