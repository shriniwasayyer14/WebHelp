var WebHelpTemplates = {};

WebHelpTemplates["WebHelpConsumption"] = "<div id=\"webHelpMainContent\">\n" +
   "    <div class=\"tabbable\">\n" +
   "        <!-- Only required for left/right tabs -->\n" +
   "        <ul class=\"nav nav-tabs\">\n" +
   "            <li><a href=\"#whatsNew\" data-toggle=\"tab\" target=\"_self\">What's New?</a></li>\n" +
   "            <li class=\"active\"><a href=\"#availableSequences\" data-toggle=\"tab\"  target=\"_self\">Topics</a></li>\n" +
   "        </ul>\n" +
   "        <div class=\"tab-content\">\n" +
   "            <div class=\"tab-pane\" id=\"whatsNew\">\n" +
   "                <div id=\"whatsNewContent\"></div>\n" +
   "            </div>\n" +
   "            <div class=\"tab-pane active\" id=\"availableSequences\">\n" +
   "                <div id=\"availableSequencesContent\"></div>\n" +
   "            </div>\n" +
   "        </div>\n" +
   "    </div>\n" +
   "</div>";

WebHelpTemplates["WebHelpContent"] = "<div id=\"contentConsumptionModal\" class=\"modal\">\n" +
   "	<div class=\"modal-dialog\">\n" +
   "		<div class=\"modal-content\">\n" +
   "			<div class=\"modal-header ai-modal-title\">\n" +
   "				<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span>\n" +
   "				</button>\n" +
   "				What would you like to learn?\n" +
   "			</div>\n" +
   "			<div class=\"modal-body\"></div>\n" +
   "			<div class=\"modal-footer\">\n" +
   "				<button id = \"webHelpEmailButton\" class=\"btn btn-default\">Send Email</button>\n" +
   "				<button data-dismiss=\"modal\" class=\"btn btn-warning\">Close</button>\n" +
   "			</div>\n" +
   "		</div>\n" +
   "	</div>\n" +
   "</div>\n" +
   "";

WebHelpTemplates["WebHelpCreator"] = "<div id=\"webHelpMainContent\">\n" +
   "    <div class=\"tabbable\">\n" +
   "        <!-- Only required for left/right tabs -->\n" +
   "        <ul class=\"nav nav-tabs\">\n" +
   "            <li><a href=\"#addSequence\" data-toggle=\"tab\" target=\"_self\">Add/Edit Sequence</a></li>\n" +
   "            <li><a href=\"#availableSequences\" data-toggle=\"tab\" target=\"_self\">Topics</a></li>\n" +
   "            <li><a href=\"#scratchpad\" data-toggle=\"tab\" target=\"_self\">Scratchpad</a></li>\n" +
   "        </ul>\n" +
   "        <div class=\"tab-content\">\n" +
   "            <div class=\"tab-pane\" id=\"scratchpad\">\n" +
   "                <div id=\"scratchpadContent\"></div>\n" +
   "            </div>\n" +
   "            <div class=\"tab-pane\" id=\"availableSequences\">\n" +
   "                <div id=\"availableSequencesContent\"></div>\n" +
   "            </div>\n" +
   "\n" +
   "            <div class=\"tab-pane\" id=\"addSequence\">\n" +
   "                <div class=\"well\">\n" +
   "                    <section>\n" +
   "                        <div>\n" +
   "                            <input type=\"text\" id=\"sequenceTitleSetter\" placeholder=\"Sequence title\"/>\n" +
   "                        </div>\n" +
   "                        <div id=\"stepsTable\" class=\"table table-bordered table-hover\"></div>\n" +
   "                    </section>\n" +
   "                </div>\n" +
   "                <div class=\"well \"><b>Create new steps:</b>\n" +
   "\n" +
   "                    <div class=\"well-sm \">\n" +
   "                        <button data-toggle=\"tooltip \" data-placement=\"top \"\n" +
   "                                title=\"Click and drag over elements on the page to select them \"\n" +
   "                                class=\"btn btn-success \" role=\"button \" id=\"startDragDropButton\"><span\n" +
   "                                class=\"iconClass-add\"></span> Add element step\n" +
   "                        </button>\n" +
   "                        <button class=\"btn btn-info\" role=\"button\" id=\"startEmptyStepButton\">\n" +
   "                            <span class=\"iconClass-add\"></span> Add page step\n" +
   "                        </button>\n" +
   "                        <button class=\"btn btn-danger \" id=\"cancelDragDropButton\" role=\"button \"><span\n" +
   "                                class=\"iconClass-remove\"></span> Cancel\n" +
   "                        </button>\n" +
   "                    </div>\n" +
   "                </div>\n" +
   "                <div class=\"well\"><b>View or save sequence:</b>\n" +
   "                    <div>\n" +
   "                        <button type=\"button\" id='sequencePreviewButton' class=\"btn btn-default centered actionButton\"\n" +
   "                                aria-label=\"Left Align\" style=\"margin-top:20px;\">\n" +
   "                            <span class=\"iconClass-play\" aria-hidden=\"true \"></span> Preview\n" +
   "                        </button>\n" +
   "                        <button type=\"button \" id='sequenceSaveButton' class=\"btn btn-default centered \"\n" +
   "                                aria-label=\"Left Align \" style=\"margin-top:20px;\">\n" +
   "                            <span class=\"iconClass-save\" aria-hidden=\"true\"></span> Done\n" +
   "                        </button>\n" +
   "                        <button type=\"button\" id='clearStepsButton' class=\"btn btn-default centered\"\n" +
   "                                aria-label=\"Left Align\"\n" +
   "                                style=\"margin-top:20px;\">\n" +
   "                            <span class=\"iconClass-clear\" aria-hidden=\"true \"></span> Clear\n" +
   "                        </button>\n" +
   "                    </div>\n" +
   "                </div>\n" +
   "                <div class=\"alert alert-danger\" id=\"noElementsSelectedDiv\" style=\"display: none;\">\n" +
   "                    <button id=\"noElementsSelectedButton\" type=\"button\" class=\"close\" aria-label=\"Close\"><span\n" +
   "                            aria-hidden=\"true\">&times;</span>\n" +
   "                    </button>\n" +
   "                    No elements were selected, please try again\n" +
   "                </div>\n" +
   "\n" +
   "                <div class=\"alert alert-danger\" id=\"noStepsInPreviewDiv\" style=\"display: none;\">\n" +
   "                    <button id=\"noStepsInPreviewButton\" type=\"button\" class=\"close\" aria-label=\"Close\"><span\n" +
   "                            aria-hidden=\"true\">&times;</span>\n" +
   "                    </button>\n" +
   "                    No steps to preview. Please add steps.\n" +
   "                </div>\n" +
   "\n" +
   "                <div class=\"alert alert-info\" id=\"showSequenceSavedSuccessAlert\" style=\"display: none;\">\n" +
   "                    Sequence saved successfully!\n" +
   "                </div>\n" +
   "            </div>\n" +
   "        </div>\n" +
   "        <div class=\"well\" id=\"globalWebHelpCreatorActionsWell\"><b>Global actions:</b>\n" +
   "\n" +
   "            <div class=\"well-sm \">\n" +
   "                <button class=\"btn btn-info\" role=\"button\" id=\"saveAllHelpSequencesToFileButton\">\n" +
   "                    <span class=\"iconClass-save\"></span> Save all sequences\n" +
   "                </button>\n" +
   "                <button class=\"btn btn-success\" id=\"importAllHelpSequencesFromFileButton\" role=\"button\" title=\"Coming Soon\">\n" +
   "                    <span class=\"iconClass-upload\"></span> Import sequences from file\n" +
   "                </button>\n" +
   "            </div>\n" +
   "        </div>\n" +
   "\n" +
   "    </div>\n" +
   "</div>\n" +
   "\n" +
   "\n" +
   "";

WebHelpTemplates["WebHelpSelectPopup"] = "<div>Go ahead with this selection ?</div>\n" +
   "<div class=\"btn-group\">\n" +
   "	<button type=\"button\" class=\"btn btn-success drag-select-yes\">Yes</button>\n" +
   "	<button type=\"button\" class=\"btn btn-danger drag-select-no\">No</button>\n" +
   "</div>";

WebHelpTemplates["WebHelpSequenceConsumptionList"] = "<ul class=\"webHelpSequenceConsumptionList\">\n" +
   "    <li class=\"webHelpSequenceList header\">\n" +
   "        <div class=\"iconClass-play\"></div>\n" +
   "        <div class=\"webHelpSequenceItem-title\">Topic</div>\n" +
   "        <div class=\"iconClass-edit\"></div>\n" +
   "        <div class=\"iconClass-remove\"></div>\n" +
   "        <div class=\"webHelpSequenceItem-content\">Content</div>\n" +
   "    </li>\n" +
   "</ul>";

WebHelpTemplates["WebHelpSequenceCreationList"] = "<ul class=\"webHelpSequenceCreationList\">\n" +
   "    <li class=\"webHelpSequenceStepListItem header\">\n" +
   "        <div class=\"iconClass-remove\"></div>\n" +
   "        <div class=\"webHelpSequenceListItem-title\">Title</div>\n" +
   "        <div class=\"webHelpSequenceListItem-selectionType\"></div>\n" +
   "        <div class=\"webHelpSequenceListItem-selectionValue\"></div>\n" +
   "        <div class=\"webHelpSequenceListItem-selectionFrame\"></div>\n" +
   "        <div class=\"webHelpSequenceListItem-content\">Content</div>\n" +
   "    </li>\n" +
   "</ul>\n" +
   "";

WebHelpTemplates["WebHelpSequenceListItem"] = "<li class=\"webHelpSequenceList\">\n" +
   "    <div class=\"iconClass-play\"></div>\n" +
   "    <div class=\"webHelpSequenceItem-title\"></div>\n" +
   "    <div class=\"iconClass-edit\"></div>\n" +
   "    <div class=\"iconClass-remove\"></div>\n" +
   "    <div class=\"webHelpSequenceItem-content\">Content</div>\n" +
   "</li>";

WebHelpTemplates["WebHelpSequenceStepListItem"] = "<li class=\"webHelpSequenceStepListItem\">\n" +
   "    <div class=\"iconClass-remove remove-step\"></div>\n" +
   "    <div contenteditable=\"true\" class=\"webHelpSequenceListItem-title\">Editable title</div>\n" +
   "    <div class=\"webHelpSequenceListItem-selectionType\"></div>\n" +
   "    <div class=\"webHelpSequenceListItem-selectionValue\"></div>\n" +
   "    <div class=\"webHelpSequenceListItem-selectionFrame\"></div>\n" +
   "    <div contenteditable=\"true\" class=\"webHelpSequenceListItem-content\">Editable content</div>\n" +
   "</li>\n" +
   "";

WebHelpTemplates["WebHelpSidebarToggle"] = "<span id=\"creationModeSidebarshowHideSpan\">Show/Hide Create Mode</span>";

WebHelpTemplates["WebHelpTableListSearch"] = "<div class=\"webHelpTableListSearch\">\n" +
   "    <label>Search title and content: <input type=\"text\" placeholder=\"Type to search\"></label>\n" +
   "</div>";
