import { Union } from "./.fable/fable-library.3.2.9/Types.js";
import { union_type } from "./.fable/fable-library.3.2.9/Reflection.js";
import { filter, ofArray } from "./.fable/fable-library.3.2.9/List.js";
import { ofSeq } from "./.fable/fable-library.3.2.9/Set.js";
import { safeHash, equals, compare } from "./.fable/fable-library.3.2.9/Util.js";
import { contains } from "./.fable/fable-library.3.2.9/Seq.js";

export class OneToNine extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    }
}

export function OneToNine$reflection() {
    return union_type("OneToNine.OneToNine", [], OneToNine, () => [[], [], [], [], [], [], [], [], []]);
}

export const OneToNineModule_all = ofArray([new OneToNine(0), new OneToNine(1), new OneToNine(2), new OneToNine(3), new OneToNine(4), new OneToNine(5), new OneToNine(6), new OneToNine(7), new OneToNine(8)]);

export const OneToNineModule_allSet = ofSeq(OneToNineModule_all, {
    Compare: (x, y) => compare(x, y),
});

export function OneToNineModule_butNot(seq) {
    return filter((x) => contains(x, seq, {
        Equals: (x_1, y) => equals(x_1, y),
        GetHashCode: (x_1) => safeHash(x_1),
    }), OneToNineModule_all);
}

export function OneToNineModule_ofInt(_arg1) {
    switch (_arg1) {
        case 1: {
            return new OneToNine(0);
        }
        case 2: {
            return new OneToNine(1);
        }
        case 3: {
            return new OneToNine(2);
        }
        case 4: {
            return new OneToNine(3);
        }
        case 5: {
            return new OneToNine(4);
        }
        case 6: {
            return new OneToNine(5);
        }
        case 7: {
            return new OneToNine(6);
        }
        case 8: {
            return new OneToNine(7);
        }
        case 9: {
            return new OneToNine(8);
        }
        default: {
            return void 0;
        }
    }
}

export function OneToNineModule_toInt(_arg1) {
    switch (_arg1.tag) {
        case 1: {
            return 2;
        }
        case 2: {
            return 3;
        }
        case 3: {
            return 4;
        }
        case 4: {
            return 5;
        }
        case 5: {
            return 6;
        }
        case 6: {
            return 7;
        }
        case 7: {
            return 8;
        }
        case 8: {
            return 9;
        }
        default: {
            return 1;
        }
    }
}

export function OneToNineModule_parse(_arg1) {
    switch (_arg1) {
        case "1": {
            return new OneToNine(0);
        }
        case "2": {
            return new OneToNine(1);
        }
        case "3": {
            return new OneToNine(2);
        }
        case "4": {
            return new OneToNine(3);
        }
        case "5": {
            return new OneToNine(4);
        }
        case "6": {
            return new OneToNine(5);
        }
        case "7": {
            return new OneToNine(6);
        }
        case "8": {
            return new OneToNine(7);
        }
        case "9": {
            return new OneToNine(8);
        }
        default: {
            return void 0;
        }
    }
}

