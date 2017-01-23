import { Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe {
    transform(array: Array<string>, args: string): Array<string> {
        array.sort((a: any, b: any) => {
            console.log('sorting..');
            if (a < b) {
                console.log('a < b');
                return -1;
            } else if (a > b) {
                console.log('a > b..');
                return 1;
            } else {
                console.log('poop..');
                console.log(a);
                return 0;
            }
        });
        return array;
    }
}