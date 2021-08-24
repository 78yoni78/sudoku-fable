module Domain

open OneToNine

type [<Struct>] Position1D = Position1D of OneToNine
type [<Struct>] Position = { Row: Position1D
                             Col: Position1D }

type [<Struct>] Series = Series of Map<Position1D, OneToNine>

type [<Struct>] Axis =
    | Row
    | Col
    | Block

type [<Struct>] Classification =
    | Solved
    | Wrong
    | Partial

type Sudoku = { Board: Map<Position, OneToNine> }


module Position =
    let row { Row=r } = r
    let col { Col=c } = c
    let block { Row=Position1D r; Col=Position1D c } =
        let f pos = (OneToNine.toInt pos - 1) / 3
        1 + f r + 3 * f c |> OneToNine.ofInt |> Option.get |> Position1D
    let blockIndex { Row=Position1D r; Col=Position1D c } =
        let f pos = (OneToNine.toInt pos - 1) % 3
        1 + f r + 3 * f c |> OneToNine.ofInt |> Option.get |> Position1D

    let all = [for row in OneToNine.all do for col in OneToNine.all -> { Row=Position1D row; Col=Position1D col }]

module Series =
    let numbers (Series map) = map |> Map.toSeq |> Seq.map snd |> Set.ofSeq

    let count (Series map) = map.Count

    let classify (series: Series) =
        match count series with
        | 0 -> Partial
        | count ->
            let numbers = numbers series
            match numbers.Count = count, count with
            | true, 9 -> Solved
            | true, _ -> Partial
            | false, _ -> Wrong
        

module private SudokuPrelude =
    let private mapFst f (a, b) = (f a, b)

    let row (r: Position1D) (s: Sudoku) =
        s.Board
        |> Map.toSeq
        |> Seq.filter (fst >> Position.row >> (=) r)
        |> Seq.map (mapFst Position.col)
        |> Map.ofSeq
        |> Series

    let col (c: Position1D) (s: Sudoku) =
        s.Board
        |> Map.toSeq
        |> Seq.filter (fst >> Position.col >> (=) c)
        |> Seq.map (mapFst Position.row)
        |> Map.ofSeq
        |> Series

    let block (b: Position1D) (s: Sudoku) =
        s.Board
        |> Map.toSeq
        |> Seq.filter (fst >> Position.block >> (=) b)
        |> Seq.map (mapFst Position.blockIndex)
        |> Map.ofSeq
        |> Series

module Axis =
    let series = function
        | Row -> SudokuPrelude.row
        | Col -> SudokuPrelude.col
        | Block -> SudokuPrelude.block

module Sudoku =
    let empty = { Board=Map.empty }

    let row (r: Position1D) (s: Sudoku) = SudokuPrelude.row r s

    let col (c: Position1D) (s: Sudoku) = SudokuPrelude.col c s

    let block (b: Position1D) (s: Sudoku) = SudokuPrelude.block b s

    let set pos value game = { game with Sudoku.Board=Map.add pos value game.Board }
    let setEmpty pos game = { game with Sudoku.Board=Map.remove pos game.Board }

    let get pos { Sudoku.Board=map } = map.TryFind pos

    let possibilities (pos: Position) (s: Sudoku): Set<OneToNine> =
        match get pos s with
        | Some number -> Set.ofList [number]
        | None ->
            let contents =
                let rowContents = row pos.Row s |> Series.numbers
                let colContents = col pos.Col s |> Series.numbers
                let blockContents = block (Position.block pos) s |> Series.numbers
                printfn $"Row: {rowContents} \nCol: {colContents} \nBlock: {blockContents}"
                Set.unionMany [rowContents; colContents; blockContents]
            OneToNine.allSet - contents

    let emptyPositions (s: Sudoku) =
        Position.all |> Seq.filter (s.Board.ContainsKey >> not)

    let private allAxes: (Axis * Position1D) Set =
        Set [ 
            for number in OneToNine.all do
                for axis in [Row; Col; Block] ->
                    axis, Position1D number
        ]
    
    let wrong (sudoku: Sudoku): (Axis * Position1D) seq =
        seq {
            for axis, position in allAxes do
                let series = Axis.series axis position sudoku
                let numbers = Series.numbers series
                if Series.count series <> numbers.Count then
                    yield (axis, position)
        }
        
    let solved (sudoku: Sudoku): (Axis * Position1D) seq =
        seq {
            for axis, position in allAxes do
                let series = Axis.series axis position sudoku
                let numbers = Series.numbers series
                if Set.count numbers = OneToNine.allSet.Count then
                    yield (axis, position)
        }
    
    let classify (sudoku: Sudoku) =
        let mutable seenPartial = false
        allAxes
        |> Seq.map (fun (axis, pos) -> Axis.series axis pos sudoku)
        |> Seq.map Series.classify
        |> Seq.tryPick (function Wrong -> Some Wrong| Partial -> (seenPartial <- true; None) | Solved -> None)
        |> Option.defaultWith (fun () -> if seenPartial then Partial else Solved)

    let rec solve (s: Sudoku): Sudoku option = 
        match emptyPositions s |> Seq.tryHead with
        | None -> Some s // already full so must be solved
        | Some position ->
            possibilities position s
            |> fun x -> printfn $"possibilities at {position} are {x}"; x
            |> Seq.tryPick (fun possibility ->
                printfn $"adding {possibility} to {position} in \n{s}"
                set position possibility s |> solve)
