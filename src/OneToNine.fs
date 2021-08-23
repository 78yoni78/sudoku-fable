module OneToNine

type [<Struct>] OneToNine = 
    | One | Two | Three | Four | Five | Six | Seven | Eight | Nine

module OneToNine =
    let all = [
        One; Two; Three; Four; Five; Six; Seven; Eight; Nine
    ]
    let allSet = set all

    let butNot (seq: #seq<_>) =
        all |> List.filter(fun x -> Seq.contains x seq)

    let ofInt = function
        | 1 -> Some One
        | 2 -> Some Two
        | 3 -> Some Three
        | 4 -> Some Four
        | 5 -> Some Five
        | 6 -> Some Six
        | 7 -> Some Seven
        | 8 -> Some Eight
        | 9 -> Some Nine
        | _ -> None
  
    let toInt = function
        | One -> 1
        | Two -> 2
        | Three -> 3
        | Four -> 4
        | Five -> 5
        | Six -> 6
        | Seven -> 7
        | Eight -> 8
        | Nine -> 9

    let parse = function
        | "1" -> Some One
        | "2" -> Some Two
        | "3" -> Some Three
        | "4" -> Some Four
        | "5" -> Some Five
        | "6" -> Some Six
        | "7" -> Some Seven
        | "8" -> Some Eight
        | "9" -> Some Nine
        | _ -> None
