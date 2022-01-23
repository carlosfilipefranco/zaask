import { Directive } from "@angular/core";

/**
 * Generated class for the TaskDetailsDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
	selector: "[task-details]" // Attribute selector
})
export class TaskDetailsDirective {
	constructor() {
		console.log("Hello TaskDetailsDirective Directive");
	}
}
