import { Union, Record } from "./.fable/fable-library.3.2.9/Types.js";
import { SudokuModule_$007CSolved$007CWrong$007CPartial$007C, SudokuModule_get, Position, Position1D, SudokuModule_setEmpty, SudokuModule_set, SudokuModule_solve, SudokuModule_empty, Position$reflection, Sudoku$reflection } from "./Domain.fs.js";
import { union_type, option_type, record_type } from "./.fable/fable-library.3.2.9/Reflection.js";
import { OneToNineModule_all, OneToNineModule_parse, OneToNineModule_toInt, OneToNine$reflection } from "./OneToNine.fs.js";
import { map, defaultArg } from "./.fable/fable-library.3.2.9/Option.js";
import { createElement } from "react";
import { int32ToString } from "./.fable/fable-library.3.2.9/Util.js";
import { Browser_Types_Event__Event_get_Value } from "./.fable/Fable.React.5.0.0-alpha-005/Fable.React.Helpers.fs.js";
import { singleton, append, map as map_1, delay, toList } from "./.fable/fable-library.3.2.9/Seq.js";
import { ProgramModule_mkSimple, ProgramModule_run } from "./.fable/Fable.Elmish.3.1.0/program.fs.js";
import { Program_withReactBatched } from "./.fable/Fable.Elmish.React.3.0.0/react.fs.js";

export class Model extends Record {
    constructor(Game) {
        super();
        this.Game = Game;
    }
}

export function Model$reflection() {
    return record_type("App.Model", [], Model, () => [["Game", Sudoku$reflection()]]);
}

export class Message extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["Set", "Solve"];
    }
}

export function Message$reflection() {
    return union_type("App.Message", [], Message, () => [[["Item1", Position$reflection()], ["Item2", option_type(OneToNine$reflection())]], []]);
}

export function init() {
    return new Model(SudokuModule_empty);
}

export function update(msg, model) {
    const mapGame = (f, model_1) => (new Model(f(model_1.Game)));
    if (msg.tag === 1) {
        return mapGame((arg) => defaultArg(SudokuModule_solve(arg), model.Game), model);
    }
    else if (msg.fields[1] != null) {
        const number = msg.fields[1];
        const pos_1 = msg.fields[0];
        return new Model(SudokuModule_set(pos_1, number, model.Game));
    }
    else {
        const pos = msg.fields[0];
        return new Model(SudokuModule_setEmpty(pos, model.Game));
    }
}

export function view(model, dispatch) {
    const cell = (value, f) => createElement("input", {
        className: "cell",
        type: "text",
        value: defaultArg(map((arg) => int32ToString(OneToNineModule_toInt(arg)), value), ""),
        min: 1,
        max: 9,
        step: 1,
        onInput: (e) => {
            dispatch(f(Browser_Types_Event__Event_get_Value(e)));
        },
    });
    const table = createElement("table", {
        style: {
            height: "100%",
        },
    }, createElement("tbody", {}, ...toList(delay(() => map_1((row) => createElement("tr", {}, ...toList(delay(() => map_1((col) => {
        const position = new Position(new Position1D(0, row), new Position1D(0, col));
        const data = cell(SudokuModule_get(position, model.Game), (value_3) => (new Message(0, position, OneToNineModule_parse(value_3))));
        return createElement("td", {}, data);
    }, OneToNineModule_all)))), OneToNineModule_all)))));
    return createElement("div", {
        className: "sudoku",
    }, ...toList(delay(() => append(singleton(table), delay(() => {
        let activePatternResult14855;
        return append((activePatternResult14855 = SudokuModule_$007CSolved$007CWrong$007CPartial$007C(model.Game), (activePatternResult14855.tag === 1) ? singleton("wrong") : ((activePatternResult14855.tag === 2) ? singleton("partial") : singleton("solved"))), delay(() => append(singleton(createElement("br", {})), delay(() => singleton(createElement("button", {
            onClick: (_arg1_1) => {
                dispatch(new Message(1));
            },
        }, "Solve"))))));
    })))));
}

ProgramModule_run(Program_withReactBatched("elmish-app", ProgramModule_mkSimple(init, (msg, model) => update(msg, model), (model_1, dispatch) => view(model_1, dispatch))));

