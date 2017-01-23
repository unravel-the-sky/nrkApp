import { Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe {
    // transform(value: Array<any>, args: any[]): any {
    //     let field: string = args[0];
    //     if (value == null) {
    //         console.log('poop');
    //         return null;
    //     }
    //     if (field.startsWith("-")) {
    //         field = field.substring(1);
    //         if (typeof value[field] === 'string' || value[field] instanceof String) {
    //             console.log('1');
    //             return [...value].sort((a, b) => b[field].localeCompare(a[field]));
    //         }
    //         console.log('2');
    //         return [...value].sort((a, b) => b[field] - a[field]);
    //     }
    //     else {
    //         if (typeof value[field] === 'string' || value[field] instanceof String) {
    //             console.log('3');
    //             return [...value].sort((a, b) => -b[field].localeCompare(a[field]));
    //         }
    //         console.log('4');
    //         return [...value].sort((a, b) => a[field] - b[field]);
    //     }
    // }
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