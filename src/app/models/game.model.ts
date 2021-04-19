export interface Move {
    from: string;
    to: string;
}

export interface Game {
    id: string;
    name: string;
    movesFEN: string[];
    moves: Move[];
    movesHuman?: string;
    movesHumanHistoryRow?: string[];
    isShowing?: boolean;
    inFavorites?: boolean;
    currentMoveNumber?: number;
}
