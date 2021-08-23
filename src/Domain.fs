module Domain

open OneToNine

type Position1D = Position1D of OneToNine
type Position = { Row: Position1D
                  Col: Position1D }

type Series = Series of Map<Position1D, OneToNine>

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

    //let shareRow { Row=Position1D r1 } { Row=Position1D r2 } = r1 = r2
    //let shareCol { Col=Position1D c1 } { Col=Position1D c2 } = c1 = c2
    //let shareBlock { Row=Position1D r1; Col=Position1D c1 } { Row=Position1D r2; Col=Position1D c2 } =
    //    let x1, y1 = f r1, f c1
    //    let x2, y2 = f r2, f c2
    //    x1 = x2 && y1 = y2

module Series =
    let numbers (Series map) = map |> Map.toSeq |> Seq.map snd |> Set.ofSeq

module Sudoku =
    let empty = { Board=Map.empty }

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

    
    let solved (s: Sudoku) =
        emptyPositions s |> Seq.isEmpty
    
    let wrong (x: Sudoku) =
        Map.toSeq x.Board
        |> Seq.map snd
        |> Set.ofSeq
        |> Set.count
        |> (=) (Map.count x.Board)
    
    let (|Solved|Wrong|Partial|) x =
        if solved x then Solved
        elif wrong x then Wrong
        else Partial

    let rec solve (s: Sudoku): Sudoku option = 
        match emptyPositions s |> Seq.tryHead with
        | None -> Some s // already full so must be solved
        | Some position ->
            possibilities position s
            |> fun x -> printfn $"possibilities at {position} are {x}"; x
            //|> Seq.tryHead |> function
            //| Some possibility -> set position possibility s |> solve
            //| None -> failwithf "no possibility!"
            |> Seq.tryPick (fun possibility ->
                printfn $"adding {possibility} to {position} in \n{s}"
                set position possibility s |> solve)
