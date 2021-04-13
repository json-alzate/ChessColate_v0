export interface Move {
    from: string;
    to: string;
}

export interface Game {
    id: string;
    name: string;
    movesFEM: string[];
    moves: Move[];
    pgn?: string;
    isShowing?: boolean;
    inFavorites?: boolean;
}
