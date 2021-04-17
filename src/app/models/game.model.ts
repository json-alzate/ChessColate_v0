export interface Move {
    from: string;
    to: string;
}

export interface Game {
    id: string;
    name: string;
    movesFEN: string[];
    moves: Move[];
    pgn?: string;
    isShowing?: boolean;
    inFavorites?: boolean;
    currentMoveNumber?: number;
}
