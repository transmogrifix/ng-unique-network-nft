import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'getInitials',
  standalone: true
})
export class GetInitialsPipe implements PipeTransform {

	transform(value: string): string {
		let res = '';

		let words: string[] = value.split(' ');
		res = words[0][0];

		const lastWord = words[words.length - 1];
		if (lastWord && words.length > 1) {
			res += lastWord[0];
		}

		return res;
	}

}
