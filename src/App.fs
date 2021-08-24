module App

open Fable.React
open Fable.React.Props
open Elmish
open Elmish.React
open Domain
open OneToNine


type Notice =
    | Unsolvable

type Model = { Game: Sudoku; Notice: Notice option }

type Message =
    | Set of Position * OneToNine option
    | Solve

let init() = { Game=Sudoku.empty; Notice=None }

let update msg model =
    printfn $"Message {msg} dispatched to {model}"
    match msg with
    | Set (pos, None) -> { model with Game=Sudoku.setEmpty pos model.Game }
    | Set (pos, Some number) -> { model with Game=Sudoku.set pos number model.Game }
    | Solve ->
        match Sudoku.solve model.Game with
        | Some game -> { model with Game=game; Notice=None }
        | None -> { model with Notice=Some Unsolvable }

let view (model: Model) dispatch =
    let wrong = Sudoku.wrong model.Game
    //let partial = Sudoku.partial model.Game
    let colors = Map.ofSeq <| seq {
        for pos in Position.all do
            if Seq.exists (Axis.contains pos) wrong then
                yield pos, box "red"
            //elif not <| Seq.exists (Axis.contains pos) partial then
            //    yield pos, box "green"
    }

    let cell position value f =
        input [
            Class "cell"
            Type "text"
            Value (value |> Option.map (OneToNine.toInt >> string) |> Option.defaultValue "")
            Min 1
            Max 9
            Step 1
            OnInput (fun e -> dispatch <| f e.Value)
            Style [
                match colors.TryFind position with Some color -> yield Color color | _ -> ()
            ]
        ]
    
    let table =
        table [ Style [ Height "100%" ] ] [
            tbody [] [
                for row in OneToNine.all ->
                    tr [] [
                        for col in OneToNine.all ->
                            let position = { Row=Position1D row; Col=Position1D col }
                            let rec data = cell position (Sudoku.get position model.Game) (fun value -> Set (position, OneToNine.parse value))
                            td [] [
                                data
                            ]
                    ]
            ]
        ]

    div [ Class "sudoku" ] [
        table
        match Sudoku.classify model.Game with
        | Solved -> str "solved"
        | Wrong _ -> str "wrong"
        | Partial _ -> str "partial"
        br []
        button [ OnClick (fun _ -> dispatch Solve) ] [
            str "Solve"
        ]
        str (match model.Notice with
             | Some Unsolvable -> "Board is unsolvable"
             | None -> "")
    ]

Program.mkSimple init update view
|> Program.withReactBatched "elmish-app"
|> Program.run
