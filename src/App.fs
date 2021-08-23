module App

open Fable
open Fable.React
open Fable.React.Props
open Fable.React.Helpers
open Fable.React.Standard
open Elmish
open Elmish.React
open Domain
open OneToNine


type Model = { Game: Sudoku }

type Message =
    | Set of Position * OneToNine option
    | Solve

let init() = { Game=Sudoku.empty }

let update msg model =
    let mapGame f (model: Model) = { model with Game=f model.Game }
    match msg with
    | Set (pos, None) -> { model with Game=Sudoku.setEmpty pos model.Game }
    | Set (pos, Some number) -> { model with Game=Sudoku.set pos number model.Game }
    | Solve -> mapGame (Sudoku.solve >> Option.defaultValue model.Game) model

let view (model: Model) dispatch =
    let cell value f =
        input [
            Class "cell"
            Type "text"
            Value (value |> Option.map (OneToNine.toInt >> string) |> Option.defaultValue "")
            Min 1
            Max 9
            Step 1
            OnInput (fun e -> dispatch <| f e.Value)
        ]
    
    let table =
        table [ Style [ Height "100%" ] ] [
            tbody [] [
                for row in OneToNine.all ->
                    tr [] [
                        for col in OneToNine.all ->
                            let position = { Row=Position1D row; Col=Position1D col }
                            let rec data = cell (Sudoku.get position model.Game) (fun value -> Set (position, OneToNine.parse value))
                            td [] [
                                data
                            ]
                    ]
            ]
        ]

    div [ Class "sudoku" ] [
        table
        match model.Game with
        | Sudoku.Solved -> str "solved"
        | Sudoku.Wrong -> str "wrong"
        | Sudoku.Partial -> str "partial"
        br []
        button [ OnClick (fun _ -> dispatch Solve) ] [
            str "Solve"
        ]
    ]

Program.mkSimple init update view
|> Program.withReactBatched "elmish-app"
|> Program.run
