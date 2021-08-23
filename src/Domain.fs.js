import { Record, Union } from "./.fable/fable-library.3.2.9/Types.js";
import { OneToNineModule_allSet, OneToNineModule_all, OneToNineModule_ofInt, OneToNineModule_toInt, OneToNine$reflection } from "./OneToNine.fs.js";
import { class_type, record_type, union_type } from "./.fable/fable-library.3.2.9/Reflection.js";
import { value as value_1 } from "./.fable/fable-library.3.2.9/Option.js";
import { tryPick, tryHead, isEmpty, filter, map as map_1, collect, delay, toList } from "./.fable/fable-library.3.2.9/Seq.js";
import { count, ofList, FSharpSet_op_Subtraction, unionMany, ofSeq } from "./.fable/fable-library.3.2.9/Set.js";
import { count as count_1, FSharpMap__ContainsKey, FSharpMap__TryFind, remove, add, ofSeq as ofSeq_1, empty, toSeq } from "./.fable/fable-library.3.2.9/Map.js";
import { equals, compare } from "./.fable/fable-library.3.2.9/Util.js";
import { interpolate, toConsole } from "./.fable/fable-library.3.2.9/String.js";
import { singleton } from "./.fable/fable-library.3.2.9/List.js";
import { FSharpChoice$2 } from "./.fable/fable-library.3.2.9/Choice.js";

export class Position1D extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Position1D"];
    }
}

export function Position1D$reflection() {
    return union_type("Domain.Position1D", [], Position1D, () => [[["Item", OneToNine$reflection()]]]);
}

export class Position extends Record {
    constructor(Row, Col) {
        super();
        this.Row = Row;
        this.Col = Col;
    }
}

export function Position$reflection() {
    return record_type("Domain.Position", [], Position, () => [["Row", Position1D$reflection()], ["Col", Position1D$reflection()]]);
}

export class Series extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Series"];
    }
}

export function Series$reflection() {
    return union_type("Domain.Series", [], Series, () => [[["Item", class_type("Microsoft.FSharp.Collections.FSharpMap`2", [Position1D$reflection(), OneToNine$reflection()])]]]);
}

export class Sudoku extends Record {
    constructor(Board) {
        super();
        this.Board = Board;
    }
}

export function Sudoku$reflection() {
    return record_type("Domain.Sudoku", [], Sudoku, () => [["Board", class_type("Microsoft.FSharp.Collections.FSharpMap`2", [Position$reflection(), OneToNine$reflection()])]]);
}

export function PositionModule_row(_arg1) {
    const r = _arg1.Row;
    return r;
}

export function PositionModule_col(_arg1) {
    const c = _arg1.Col;
    return c;
}

export function PositionModule_block(_arg1) {
    const r = _arg1.Row.fields[0];
    const c = _arg1.Col.fields[0];
    const f = (pos) => (~(~((OneToNineModule_toInt(pos) - 1) / 3)));
    return new Position1D(0, value_1(OneToNineModule_ofInt((1 + f(r)) + (3 * f(c)))));
}

export function PositionModule_blockIndex(_arg1) {
    const r = _arg1.Row.fields[0];
    const c = _arg1.Col.fields[0];
    const f = (pos) => ((OneToNineModule_toInt(pos) - 1) % 3);
    return new Position1D(0, value_1(OneToNineModule_ofInt((1 + f(r)) + (3 * f(c)))));
}

export const PositionModule_all = toList(delay(() => collect((row) => map_1((col) => (new Position(new Position1D(0, row), new Position1D(0, col))), OneToNineModule_all), OneToNineModule_all)));

export function SeriesModule_numbers(_arg1) {
    const map = _arg1.fields[0];
    return ofSeq(map_1((tuple) => tuple[1], toSeq(map)), {
        Compare: (x, y) => compare(x, y),
    });
}

export const SudokuModule_empty = new Sudoku(empty());

function SudokuModule_mapFst(f, a, b) {
    return [f(a), b];
}

export function SudokuModule_row(r, s) {
    return new Series(0, ofSeq_1(map_1((tupledArg) => SudokuModule_mapFst((arg00$0040_1) => PositionModule_col(arg00$0040_1), tupledArg[0], tupledArg[1]), filter((arg_1) => equals(r, PositionModule_row(arg_1[0])), toSeq(s.Board)))));
}

export function SudokuModule_col(c, s) {
    return new Series(0, ofSeq_1(map_1((tupledArg) => SudokuModule_mapFst((arg00$0040_1) => PositionModule_row(arg00$0040_1), tupledArg[0], tupledArg[1]), filter((arg_1) => equals(c, PositionModule_col(arg_1[0])), toSeq(s.Board)))));
}

export function SudokuModule_block(b, s) {
    return new Series(0, ofSeq_1(map_1((tupledArg) => SudokuModule_mapFst((arg00$0040_1) => PositionModule_blockIndex(arg00$0040_1), tupledArg[0], tupledArg[1]), filter((arg_1) => equals(b, PositionModule_block(arg_1[0])), toSeq(s.Board)))));
}

export function SudokuModule_set(pos, value, game) {
    return new Sudoku(add(pos, value, game.Board));
}

export function SudokuModule_setEmpty(pos, game) {
    return new Sudoku(remove(pos, game.Board));
}

export function SudokuModule_get(pos, _arg1) {
    const map = _arg1.Board;
    return FSharpMap__TryFind(map, pos);
}

export function SudokuModule_possibilities(pos, s) {
    const matchValue = SudokuModule_get(pos, s);
    if (matchValue == null) {
        let contents;
        const rowContents = SeriesModule_numbers(SudokuModule_row(pos.Row, s));
        const colContents = SeriesModule_numbers(SudokuModule_col(pos.Col, s));
        const blockContents = SeriesModule_numbers(SudokuModule_block(PositionModule_block(pos), s));
        toConsole(interpolate("Row: %P() \nCol: %P() \nBlock: %P()", [rowContents, colContents, blockContents]));
        contents = unionMany([rowContents, colContents, blockContents], {
            Compare: (x_1, y_1) => compare(x_1, y_1),
        });
        return FSharpSet_op_Subtraction(OneToNineModule_allSet, contents);
    }
    else {
        const number = matchValue;
        return ofList(singleton(number), {
            Compare: (x, y) => compare(x, y),
        });
    }
}

export function SudokuModule_emptyPositions(s) {
    return filter((arg) => (!FSharpMap__ContainsKey(s.Board, arg)), PositionModule_all);
}

export function SudokuModule_solved(s) {
    return isEmpty(SudokuModule_emptyPositions(s));
}

export function SudokuModule_wrong(x) {
    const y_1 = count(ofSeq(map_1((tuple) => tuple[1], toSeq(x.Board)), {
        Compare: (x_1, y) => compare(x_1, y),
    })) | 0;
    return count_1(x.Board) === y_1;
}

export function SudokuModule_$007CSolved$007CWrong$007CPartial$007C(x) {
    if (SudokuModule_solved(x)) {
        return new FSharpChoice$2(0, void 0);
    }
    else if (SudokuModule_wrong(x)) {
        return new FSharpChoice$2(1, void 0);
    }
    else {
        return new FSharpChoice$2(2, void 0);
    }
}

export function SudokuModule_solve(s) {
    let x;
    const matchValue = tryHead(SudokuModule_emptyPositions(s));
    if (matchValue != null) {
        const position = matchValue;
        return tryPick((possibility) => {
            toConsole(interpolate("adding %P() to %P() in \n%P()", [possibility, position, s]));
            return SudokuModule_solve(SudokuModule_set(position, possibility, s));
        }, (x = SudokuModule_possibilities(position, s), (toConsole(interpolate("possibilities at %P() are %P()", [position, x])), x)));
    }
    else {
        return s;
    }
}

